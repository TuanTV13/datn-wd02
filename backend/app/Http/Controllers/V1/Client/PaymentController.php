<?php

namespace App\Http\Controllers\V1\Client;

use App\Events\TransactionVerified;
use App\Http\Controllers\Controller;
use App\Http\Controllers\V1\VoucherController;
use App\Http\Services\MoMoService;
use App\Http\Services\PayPalService;
use App\Http\Services\VNPayService;
use App\Models\SeatZone;
use App\Models\Ticket;
use App\Models\Transaction;
use App\Repositories\{TicketRepository, TransactionRepository, UserRepository, VoucherRepository};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Auth, DB, Log};
use Illuminate\Support\Str;
use Exception;
use GuzzleHttp\Client;

class PaymentController extends Controller
{
    protected $ticketRepository, $transactionRepository, $userRepository, $voucherRepository;

    public function __construct(TicketRepository $ticketRepo, TransactionRepository $transRepo, UserRepository $userRepo, VoucherRepository $voucherRepo)
    {
        $this->ticketRepository = $ticketRepo;
        $this->transactionRepository = $transRepo;
        $this->userRepository = $userRepo;
        $this->voucherRepository = $voucherRepo;
    }

    // Phương thức quy đổi tỉ giá USD to VND
    public function getExchangeRate()
    {
        $client = new Client();
        $apiKey = env('FIXER_API_KEY'); // API key từ dịch vụ Fixer.io
        $url = "http://data.fixer.io/api/latest?access_key={$apiKey}&symbols=USD,VND";

        try {
            $response = $client->get($url);
            $data = json_decode($response->getBody()->getContents(), true);

            if (isset($data['success']) && $data['success'] === true) {
                $usdToVnd = $data['rates']['VND'] / $data['rates']['USD']; // Tỷ giá USD/VND
                return $usdToVnd;
            }

            throw new Exception("Không thể lấy tỷ giá");
        } catch (Exception $e) {
            Log::error('Lỗi khi lấy tỷ giá từ API', ['error' => $e->getMessage()]);
            return 23000; // Trả về tỷ giá mặc định nếu lỗi
        }
    }

    // Check out chọn vé
    public function checkout(Request $request)
    {
        $request->validate([
            'ticket_id' => 'required|exists:tickets,id',
        ]);

        $ticket = $this->ticketRepository->find($request->ticket_id);
        if ($ticket->available_quantity < 1) {
            return response()->json(['message' => 'Số lượng vé không đủ'], 400);
        }

        // Mặc định chỉ cho mua 1 vé
        $totalAmount = $ticket->price;
        session(['checkout_data' => ['ticket_id' => $ticket->id, 'quantity' => 1, 'total_amount' => $totalAmount]]);

        return response()->json(['message' => 'Đã chọn vé', 'total_amount' => $totalAmount]);
    }

    private function checkTicketLimit($event_id, $user_id, $ticket_id, $zone_name, $seatZoneID, $quantity_requested) {
        // Lấy số lượng vé tối đa mà sự kiện cho phép
        $max_tickets = DB::table('ticket_prices')->where('event_id', $event_id)->where('ticket_id', $ticket_id)->where('seat_zone_id', $seatZoneID)->value('purchase_limit');

        // Tính tổng số lượng vé mà người dùng đã mua cho sự kiện này
        $tickets_bought = DB::table('event_users')
        ->join('ticket_prices', function($join) use ($seatZoneID) {
            $join->on('ticket_prices.event_id', '=', 'event_users.event_id')
                 ->on('ticket_prices.ticket_id', '=', 'event_users.ticket_id')
                 ->where('ticket_prices.seat_zone_id', '=', $seatZoneID);
        })
        ->where('event_users.event_id', $event_id)
        ->where('event_users.user_id', $user_id)
        ->where('event_users.ticket_id', $ticket_id)
        ->where('event_users.seat_zone', $zone_name)
        ->count();
    
        // Tính tổng số vé sau khi thêm yêu cầu mới
        $total_tickets = $tickets_bought + $quantity_requested;
    
        // Kiểm tra nếu tổng vé vượt quá giới hạn
        if ($total_tickets > $max_tickets) {
            return response()->json([
                'message' => "Bạn đã mua quá số lượng vé cho phép cho khu vực chỗ ngồi: {$zone_name} với số lượng tối đa là {$max_tickets}."
            ], 400);
        }
    }

