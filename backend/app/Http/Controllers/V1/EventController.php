<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreEventRequest;
use App\Http\Requests\Admin\UpdateEventRequest;
use App\Repositories\EventRepository;
use App\Repositories\SpeakerRepository;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EventController extends Controller
{
    protected $eventRepository, $speakerRepository;

    public function __construct(EventRepository $eventRepository, SpeakerRepository $speakerRepository)
    {
        $this->eventRepository = $eventRepository;
        $this->speakerRepository = $speakerRepository;
    }

    public function index()
    {
        $events = $this->eventRepository->getAll();

        return response()->json([
            'message' => 'Danh sách sự kiện',
            'data' => $events
        ]);
    }

    public function show($event)
    {
        $event = $this->eventRepository->find($event);

        if (!$event) {
            return response()->json([
                'message' => 'Không tìm thấy sự kiện'
            ], 404);
        }

        return response()->json([
            'message' => 'Xem chi tiết sự kiện.',
            'data' => $event
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

    private function handleSpeakers($request, $data, $event)
    {
        $existingSpeakers = $request->input('existing_speakers', []);

        foreach ($existingSpeakers as $existingSpeakerId) {
            $existingSpeaker = $this->speakerRepository->findById($existingSpeakerId);

            if (!$existingSpeaker) {
                return response()->json([
                    'message' => 'Diễn giả không tồn tại.',
                    'speaker_id' => $existingSpeakerId,
                ], 404);
            }

            if ($existingSpeaker->hasConflict($data['start_time'], $data['end_time'])) {
                return response()->json([
                    'message' => 'Diễn giả đã tham gia sự kiện khác vào giờ này.',
                    'speaker' => $existingSpeaker->name,
                ], 400);
            }

            $event->speakers()->attach($existingSpeakerId);
        }

        if ($request->has('speakers')) {
            $speakers = $request->validated()['speakers'];
            foreach ($speakers as $speaker) {
                $this->addNewSpeaker($speaker, $data, $event);
            }
        }
    }

    private function addNewSpeaker($speakerData, $data, $event)
    {
        $existingSpeaker = $this->speakerRepository->findByEmail($speakerData['email']);

        if ($existingSpeaker && $existingSpeaker->hasConflict($data['start_time'], $data['end_time'])) {
            return response()->json([
                'message' => 'Diễn giả đã tham gia sự kiện khác vào giờ này.',
                'speaker' => $existingSpeaker->name,
            ], 400);
        }

        if (!$existingSpeaker) {
            $newSpeaker = $this->speakerRepository->create($speakerData);
            $event->speakers()->attach($newSpeaker->id);
        } else {
            $event->speakers()->attach($existingSpeaker->id);
        }
    }


    public function create(StoreEventRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated()['event'];

            $conflictingEvent = $this->eventRepository->checkConflict(
                $data['start_time'],
                $data['end_time'],
                $data['ward_id']
            );

            if ($conflictingEvent) {
                return response()->json([
                    'message' => 'Thời gian và địa điểm (tỉnh, huyện, xã) đã được sử dụng cho sự kiện khác.',
                ], 400);
            }

            $data['display_header'] ??= 0;
            if ($validateEventHeader = $this->validateEventDisplayHeader($data['display_header'])) {
                return $validateEventHeader;
            }

            $event = $this->eventRepository->create($data);

            $this->handleSpeakers($request, $data, $event);
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

    private function validateEventTiming($event, array $data)
    {
        $eventStartTime = \Carbon\Carbon::parse($event->start_time);
        $newStartTime = \Carbon\Carbon::parse($data['start_time']);
        $newEndTime = \Carbon\Carbon::parse($data['end_time']);

        if (now()->diffInDays($eventStartTime) < 10) {
            return [
                'status' => false,
                'message' => 'Không thể cập nhật thời gian sự kiện vì sự kiện còn dưới 10 ngày.'
            ];
        }

        if ($newStartTime->lt(now()->addDays(10))) {
            return [
                'status' => false,
                'message' => 'Thời gian bắt đầu mới phải sau ít nhất 10 ngày so với hiện tại.'
            ];
        }

        if ($newEndTime->lt($newStartTime->addHours(2))) {
            return [
                'status' => false,
                'message' => 'Thời gian kết thúc phải sau thời gian bắt đầu ít nhất 2 giờ.'
            ];
        }

        return ['status' => true];
    }

    public function update($event, UpdateEventRequest $request)
    {
        $event = $this->eventRepository->find($event);

        if (!$event) {
            return response()->json([
                'message' => 'Không tồn tại sự kiện nào'
            ], 404);
        }

        if ($event->status != "pending") {
            return response()->json([
                'message' => 'Sự kiện đã được xác nhận không thể cập nhật'
            ], 403);
        }

        $data = $request->validated();

        $validationResult = $this->validateEventTiming($event, $data);

        if (!$validationResult['status']) {
            return response()->json([
                'message' => $validationResult['message']
            ], 400);
        }
        $conflictingEvent = $this->eventRepository->checkConflict(
            $data['start_time'],
            $data['end_time'],
            $data['ward_id'],
            $event
        );

        if ($conflictingEvent) {
            return response()->json([
                'message' => 'Thời gian và địa điểm (tỉnh, huyện, xã) đã được sử dụng cho sự kiện khác.',
                'conflicting_event' => $conflictingEvent
            ], 400);
        }

        $data['display_header'] ??= 0;
        if ($validateEventHeader = $this->validateEventDisplayHeader($data['display_header'])) {
            return $validateEventHeader;
        }

        try {
            $event->update($data);

            return response()->json([
                'message' => 'Cập nhật sự kiện thành công, vui lòng kiểm tra lại',
                'data' => $event
            ], 200);
        } catch (Exception $e) {
            Log::error("errors" . $e->getMessage());

            return response()->json([
                'errors' => $e->getMessage()
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

        if ($event->status_id != "PENDING") {
            return response()->json([
                'message' => 'Sự kiện đã được xác nhận không thể hủy'
            ], 403);
        }

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
    public function participationHistory()
    {
        // Lấy người dùng đã đăng nhập
        $user = Auth::user();
    
        // Lấy danh sách các sự kiện mà người dùng đã tham gia
        $events = $user->events()->get();
    
        // Kiểm tra nếu người dùng chưa tham gia sự kiện nào
        if ($events->isEmpty()) {
            return response()->json([
                'message' => 'Người dùng chưa tham gia sự kiện nào.',
                'data' => []
            ], 200);
        }
    
        // Chuẩn bị dữ liệu lịch sử tham gia
        $data = [];
        foreach ($events as $index => $event) {
            $data[] = [
                'stt' => $index + 1,
                'event_name' => $event->name,
                'start_time' => $event->start_time,
                'end_time' => $event->end_time,
                'location' => $event->location,
                'thumbnail' => $event->thumbnail, // Đường dẫn hình ảnh
                'status' => $event->pivot->status, // Trạng thái tham gia từ bảng pivot
            ];
        }
    
        // Trả về dữ liệu dưới dạng JSON
        return response()->json([
            'message' => 'Lịch sử tham gia sự kiện của người dùng',
            'data' => $data
        ], 200);
    }
    
    
}

