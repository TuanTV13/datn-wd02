<?php

namespace App\Http\Controllers\V1;

use App\Events\EventUpdate;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreEventRequest;
use App\Http\Requests\Admin\UpdateEventRequest;
use App\Http\Services\CheckEventIPService;
use App\Models\EventUser;
use App\Repositories\EventRepository;
use App\Repositories\SpeakerRepository;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class EventController extends Controller
{
    protected $eventRepository, $checkEventIPService;

    public function __construct(EventRepository $eventRepository, CheckEventIPService $checkEventIPService)
    {
        $this->eventRepository = $eventRepository;
        $this->checkEventIPService = $checkEventIPService;
    }

    public function index()
    {
        $events = $this->eventRepository->getAll();
        foreach ($events as $event) {
            if ($event->speakers) {
                $speakers = json_decode($event->speakers, true);
                if (json_last_error() !== JSON_ERROR_NONE) {
                    $event->speakers = null;
                } else {
                    $event->speakers = $speakers;
                }
            } else {
                $event->speakers = null;
            }
        }


        return response()->json([
            'message' => 'Danh sách sự kiện',
            'data' => $events
        ]);
    }

    public function show($eventId)
    {
        $event = $this->eventRepository->findDetail($eventId);
        $eventS = $this->eventRepository->find($eventId);
        $speakers = $eventS->speakers = $eventS->speakers ? json_decode($eventS->speakers, true) : null;
        // $eventAttendees = $this->eventRepository->getEventAttendees($eventId);

        // if (is_array($event)) {
        //     // Nếu $event là mảng
        //     $speakers = isset($event['speakers']) ? json_decode($event['speakers'], true) : null;
        // } else {
        //     // Nếu $event là đối tượng
        //     $speakers = $event->speakers ? json_decode($event->speakers, true) : null;
        // }

        $event['speakers'] = $speakers;

        if (!$event) {
            return response()->json([
                'message' => 'Không tìm thấy sự kiện'
            ], 404);
        }
        $users = $eventS->users = $eventS->users ? json_decode($eventS->users, true) : null;
        $event['users'] = $users;

        return response()->json([
            'message' => 'Xem chi tiết sự kiện.',
            'data' => $event,
            // 'users' => $eventAttendees
        ], 200);
    }

    public function verifiedEvent($id)
    {
        $event = $this->eventRepository->find($id);

        if (!$event) {
            return response()->json([
                'message' => 'Sự kiện không tồn tại.'
            ], 404);
        }

        if ($event->status == 'pending') {
            $event->status = 'confirmed';
            $event->save();

            return response()->json([
                'message' => 'Xác nhận thành công',
                'data' => $event
            ], 200);
        }

        return response()->json([
            'message' => 'Sự kiện đã được xác nhận trước đó.'
        ], 400);
    }
    public function changeStatus($id, Request $request)
    {
        // $status = $request->validate([
        //     'status' => 'required'
        // ]);

        $event = $this->eventRepository->find($id);

        if (!$event) {
            return response()->json([
                'message' => 'Sự kiện không tồn tại.'
            ], 404);
        }

        $event->update(['status' => $request->input('status')]);

        // if ($event->status == 'pending') {
        //     $event->status = 'confirmed';
        //     $event->save();

        //     return response()->json([
        //         'message' => 'Xác nhận thành công',
        //         'data' => $event
        //     ], 200);
        // }

        return response()->json([
            'message' => 'Thanh cong'
        ], 200);
    }

    public function create(StoreEventRequest $request)
    {
        // Log::info('Thông tin vé', ['data' => $request->all()]);
        DB::beginTransaction();

        try {
            $data = $request->validated();

            $validationError = $this->eventRepository->validateEventTimeAndVenue(
                $data['start_time'],
                $data['end_time'],
                $data['ward'],
                $data['location']
            );

            if ($validationError) {
                return $validationError;  // Trả về lỗi nếu có sự kiện trùng lặp
            }

            if ($request->has('speakers') && is_string($request->speakers)) {
                $data['speakers'] = json_decode($request->speakers, true);
            } elseif ($request->has('speakers') && is_array($request->speakers)) {
                $data['speakers'] = json_encode($request->speakers);
            } else {
                $data['speakers'] = null;
            }

            $data['display_header'] ??= 0;
            if ($validateEventHeader = $this->validateEventDisplayHeader($data['display_header'])) {
                return $validateEventHeader;
            }

            $event = $this->eventRepository->create($data);
        } catch (Exception $e) {
            DB::rollBack();
            Log::error("error" . $e->getMessage());

            return response()->json([
                'message' => 'Lỗi khi tạo sự kiện',
                'error' => $e->getMessage()
            ]);
        }

        DB::commit();

        return response()->json([
            'message' => 'Tạo sự kiện thành công, vui lòng kiểm tra',
            'data' => $event
        ]);
    }

    private function validateEventDisplayHeader($data)
    {
        $headerEventCount = $this->eventRepository->countHeaderEvents();
        if ($headerEventCount >= 4 && $data == 1) {
            return response()->json([
                'message' => 'Chỉ có thể hiển thị tối đa 4 sự kiện ở phần đầu trang.',
            ], 400);
        }
    }

    // private function validateEventTiming($event, array $data)
    // {
    //     $eventStartTime = \Carbon\Carbon::parse($event->start_time);
    //     $newStartTime = \Carbon\Carbon::parse($data['start_time']);
    //     $newEndTime = \Carbon\Carbon::parse($data['end_time']);

    //     if (now()->diffInDays($eventStartTime) < 10) {
    //         return [
    //             'status' => false,
    //             'message' => 'Không thể cập nhật thời gian sự kiện vì sự kiện còn dưới 10 ngày.'
    //         ];
    //     }

    //     if ($newStartTime->lt(now()->addDays(10))) {
    //         return [
    //             'status' => false,
    //             'message' => 'Thời gian bắt đầu mới phải sau ít nhất 10 ngày so với hiện tại.'
    //         ];
    //     }

    //     if ($newEndTime->lt($newStartTime->addHours(2))) {
    //         return [
    //             'status' => false,
    //             'message' => 'Thời gian kết thúc phải sau thời gian bắt đầu ít nhất 2 giờ.'
    //         ];
    //     }

    //     return ['status' => true];
    // }

    public function update($eventId, UpdateEventRequest $request)
    {
        $event = $this->eventRepository->find($eventId);

        if (!$event) {
            return response()->json([
                'message' => 'Không tồn tại sự kiện nào'
            ], 404);
        }

        // if ($event->status != "pending") {
        //     return response()->json([
        //         'message' => 'Sự kiện đã được xác nhận không thể cập nhật'
        //     ], 403);
        // }

        $data = $request->validated();

        $validationError = $this->eventRepository->validateEventTimeAndVenue(
            $data['start_time'],
            $data['end_time'],
            'abc',
            $data['location']
        );

        if ($validationError) {
            return $validationError;
        }

        $data['display_header'] ??= 0;

        if ($validateEventHeader = $this->validateEventDisplayHeader($data['display_header'])) {
            return $validateEventHeader;
        }

        try {
            // Cập nhật sự kiện
            $event->update($data);
            event(new EventUpdate($event));

            return response()->json([
                'message' => 'Cập nhật sự kiện thành công, vui lòng kiểm tra lại',
                'data' => $event
            ], 200);
        } catch (Exception $e) {
            Log::error("errors: " . $e->getMessage());

            return response()->json([
                'errors' => 'Đã xảy ra lỗi khi cập nhật sự kiện'
            ], 500);
        }
    }

    public function delete($event)
    {
        $event = $this->eventRepository->find($event);

        if (!$event) {
            return response()->json([
                'message' => 'Không tồn tại sự kiện nào'
            ], 404);
        }

        // if ($event->status_id != "PENDING") {
        //     return response()->json([
        //         'message' => 'Sự kiện đã được xác nhận không thể hủy'
        //     ], 403);
        // }

        $event->delete();

        return response()->json([
            'message' => 'Hủy sự kiện thành công'
        ], 201);
    }

    public function restore($event)
    {
        $event = $this->eventRepository->findTrashed($event);

        if (!$event) {
            return response()->json([
                'message' => 'Không tìm thấy sự kiện hoặc sự kiện không bị hủy'
            ], 404);
        }

        $event->restore();

        return response()->json([
            'message' => 'Khôi phục sự kiện thành công'
        ], 200);
    }

    public function checkEventIP(): JsonResponse
    {
        $result = $this->checkEventIPService->checkEventsWithoutIP();

        Log::info('Kết quả kiểm tra sự kiện IP', $result);

        return response()->json([
            'status' => $result['status'],
            'message' => $result['message'],
            'events' => $result['events'] ?? []
        ]);
    }

    public function addIp(Request $request, $eventId)
    {
        $request->validate([
            'subnet' => 'required|string'
        ]);
        $event = $this->eventRepository->find($eventId);
        if (!$event) {
            return response()->json([
                'error' => 'Sự kiện không tồn tại.'
            ], 404);
        }
        $event->subnets()->create([
            'subnet' => $request->input('subnet')
        ]);

        return response()->json([
            'message' => 'Thêm địa chỉ IP thành công.'
        ], 201);
    }

    public function trashed()
    {
        $data = $this->eventRepository->trashed();

        return response()->json([
            'message' => 'Danh sách sự kiện đã bị hủy',
            'data' => $data
        ], 200);
    }

    public function checkIn($eventId, Request $request)
    {
        $ticketCode = $request->input('ticket_code');
        $event = $this->eventRepository->find($eventId);

        // if (!$event) {
        //     return response()->json(['message' => 'Sự kiện không tồn tại'], 404);
        // }

        $user = EventUser::where('ticket_code', $ticketCode)->first();
        $user->checked_in = 1;
        $user->save();
        return response()->json(['message' => 'Check-in thành công']);
    }

    public function cancelCheckIn($eventId, Request $request)
    {
        $ticketCode = $request->input('ticket_code');
        $event = $this->eventRepository->find($eventId);

        // if (!$event) {
        //     return response()->json(['message' => 'Sự kiện không tồn tại'], 404);
        // }

        $user = EventUser::where('ticket_code', $ticketCode)->first();
        $user->checked_in = 0;
        $user->save();
        return response()->json(['message' => 'Hủy check-in thành công']);
    }
}