    // Thanh toán
    public function processPayment(Request $request, VoucherController $voucherController)
    {
        $validated = $request->validate([
            'tickets' => 'required|array',
            'tickets.*.ticket_id' => 'required|integer',
            'tickets.*.ticket_type' => 'required|string|in:VIP,Thường,Mời',
            'tickets.*.quantity' => 'required|integer|min:1',
            'tickets.*.seat_zone_id' => 'required|integer',
            'tickets.*.seat_zone' => 'required|string',
            'tickets.*.original_price' => 'required|numeric|min:0',
            'payment_method' => 'required|string'
        ], [
            'tickets.required' => 'Vui lòng chọn vé',
            'tickets.*.ticket_id.required' => 'Vé không tồn tại',
            'tickets.*.ticket_type.required' => 'Vui lòng chọn loại vé',
            'tickets.*.quantity.required' => 'Vui lòng chọn số lượng vé',
            'tickets.*.quantity.min' => 'Số lượng vé không hợp lệ',
            'tickets.*.seat_zone_id.required' => 'Vui lòng chọn vị trí ghế',
            'tickets.*.seat_zone.required' => 'Vui lòng chọn vị trí ghế',
            'tickets.*.original_price.required' => 'Vui lòng chọn vé',
            'tickets.*.original_price.numeric' => 'Giá vé không hợp lệ',
            'tickets.*.original_price.min' => 'Giá vé không hợp lệ',
            'payment_method.required' => 'Vui lòng chọn phương thức thanh toán'
        ]);

        $totalAmount = 0;
        $qty = 0;
        foreach ($validated['tickets'] as $ticket) {
            $ticket_id = $ticket['ticket_id'];
            $quantity = $ticket['quantity'] ?? 1;
            $qty += $ticket['quantity'] ?? 1;
            $seatId = $ticket['seat_zone_id'];
            $amount = $ticket['original_price'];

            $ticket = $this->ticketRepository->find($ticket_id);
            $ticketZone = $ticket->price()->where('seat_zone_id', $seatId)->first();
            if (!$ticket) {
                return response()->json(['message' => 'Vé không tồn tại'], 404);
            }

            if ($ticketZone->sold_quantity < $quantity) {
                return response()->json(['message' => 'Số lượng vé không đủ'], 400);
            }

            if ($quantity > $ticketZone->purchase_limit) {
                return response()->json(['message' => 'Số lượng vé vượt quá giới hạn cho phép'], 400);
            }

            $totalAmount += $ticketZone->price * $quantity;
        }

        $zones = new SeatZone();
        $zone = $zones->where('id', $seatId)->first();

        DB::beginTransaction();
        try {
            // Kiểm tra có đăng nhập hay không, Nếu có lấy thông tin người dùng đăng nhập, ngược lại đăng kí mới và lấy thông tin đó
            if (Auth::check()) {
                $user = Auth::user();
            } else {
                try {
                    // Kiểm tra dữ liệu gửi lên có hợp lệ hay không
                    $validatedData = $request->validate([
                        'name' => 'required',
                        'email' => 'required|email',
                        'phone' => 'required'
                    ], [
                        'name.required' => 'Vui lòng nhập họ tên',
                        'email.required' => 'Vui lòng nhập email',
                        'email.email' => 'Email không hợp lệ',
                        'phone.required' => 'Vui lòng nhập số điện thoại'
                    ]);
                } catch (\Illuminate\Validation\ValidationException $e) {
                    // Trả về phản hồi JSON khi có lỗi xác thực
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Dữ liệu không hợp lệ',
                        'errors' => $e->errors()
                    ], 422);
                }

                $user = $this->userRepository->create($validatedData);
            }

            $request->validate([
                'payment_method' => 'required|string|in:cash,paypal,vnpay',
                'discount_code' => 'nullable|string'
            ]);

            foreach($validated['tickets'] as $item) {
                // Kiểm tra giới hạn số vé trước khi tiếp tục
                $result = $this->checkTicketLimit($ticket->event_id, $user->id, $item['ticket_id'], $item['seat_zone'], $item['seat_zone_id'], $item['quantity']);
    
                // Nếu có lỗi, trả về ngay lập tức
                if ($result != null) {
                    if ($result->getStatusCode() == 400) {
                        return $result; // Trả về lỗi nếu có
                    }
                }
            }

            $discountCode = $request->input('discount_code');  // Mã giảm giá
            $voucher = $this->voucherRepository->findByCode($discountCode); // Tìm kiếm theo discount_code

