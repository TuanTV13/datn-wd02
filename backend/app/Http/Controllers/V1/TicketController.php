<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTicketRequest;
use App\Http\Requests\Admin\UpdateTicketRequest;
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

    public function index()
    {
        return $this->ticketRepository->getAll();
    }

    public function verifiedTicket($id)
    {
        $ticket = $this->ticketRepository->find($id);

        if (!$ticket) {
            return response()->json([
                'message' => 'Vé không tồn tại.'
            ], 404);
        }

        if ($ticket->status_id == 10) {
            $ticket->status_id = 8;
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
        $data['available_quantity'] = $data['quantity'];

        $eventId = $data['event_id'];
        $ticketTypeId = $data['ticket_type_id'];
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

        if (!$ticket) {
            return response()->json([
                'message' => 'Vé không tồn tại'
            ], 404);
        }

        if ($ticket->status_id != 10) {
            return response()->json([
                'message' => 'Không thể cập nhật vé trong trạng thái này'
            ], 403);
        }

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

            $ticket = $this->ticketRepository->update($id, $data);

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

        if ($ticket->status_id != 10) {
            return response()->json([
                'message' => 'Không thể xóa vé trong trạng thái này'
            ], 403);
        }

        try {
            $ticket->delete();

            return response()->json([
                'message' => 'Vé đã được xóa'
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
}
