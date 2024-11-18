<?php

namespace App\Http\Controllers\V1;

use App\Enums\EventStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTicketRequest;
use App\Http\Requests\Admin\UpdateTicketRequest;
use App\Models\Ticket;
use App\Repositories\EventRepository;
use App\Repositories\TicketRepository;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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

    public function getByBlock()
    {
        $tickets = $this->ticketRepository->findTrashed();

        return response()->json([
            'data' => $tickets
        ]);
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

    public function create(StoreTicketRequest $request)
    {
        // dd($request->all());
        DB::beginTransaction();
        $data = $request->validated();
        $data['available_quantity'] = $data['quantity'];

        $eventId = $data['event_id'];
        $ticketTypeId = $data['ticket_type'];
        $event = $this->eventRepository->find($eventId);

        if (!$event) {
            return response()->json([
                'message' => 'Sự kiện không tồn tại'
            ], 404);
        }

        if ($response = $this->checkSaleEndTime($data['sale_end'], $event->start_time)) {
            return $response;
        }

        try {
            $existingTicket = $this->ticketRepository->findByEventAndType($eventId, $ticketTypeId);

            if ($existingTicket) {

                $existingTicket->quantity += $data['quantity'];
                $existingTicket->available_quantity += $data['quantity'];
                $existingTicket->save();

                $ticket = $existingTicket;
            } else {
                $ticket = $this->ticketRepository->create($data);
            }

            DB::commit();

            return response()->json([
                'message' => 'Vé đã được tạo thành công, vui lòng kiểm tra và xác thực trước khi bán',
                'data' => $ticket
            ], 201);
        } catch (Exception $e) {
            DB::rollBack();

            // Log::error('errors'. $request->all());
            Log::error("errors" . $e->getMessage());

            return response()->json([
                'errors' => $e->getMessage()
            ], 500);
        }
    }

    public function update($id, UpdateTicketRequest $request)
    {
        DB::beginTransaction();

        $data = $request->validated();
        $ticket = $this->ticketRepository->find($id);
        // dd($ticket->status);

        // $status = EventStatus::PENDING;

        if (!$ticket) {
            return response()->json([
                'message' => 'Vé không tồn tại'
            ], 404);
        }

        // if ($ticket->status != 'pending') {
        //     return response()->json([
        //         'message' => 'Không thể cập nhật vé trong trạng thái này'
        //     ], 403);
        // }

        $event = $this->eventRepository->find($ticket->event_id);
        if (!$event) {
            return response()->json([
                'message' => 'Sự kiện không tồn tại'
            ], 404);
        }

        if ($response = $this->checkSaleEndTime($data['sale_end'], $event->start_time)) {
            return $response;
        }

        try {

            $ticket->quantity += $data['quantity'];
            $ticket->available_quantity += $data['quantity'];
            $ticket->save();

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

    public function delete($id)
    {
        $ticket = $this->ticketRepository->find($id);

        if (!$ticket) {
            return response()->json([
                'message' => 'Vé không tồn tại'
            ], 404);
        }

        // if ($ticket->status != 'pending') {
        //     return response()->json([
        //         'message' => 'Vé đã được bán không thể xóa'
        //     ], 403);
        // }

        try {
            $ticket->delete();

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
        $ticket = $this->ticketRepository->findTrashed($id);

        if (!$ticket) {
            return response()->json([
                'message' => 'Không tìm thấy vé hoặc vé không bị hủy'
            ], 404);
        }

        $ticket->restore();

        return response()->json([
            'message' => 'Khôi phục vé thành công'
        ], 200);
    }

    public function show($id)
    {
        $ticket = $this->ticketRepository->find($id);

        return response()->json([
            'data' => $ticket
        ]);
    }
}
