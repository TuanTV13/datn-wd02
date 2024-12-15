<?php

namespace App\Http\Controllers\V1;

use App\Enums\EventStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTicketRequest;
use App\Http\Requests\Admin\UpdateTicketRequest;
use App\Models\EventUser;
use App\Models\Ticket;
use App\Repositories\EventRepository;
use App\Repositories\TicketRepository;
// use Barryvdh\DomPDF\Facade\Pdf;
use PDF;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class TicketController extends Controller
{
    protected $ticketRepository, $eventRepository;

    public function __construct(TicketRepository $ticketRepository, EventRepository $eventRepository)
    {
        $this->ticketRepository = $ticketRepository;
        $this->eventRepository = $eventRepository;
    }

    protected function checkSaleEndTime($saleEnd, $eventStart)
    {
        $eventStart = \Carbon\Carbon::parse($eventStart);
        $saleEnd = \Carbon\Carbon::parse($saleEnd);

        if ($saleEnd->greaterThanOrEqualTo($eventStart)) {
            return response()->json([
                'message' => 'Thời gian kết thúc bán vé phải trước khi sự kiện diễn ra ít nhất 2 ngày.'
                    . " (Thời gian bắt đầu sự kiện: {$eventStart->toDateTimeString()})"
                    . " (Thời gian kết thúc bán vé: {$saleEnd->toDateTimeString()})"
            ], 400);
        }

        return null;
    }

    public function getBlockById($id)
    {
        $tickets = $this->ticketRepository->findTrashed($id);
        return response()->json([
            'data' => $tickets
        ]);
    }

    public function listBlock()
    {
        $data = $this->ticketRepository->trashed();

        return response()->json([
            'data' => $data
        ]);
    }

    public function findTicketDataByEventAndType($eventId = null, $ticketTypeId = null)
    {
        // Tìm vé theo event_id và ticket_type
        $model = new Ticket();
        $ticket = $model->where('event_id', $eventId)
            ->where('ticket_type', $ticketTypeId)
            ->first();
        if ($ticket) {
            // Trả về vé cùng với các dữ liệu cần thiết
            return [
                'sale_start' => $ticket->sale_start,
                'sale_end' => $ticket->sale_end,
                'price' => $ticket->price,
                'seat_location' => $ticket->seat_location
            ];
        }
        // Trả về null nếu không tìm thấy vé
        return null;
    }

    public function index()
    {
        $tickets = $this->ticketRepository->getAll();

        return response()->json([
            'data' => $tickets
        ]);
    }

    public function verifiedTicket($id)
    {
        $ticket = $this->ticketRepository->find($id);

        if (!$ticket) {
            return response()->json([
                'message' => 'Vé không tồn tại.'
            ], 404);
        }

        if ($ticket->status == "pending") {
            $ticket->status = 'confirmed';
            $ticket->save();

            return response()->json([
                'message' => 'Xác nhận vé thành công',
                'data' => $ticket
            ], 200);
        }

        return response()->json([
            'message' => 'Vé đã được xác nhận trước đó hoặc không đủ điều kiện để xác nhận.'
        ], 400);
    }

    public function create(StoreTicketRequest $request)
    {
        DB::beginTransaction();
        $data = $request->validated();
        $data['sold_quantity'] = $data['quantity'];
        $data['status'] = 'confirmed';

        
        $event = $this->eventRepository->find($request->event_id);

        if ($event->status == 'ongoing') {
            return response()->json([
                'message' => 'Sự kiện đâng diễn ra không thể tạo thêm vé.',
            ], 400);
        }
        if ($event->status == 'canceled') {
            return response()->json([
                'message' => 'Sự kiện đã bị hủy không thể tạo thêm vé.',
            ], 400);
        }
        if ($event->status == 'completed') {
            return response()->json([
                'message' => 'Sự kiện đã hoàn thành không thể tạo thêm vé.',
            ], 400);
        }
        if ($event->status == 'checkin') {
            return response()->json([
                'message' => 'Sự kiện đâng được checkin không thể tạo thêm vé.',
            ], 400);
        }

        if (strtotime($request->sale_end) >= strtotime($event->start_time)) {
            return response()->json([
                'message' => 'Thời gian kết thúc bán vé phải trước thời gian bắt đầu sự kiện. Thời gian bắt đầu sự kiện là: '. $event->start_time,
            ], 400);
        }


        $ticketType = $request->ticket_type;
        $zoneName = $request->name;

        $existingTicket = $this->ticketRepository->findByTicketTypeAndZoneName($ticketType, $zoneName, $request->event_id);

        if ($existingTicket) {
            return response()->json([
                'message' => 'Vé với loại và khu vực này đã tồn tại, vui lòng kiểm tra lại.',
            ], 400);
        }

        $ticketType = $this->ticketRepository->findByType($ticketType, $request->event_id);

        try {

            if ($ticketType) {

                $zone = $ticketType->zone()->create([
                    'event_id' => $request->event_id,
                    'name' => $request->name
                ]);

                $data = $ticketType->price()->create([
                    'event_id' => $request->event_id,
                    'ticket_id' => $ticketType->id,
                    'seat_zone_id' => $zone->id,
                    'price' => $request->price,
                    'quantity' => $request->quantity,
                    'purchase_limit' => $request->purchase_limit,
                    'sold_quantity' => $data['sold_quantity'],
                    'purchase_limit' => $request->purchase_limit,
                    'sale_start' => $request->sale_start,
                    'sale_end' => $request->sale_end
                ]);
            } else {

                $ticket = $this->ticketRepository->create($data);

                $zone = $ticket->zone()->create([
                    'event_id' => $request->event_id,
                    'name' => $request->name
                ]);

                $data = $ticket->price()->create([
                    'event_id' => $request->event_id,
                    'ticket_id' => $ticket->id,
                    'seat_zone_id' => $zone->id,
                    'price' => $request->price,
                    'quantity' => $request->quantity,
                    'purchase_limit' => $request->purchase_limit,
                    'sold_quantity' => $data['sold_quantity'],
                    'purchase_limit' => $request->purchase_limit,
                    'sale_start' => $request->sale_start,
                    'sale_end' => $request->sale_end
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Vé đã được tạo thành công, vui lòng kiểm tra và xác thực trước khi bán',
                'data' => $data
            ], 201);
        } catch (Exception $e) {
            DB::rollBack();

            Log::error("errors" . $e->getMessage());

            return response()->json([
                'errors' => $e->getMessage()
            ], 500);
        }
    }

    public function update($id, $seatId, UpdateTicketRequest $request)
    {
        DB::beginTransaction();

        $data = $request->validated();
        $ticket = $this->ticketRepository->findById($id);
        $data['sold_quantity'] = $data['quantity'];

        try {

            $ticketPrice = $ticket->price()->where('seat_zone_id', $seatId)->first();

            $ticketPrice->update([
                'price' => $request->price,
                'quantity' => $request->quantity,
                'sold_quantity' => $data['sold_quantity'],
                'purchase_limit' => $request->purchase_limit,
                'sale_start' => $request->sale_start,
                'sale_end' => $request->sale_end
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Cập nhật vé thành công',
                'data' => $ticket
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();

            Log::error("errors" . $e->getMessage());

            return response()->json([
                'errors' => $e->getMessage()
            ], 500);
        }
    }

    public function delete($id, $seatId)
    {
        $ticket = $this->ticketRepository->find($id);
        try {

            $ticketPrice = $ticket->price->where('id', $seatId)->first();

            $ticketPrice->delete();

            $ticketPrice->zone->delete();
            return response()->json([
                'message' => 'Vé đã được khóa'
            ], 201);
        } catch (Exception $e) {
            Log::error("errors" . $e->getMessage());

            return response()->json([
                'errors' => $e->getMessage()
            ], 500);
        }
    }

    public function restoreTicket($id)
    {
        $ticket = $this->ticketRepository->restore($id);

        return response()->json([
            'message' => 'Khôi phục vé thành công',
            'data' => $ticket
        ], 200);
    }

    public function show($id)
    {
        $ticketData = $this->ticketRepository->find($id);

        if ($ticketData) {
            return response()->json([
                'data' => $ticketData
            ]);
        }

        return response()->json(['message' => 'Ticket not found'], 404);
    }

    // public function generatePdf($ticket_code)
    // {
    //         // Tạo URL cho hình ảnh QR
    // $qrImageUrl = 'https://api.qrserver.com/v1/create-qr-code/?data=' . urlencode($ticket_code) . '&size=200x200';

    // // Tải ảnh và chuyển nó thành Base64
    // $imageContent = Http::get($qrImageUrl)->body();
    // $base64Image = base64_encode($imageContent);
    //     // Lấy thông tin vé dựa trên mã vé
    //     $ticket = EventUser::where('ticket_code', $ticket_code)->firstOrFail();
    //     Log::info($ticket);

    //     // Tạo dữ liệu cần thiết cho PDF
    //     $data = [
    //         'ticket' => $ticket,
    //         'user' => $ticket->user,  // Lấy thông tin người dùng liên quan (nếu cần)
    //         'event' => $ticket->event,  // Thông tin sự kiện (nếu cần)
    //     ];

    //     // Tạo PDF từ Blade view
    //     // $pdf = Pdf::loadView('emails.qr_pdf', $data);
    //     $pdf = PDF::loadHTML(view('emails.qr_pdf', compact('ticket', 'base64Image')));

    //     // Trả về file PDF cho người dùng tải về
    //     // return $pdf->download('qrcode_' . $ticket->ticket_code . '.pdf');
    //     return $pdf->stream('qrcode_' . $ticket->ticket_code . '.pdf');
    // }

    public function generatePdf($ticketCode)
    {    
        // Lấy thông tin vé từ database
        $ticket = EventUser::where('ticket_code', $ticketCode)->first();
    
        // Tạo PDF
        $pdf = App::make('dompdf.wrapper');
        $pdf->loadHTML(view('emails.qr_pdf', [
            'ticket' => $ticket,
        ])->render());
    
        return $pdf->stream();
    }
    
}
