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

        if ($data->isEmpty()) {
            return response()->json([
                'message' => 'Không có vé nào đã bị xóa'
            ], 404);
        }

        return response()->json([
            'message' => $data
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
                    'sold_quantity' => $data['sold_quantity'],
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
                    'sold_quantity' => $data['sold_quantity'],
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

        if (!$ticket) {
            return response()->json([
                'message' => 'Vé không tồn tại'
            ], 404);
        }

        // if ($ticket->status_id != 'pending') {
        //     return response()->json([
        //         'message' => 'Không thể xóa vé trong trạng thái này'
        //     ], 403);
        // }

        try {

            // $ticketPrice = $ticket->price()->where('seat_zone_id', $seatId)->first();

            // $ticketPrice->delete();
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
        $ticketData = $this->ticketRepository->find($id);

        if ($ticketData) {
            return response()->json([
                'data' => $ticketData
            ]);
        }

        return response()->json(['message' => 'Ticket not found'], 404);
    }
}
