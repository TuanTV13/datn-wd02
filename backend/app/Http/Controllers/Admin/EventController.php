<?php

namespace App\Http\Controllers\Admin;

use App\Events\EventUpdate;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreEventRequest;
use App\Http\Requests\Admin\UpdateEventRequest;
use App\Models\Event;
use App\Services\Admin\EventService;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EventController extends Controller
{
    protected $eventService;

    public function __construct(EventService $eventService) 
    {
        $this->eventService = $eventService;
    }

    public function index ()
    {
        $events = $this->eventService->getAll();
        
        if ($events->isEmpty()) {
            return response()->json([
                'message' => 'Chưa có sự kiện nào được tạo'
            ], 404);
        }

        return response()->json([
            'message' => 'Lấy danh sách sự kiện thành công',
            'events' => $events,
        ], 200);
    }

    public function create()
    {
        try {
            $provinces = $this->eventService->getAllProvinces();
            $districts = $this->eventService->getAllDistricts();
            $wards = $this->eventService->getAllWards();
            $categories = $this->eventService->getAllCategories();
            $statuses = $this->eventService->getAllStatus();
            $ticket_types = $this->eventService->getAllTicketTypes();
    
            return response()->json([
                'success' => true,
                'data' => [
                    'provinces' => $provinces,
                    'districts' => $districts,
                    'wards' => $wards,
                    'categories' => $categories,
                    'statuses' => $statuses,
                    'ticket_types' => $ticket_types,
                ]
            ], 200); 
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể truy xuất dữ liệu.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    

    public function getDistricts($province_id)
    {
        $districts = $this->eventService->getDistrictByProvince($province_id);

        return response()->json($districts->pluck('name', 'id'));
    }

    public function getWards($district_id)
    {
        $wards = $this->eventService->getWardByDistrict($district_id);
        return response()->json($wards->pluck('name', 'id'));
    }

    public function store(StoreEventRequest $request) 
    {
        $this->eventService->create($request->event, $request->speakers, $request->tickets, $request->event_images);

        return response()->json([
            'message' => 'Tạo sự kiện mới thành công!'
        ], 201);
    }

    // Chi tiết
    public function show($id)
    {
        $event = Event::with([
            'category',
            'status',
            'province',
            'district',
            'ward',
            'eventImages',
            'tickets.seatLocations',
            'speakers'
        ])->find($id);

        if (!$event) {
            return response()->json([
                'message' => 'Không tìm thấy sự kiện nào có id = ' . $id
            ]);
        }

        return response()->json($event);
    }

    // Cập nhật
    public function update(UpdateEventRequest $updateEventRequest, $id)
    {
        try {
            $event = Event::find($id);

            if (!$event) {
                return response()->json([
                    'message' => 'Không tồn tại sự kiện nào có id = ' . $id
                ], 404);
            }

            // Điều kiện của sự kiện để có quyền cập nhật 
            if ($event->status_id != 1) {
                return response()->json([
                    'message' => 'Không thể cập nhật sự kiện đã qua trạng thái duyệt'
                ]);
            }

            $start_time = Carbon::parse($updateEventRequest->input('start_time'));
            $end_time = Carbon::parse($updateEventRequest->input('end_time'));

            if ($end_time->diffInRealMinutes($start_time) < 60) {
                Log::info("Thời gian kết thúc không cách thời gian bắt đầu ít nhất 1 tiếng.");
                return response()->json([
                    'message' => 'Thời gian kết thúc phải cách thời gian bắt đầu ít nhất 1 tiếng.'
                ], 422);
            }

            DB::transaction(function () use ($updateEventRequest, $event) {
                $dataEvent = $updateEventRequest->validated();
                $event->update($dataEvent);

                EventUpdate::dispatch($event);
            }, 3);

            return response()->json($event);
        } catch (\Throwable $th) {
            Log::error("Error updating event: " . $th->getMessage(), [
                'trace' => $th->getTraceAsString(),
                'event_id' => $id,
            ]);

            return response()->json([
                'message' => 'Cập nhật thất bại'
            ], 500);
        }
    }

    // Xóa
    public function destroy($id) {}

    // Xóa vé theo sự kiện
    protected function cancelTickets($event) {}
}
