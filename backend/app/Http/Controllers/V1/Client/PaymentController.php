<?php

namespace App\Http\Controllers\V1\Client;

use App\Events\TransactionVerified;
use App\Http\Controllers\Controller;
use App\Http\Controllers\V1\VoucherController;
use App\Http\Services\PayPalService;
use App\Http\Services\VNPayService;
use App\Repositories\{TicketRepository, TransactionRepository, UserRepository, VoucherRepository};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Auth, DB, Log};
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

    // Thanh toán
    public function processPayment(Request $request, VoucherController $voucherController)
    {
        $ticket_id = $request->input('ticket_id');

        $ticket = $this->ticketRepository->find($ticket_id);
            if (!$ticket) {
                return response()->json(['message' => 'Vé không tồn tại'], 404);
            }

        $totalAmount = $ticket->price;

        // BEGIN
        DB::beginTransaction();
        try {

            // Kiểm tra có đăng nhập hay không, Nếu có lấy thông tin người dùng đăng nhập, ngược lại đăng kí mới và lấy thông tin đó
            if (Auth::check()) {
                // Nếu người dùng đã đăng nhập, lấy thông tin người dùng hiện tại
                $user = Auth::user();
            } else {
                // Nếu người dùng chưa đăng nhập, tạo mới người dùng từ dữ liệu trong request
                $validatedData = $request->validate([
                    'name' => 'required',
                    'email' => 'required|email',
                    'phone' => 'required'
                ]);
                $user = $this->userRepository->create($validatedData);
            }

            $request->validate([
                'payment_method' => 'required|string|in:cash,paypal',
                'discount_code' => 'nullable|string'
            ]);


            // Mã vé
            $ticketCode = strtoupper(uniqid('TICKET-'));

            $totalAmount = $totalAmount; // Giá trị ban đầu của vé
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
                    'event_id' => $ticket->event_id,
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

            // Dữ liệu giao dịch
            $transactionData = [
                'user_id' => $user->id,
                'ticket_id' => $ticket->id,
                'event_id' => $ticket->event_id,
                'quantity' => 1,
                'ticket_code' => $ticketCode,
                'total_amount' => $totalAmount,
                'payment_method' => $request->payment_method,
                'status' => 'PENDING',
                'order_desc' => 'Thanh toán vé cho sự kiện #' . $ticket->id,
            ];

            // Ghi vào log
            Log::info('Thông tin vé', ['ticket' => $ticket]);
            Log::info('Thông tin giao dịch', ['transaction_data' => $transactionData]);

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
                    'quantity' => 1,
                    'price' => number_format($totalAmountInUSD, 2, '.', ''),
                ]]);

                // Lưu dữ liệu giao dịch trạng thái pending
                $transaction = $this->transactionRepository->createTransaction($transactionData);

                $transaction_id = $transaction->id;

                // Gửi dữ liệu cho thành công hoặc hủy giao dịch
                $paypalService->setReturnUrl(route('payment.success', compact(['transaction_id', 'ticket_id'])))
                    ->setCancelUrl(route('payment.cancel', compact(['transaction_id', 'ticket_id'])));

                // Tạo URL thanh toán PayPal
                $paymentUrl = $paypalService->createPayment('Thanh toán vé cho sự kiện #' . $ticket->id);

                // Lưu dữ liệu thông tin người dùng mua vé
                $user->events()->attach($ticket->event_id, [
                    'ticket_id' => $ticket->id,
                    'ticket_type' => $ticket->ticket_type,
                    'ticket_code' => $ticketCode,
                    'checked_in' => false,
                    'order_date' => now(),
                    'original_price' => $ticket->price,
                    'discount_code' => $discountCode ?? null,
                    'amount' => $totalAmount,
                ]);

                $transaction->update(['payment_url' => $paymentUrl, 'transaction_id' => $transaction->id]);
                DB::commit();
                // session()->flush();
                return response()->json(['message' => 'Chuyển hướng đến PayPal', 'payment_url' => $paymentUrl]);
            } else {

                // Lưu thông tin giao dịch
                $transaction = $this->transactionRepository->createTransaction($transactionData);

                // Giảm số lượng còn lại của vé
                $ticket->decrement('available_quantity', 1);

                // Nếu hết đổi trạng thái thành sold_out
                if ($ticket->available_quantity <= 0) {
                    $ticket->update(['status' => 'sold_out']);
                }

                // Lưu dữ liệu thông tin người dùng mua vé
                $user->events()->attach($ticket->event_id, [
                    'ticket_id' => $ticket->id,
                    'ticket_code' => $ticketCode,
                    'checked_in' => false,
                    'order_date' => now(),
                    'original_price' => $ticket->price,
                    'discount_code' => $discountCode ?? null,
                    'amount' => $totalAmount,
                ]);

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

            return response()->json(['message' => 'Có lỗi trong quá trình thanh toán'], 500);
        }
    }

    // public function processPayment(Request $request, VoucherController $voucherController)
    // {
    //     $ticket_id = $request->input('ticket_id');
    //     $ticket = $this->ticketRepository->find($ticket_id);
    
    //     if (!$ticket) {
    //         return response()->json(['message' => 'Vé không tồn tại'], 404);
    //     }
    
    //     $totalAmount = $ticket->price;
    
    //     DB::beginTransaction();
    //     try {
    //         // Kiểm tra nếu người dùng đã đăng nhập
    //         if (Auth::check()) {
    //             $user = Auth::user();
    //         } else {
    //             // Nếu chưa đăng nhập, yêu cầu thông tin bắt buộc
    //             $validatedData = $request->validate([
    //                 'name' => 'required',
    //                 'email' => 'required|email',
    //                 'phone' => 'required'
    //             ]);
    //             $user = $this->userRepository->create($validatedData);
    //         }
    
    //         // Validate phương thức thanh toán và mã giảm giá
    //         $request->validate([
    //             'payment_method' => 'required|string|in:cash,paypal,vnpay',
    //             'discount_code' => 'nullable|string'
    //         ]);
    
    //         $ticketCode = strtoupper(uniqid('TICKET-'));
    //         $discountCode = $request->input('discount_code');
    //         $voucher = $this->voucherRepository->findByCode($discountCode);
    
    //         // Kiểm tra tính hợp lệ của mã giảm giá
    //         if ($discountCode) {
    //             if (!$voucher) {
    //                 return response()->json(['error' => 'Mã giảm giá không tồn tại'], 400);
    //             }
    
    //             // Áp dụng mã giảm giá
    //             $voucherRequest = new Request([
    //                 'event_id' => $ticket->event_id,
    //                 'user_id' => $user->id,
    //                 'code' => $discountCode
    //             ]);
    
    //             $voucherResponse = $voucherController->apply($voucherRequest, $totalAmount);
    
    //             if ($voucherResponse->getData()->success === false) {
    //                 return response()->json(['error' => $voucherResponse->getData()->message], 400);
    //             }
    
    //             $totalAmount = $voucherResponse->getData()->data->total_price;
    //         }
    
    //         // Dữ liệu giao dịch
    //         $transactionData = [
    //             'user_id' => $user->id,
    //             'ticket_id' => $ticket->id,
    //             'event_id' => $ticket->event_id,
    //             'quantity' => 1,
    //             'ticket_code' => $ticketCode,
    //             'total_amount' => $totalAmount,
    //             'payment_method' => $request->payment_method,
    //             'status' => 'PENDING',
    //             'order_desc' => 'Thanh toán vé cho sự kiện #' . $ticket->id,
    //         ];
    
    //         Log::info('Thông tin vé', ['ticket' => $ticket]);
    //         Log::info('Thông tin giao dịch', ['transaction_data' => $transactionData]);
    
    //         // Xử lý thanh toán với VNPay
    //         if ($request->payment_method === 'vnpay') {
    //             $vnpayService = new VNPayService();
    
    //             // Gọi trực tiếp phương thức create trong VNPayService để tạo URL thanh toán
    //             return $vnpayService->create($request);
    //         } else {
    //             // Thanh toán qua tiền mặt hoặc phương thức khác
    //             $transaction = $this->transactionRepository->createTransaction($transactionData);
    //             $ticket->decrement('available_quantity', 1);
    
    //             // Kiểm tra trạng thái vé và cập nhật nếu hết vé
    //             if ($ticket->available_quantity <= 0) {
    //                 $ticket->update(['status' => 'sold_out']);
    //             }
    
    //             // Thêm người dùng vào sự kiện đã mua vé
    //             $user->events()->attach($ticket->event_id, [
    //                 'ticket_id' => $ticket->id,
    //                 'ticket_code' => $ticketCode,
    //                 'checked_in' => false,
    //                 'order_date' => now(),
    //                 'original_price' => $ticket->price,
    //                 'discount_code' => $discountCode ?? null,
    //                 'amount' => $totalAmount,
    //             ]);
    
    //             DB::commit();
    //             return response()->json(['message' => 'Thanh toán thành công', 'transaction_id' => $transaction->id]);
    //         }
    //     } catch (Exception $e) {
    //         DB::rollBack();
    //         Log::error('Lỗi xử lý thanh toán', ['error' => $e->getMessage()]);
    //         return response()->json(['message' => 'Có lỗi trong quá trình thanh toán'], 500);
    //     }
    // }

    // Xác thực thành công khi thanh toán bằng Paypal
    public function paymentSuccess(Request $request)
    {

        // Dữ liệu gửi đi theo route từ trên
        $transactionId = $request->query('transaction_id');
        $ticketId = $request->query('ticket_id');

        if (!$transactionId) {
            return response()->json(['message' => 'Không tìm thấy mã giao dịch'], 400);
        }

        // Tìm kiếm giao dịch theo id
        $transaction = $this->transactionRepository->findTransactionById($transactionId);

        if (!$transaction) {
            return response()->json(['message' => 'Giao dịch không tồn tại'], 404);
        }

        // Tìm vé theo id
        $ticket = $this->ticketRepository->find($ticketId);

        // Giảm số lượng vé đi 1
        $ticket->decrement('available_quantity', 1);

        // Nếu vé hết lượt mua đổi trạng thái thành sold_out
        if ($ticket->available_quantity <= 0) {
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
        return response()->json(['message' => 'Thanh toán đã bị hủy.']);
    }
}