            // Kiểm tra tính hợp lệ của mã giảm giá
            if ($discountCode) {
                if (!$voucher) {
                    return response()->json([
                        'error' => 'Mã giảm giá không tồn tại'
                    ]);
                }

                $voucherRequest = new Request([
                    'event_id' => $zone->event_id,
                    'user_id' => $user->id,
                    'code' => $discountCode
                ]);

                // Gọi đến phương thức apply của VoucherController
                $voucherResponse = $voucherController->apply($voucherRequest, $totalAmount);

                if ($voucherResponse->getData()->success === false) {
                    return response()->json(['error' => $voucherResponse->getData()->message], 400);
                }

                $totalAmount = $voucherResponse->getData()->data->total_price; // Giá tiền sau khi sử dụng mã giảm giá
            }

            $tickets = [];

            foreach ($validated['tickets'] as $item) {
                // Lặp qua số lượng vé (quantity)
                for ($i = 0; $i < $item['quantity']; $i++) {

                    $ticketCode = 'TICKET-' . strtoupper(uniqid());

                    $tickets[] = [
                        'event_id' => $zone->event_id,
                        'ticket_id' => $item['ticket_id'],
                        'ticket_code' => $ticketCode,
                        'ticket_type' => $item['ticket_type'],
                        'seat_zone_id' => $item['seat_zone_id'],
                        'seat_zone' => $item['seat_zone'],
                        'quantity' => 1,
                        'original_price' => $item['original_price'],
                    ];
                }
            }
            
            // Dữ liệu giao dịch
            $transactionData = [
                'user_id' => $user->id,
                'event_id' => $zone->event_id,
                'transaction_code' => Str::uuid()->toString(),
                'quantity' => $qty,
                'total_amount' => $totalAmount,
                'payment_method' => $request->payment_method,
                'status' => 'PENDING',
                'tickets' => $tickets,
                'order_desc' => 'Thanh toán vé cho sự kiện #' . $ticket->even_id,
            ];

            // Tiến hành thanh toán theo phương thức đã chọn
            if ($request->payment_method === 'paypal') {
                if (empty($ticket->ticket_type) || empty($totalAmount) || !is_numeric($totalAmount)) {
                    return response()->json(['message' => 'Thông tin vé không đầy đủ'], 400);
                }

                // Gọi đến phương thức getExchangeRate() để quy đổi tỉ giá
                $exchangeRate = $this->getExchangeRate();
                $totalAmountInUSD = $totalAmount / $exchangeRate;

                $paypalService = new PayPalService();

                // Set Items cho Paypal
                $paypalService->setItem([[
                    'name' => 'Vé ' . $ticket->ticket_type,
                    'sku' => $ticket->id,
                    'quantity' => $request->quantity,
                    'price' => number_format($totalAmountInUSD, 0, '.', ''),
                ]]);

                // Lưu dữ liệu giao dịch trạng thái pending
                $transaction = $this->transactionRepository->createTransaction($transactionData);

                $transaction_id = $transaction->id;

                // Gửi dữ liệu cho thành công hoặc hủy giao dịch
                $paypalService->setReturnUrl(route('payment.success', compact(['transaction_id', 'ticket_id'])))
                    ->setCancelUrl(route('payment.cancel', compact(['transaction_id', 'ticket_id'])));

                // Tạo URL thanh toán PayPal
                $paymentUrl = $paypalService->createPayment('Thanh toán vé cho sự kiện #' . $ticket->event_id);

                // Lưu dữ liệu thông tin người dùng mua vé
                foreach ($tickets as $ticket) {
                    $user->events()->attach($ticket['event_id'], [
                        'ticket_id' => $ticket['ticket_id'],
                        'seat_zone_id' => $ticket['seat_zone_id'],
                        'ticket_type' => $ticket['ticket_type'],
                        'ticket_code' => $ticket['ticket_code'],
                        'seat_zone' => $ticket['seat_zone'],
                        'checked_in' => false,
                        'order_date' => now(),
                        'original_price' => $ticket['original_price'],
                        'discount_code' => $discountCode ?? null,
                        'amount' => $totalAmount,
                    ]);
                }

                $transaction->update(['payment_url' => $paymentUrl, 'transaction_id' => $transaction->id]);
                DB::commit();
                // session()->flush();
                return response()->json(['message' => 'Chuyển hướng đến PayPal', 'payment_url' => $paymentUrl]);
            } elseif ($request->payment_method === 'vnpay') {
                $transaction = $this->transactionRepository->createTransaction($transactionData);
                Log::info('VNPay transaction', ['transaction' => $transaction]);
                $transaction_id = $transaction->id;
                Log::info('VNPay transaction_id', ['transaction_id' => $transaction_id]);

                foreach ($tickets as $ticket) {
                    $user->events()->attach($ticket['event_id'], [
                        'ticket_id' => $ticket['ticket_id'],
                        'seat_zone_id' => $ticket['seat_zone_id'],
                        'ticket_type' => $ticket['ticket_type'],
                        'ticket_code' => $ticket['ticket_code'],
                        'seat_zone' => $ticket['seat_zone'],
                        'checked_in' => false,
                        'order_date' => now(),
                        'original_price' => $ticket['original_price'],
                        'discount_code' => $discountCode ?? null,
                        'amount' => $totalAmount,
                    ]);
                }

                DB::commit(); // Commit giao dịch trước khi gọi VNPay Service

                $vnpayService = new VNPayService();

                // Gọi hàm tạo URL thanh toán VNPay
                return $vnpayService->create($request, $transaction_id, $totalAmount);
            } else {
                // Lưu thông tin giao dịch
                $transaction = $this->transactionRepository->createTransaction($transactionData);

                // Giảm số lượng còn lại của vé
                $ticketZone->decrement('sold_quantity', $quantity);

                // Nếu hết đổi trạng thái thành sold_out
                if ($ticketZone->sold_quantity <= 0) {
                    $ticket->update(['status' => 'sold_out']);
                }

                foreach ($tickets as $ticket) {
                    $user->events()->attach($ticket['event_id'], [
                        'ticket_id' => $ticket['ticket_id'],
                        'ticket_type' => $ticket['ticket_type'],
                        'ticket_code' => $ticket['ticket_code'],
                        'seat_zone' => $ticket['seat_zone'],
                        'checked_in' => false,
                        'order_date' => now(),
                        'original_price' => $ticket['original_price'],
                        'discount_code' => $discountCode ?? null,
                        'amount' => $totalAmount,
                    ]);
                }

                DB::commit();
                // session()->flush();
                Log::info('Thanh toán thành công', ['transaction_id' => $transaction->id, 'ticket_id' => $ticket->id]);
                return response()->json(['message' => 'Thanh toán thành công', 'transaction_id' => $transaction->id]);
            }
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Lỗi khi gọi API PayPal', [
                'response_code' => $e->getCode(),
                'response_body' => $e->getMessage(),
                'request' => $request->all()
            ]);
            Log::error('Lỗi xử lý thanh toán sự kiện', ['error' => $e->getMessage(), 'request' => $request->all()]);
            Log::info('PayPal Config', [
                'client_id' => env('PAYPAL_CLIENT_ID'),
                'secret' => env('PAYPAL_CLIENT_SECRET'),
            ]);
            Log::error('Thông tin yêu cầu gửi đến PayPal', ['request' => $request->all()]);

            return response()->json(['message' => 'Có lỗi trong quá trình thanh toán', 'err' => $e->getMessage()], 500);
        }
    }

    public function handleReturn(Request $request)
    {
        $responseCode = $request->input('vnp_ResponseCode');
        $transaction_id = $request->input('transaction_id');;

        // Ghi log kiểm tra dữ liệu trả về  
        Log::info('VNPay handleReturn called', ['request' => $request->all()]);

        // Kiểm tra mã phản hồi có thành công không  
        if ($responseCode == '00') {
            $transaction = Transaction::find($transaction_id);

            if (!$transaction) {
                Log::error('Không tìm thấy giao dịch với ID: ' . $transaction_id);
                return response()->json(['message' => 'Giao dịch không tồn tại'], 404);
            }

            if ($transaction->status == 'pending') {
                $transaction->status = 'completed';
                $transaction->save();

                foreach ($transaction->tickets as $ticketData) {

                    $ticket_id = $ticketData['ticket_id'];
                    $seat_zone_id = $ticketData['seat_zone_id'];

                    $ticket = Ticket::find($ticket_id);
                    if ($ticket) {
                        $ticketZone = $ticket->price()->where('seat_zone_id', $seat_zone_id)->first();
                        if ($ticketZone) {
                            // Kiểm tra nếu số lượng vé còn đủ để trừ
                            if ($ticketZone->sold_quantity >= $ticketData['quantity']) {
                                // Giảm số lượng vé
                                $ticketZone->decrement('sold_quantity', $ticketData['quantity']);

                                // Kiểm tra nếu đã bán hết vé
                                if ($ticketZone->sold_quantity <= 0) {
                                    $ticket->update(['status' => 'sold_out']);
                                }
                            }
                        }
                    }
                }
            }

            // Gửi sự kiện xác thực giao dịch  
            event(new TransactionVerified($transaction));

            return response()->json(['message' => 'Thanh toán thành công'], 200);
        }

        // Kiểm tra giao dịch thất bại hoặc bị hủy  
        if ($responseCode == '24') {
            $transaction = Transaction::find($transaction_id);

            if ($transaction) {
                $transaction->update(['status' => 'FAILED']);

                if ($transaction->status == 'FAILED') {
                    foreach ($transaction->tickets as $ticket) {
                        DB::table('event_users')
                            ->where('user_id', $transaction->user_id)
                            ->where('ticket_code', $ticket['ticket_code']) // Dùng ticket_code từ mỗi vé
                            ->delete();
                    }
                }
            } else {
                Log::error('Không tìm thấy giao dịch để hủy với ID: ' . $transaction_id);
            }

            Log::info('VNPay giao dịch thất bại hoặc hủy', ['response_code' => $responseCode]);
            return response()->json(['message' => 'Thanh toán thất bại'], 400);
        }

        Log::info('VNPay giao dịch không thành công, response_code không khớp', ['response_code' => $responseCode]);
        return response()->json(['message' => 'Không rõ trạng thái giao dịch'], 400);
    }

    // Xác thực thành công khi thanh toán bằng Paypal.
    public function paymentSuccess(Request $request)
    {
        // Dữ liệu gửi đi theo route từ trên
        $transactionId = $request->query('transaction_id');
        $ticketId = $request->query('ticket_id');
        $seatZoneId = $request->query('seat_zone_id');
        $quantity = $request->query('quantity');

        if (!$transactionId) {
            return response()->json(['message' => 'Không tìm thấy mã giao dịch'], 400);
        }

        // Tìm kiếm giao dịch theo id.
        $transaction = $this->transactionRepository->findTransactionById($transactionId);

        if (!$transaction) {
            return response()->json(['message' => 'Giao dịch không tồn tại'], 404);
        }

        // Tìm vé theo id
        $ticket = $this->ticketRepository->find($ticketId);

        $ticketZone = $ticket->price()->where('seat_zone_id', $seatZoneId)->first();
        // Giảm số lượng vé đi 1
        $ticketZone->decrement('sold_quantity', $quantity);

        // Nếu vé hết lượt mua đổi trạng thái thành sold_out.
        if ($ticketZone->sold_quantity <= 0) {
            $ticket->update(['status' => 'sold_out']);
        }

        // Đổi trạng thái thanh toán thành completed và gửi mail cho khách hàng
        $transaction->update(['status' => 'COMPLETED']);
        event(new TransactionVerified($transaction));

        return redirect('http://localhost:5173/payment-history');
    }

    // Xử lý giao dịch khi bị hủy thanh toán
    public function paymentCancel(Request $request)
    {
        $transactionId = $request->query('transaction_id');

        if (!$transactionId) {
            return response()->json(['message' => 'Không tìm thấy mã giao dịch'], 400);
        }

        $transaction = $this->transactionRepository->findTransactionById($transactionId);

        if (!$transaction) {
            return response()->json(['message' => 'Giao dịch không tồn tại'], 404);
        }

        $transaction->update(['status' => 'FAILED']);

        if ($transaction->status == 'FAILED') {
            DB::table('event_users')
                ->where('user_id', $transaction->user_id)
                ->where('ticket_code', $transaction->ticket_code)
                ->delete();
        }

        return response()->json(['message' => 'Thanh toán đã bị hủy.']);
    }

    public function notifyMomo(Request $request)
    {
        // Lấy dữ liệu từ thông báo của MoMo
        $data = $request->all();

        // Gọi dịch vụ MoMoService để xử lý logic
        $momoService = new MoMoService();

        // Kiểm tra chữ ký và xử lý dữ liệu
        $response = $momoService->handleReturn($request);

        // Log dữ liệu thông báo (nếu cần)
        Log::info('MoMo Notify:', $data);

        // Trả về phản hồi thành công cho MoMo
        return response()->json(['status' => 'success']);
    }
}