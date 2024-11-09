<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreSpeakerRequest;
use App\Http\Requests\Admin\UpdateSpeakerRequest;
use App\Models\Event;
use App\Repositories\CategoryRepository;
use App\Repositories\EventRepository;
use App\Repositories\SpeakerRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Speaker;

class SpeakerController extends Controller
{
    protected $eventRepository, $speakerRepository;

    public function __construct(EventRepository $eventRepository, SpeakerRepository $speakerRepository)
    {
        $this->speakerRepository = $speakerRepository;
        $this->eventRepository = $eventRepository;
    }

    public function index()
    {
        $speaker = $this->speakerRepository->getAll();

        return response()->json([
            'message' => 'Danh sách diễn giả',
            'data' => $speaker
        ]);
    }

    public function create(StoreSpeakerRequest $request)
    {
        $data = $request->validated();

        try {
            // Kiểm tra xung đột thời gian nếu đã có event_id
            if (isset($data['event_id'])) {
                $event = $this->eventRepository->find($data['event_id']);
                Log::info($event);
                $speaker = new Speaker();
                if ($event && $speaker->hasConflict($event->start_time, $event->end_time)) {
                    return response()->json([
                        'message' => 'Diễn giả đã tham gia một sự kiện trong khoảng thời gian này.',
                    ], 409); // HTTP 409 Conflict
                }
            }
            // Nếu không có xung đột, tạo diễn giả mới
            $speaker = $this->speakerRepository->create($data);

            // Gán diễn giả vào sự kiện (nếu có)
            if (isset($data['event_id'])) {
                $speaker->events()->attach($data['event_id']);
            }

            return response()->json([
                'message' => 'Thêm mới diễn giả thành công',
                'data' => $speaker,
            ], 201);
        } catch (\Exception $e) {
            Log::error("Lỗi khi thêm mới diễn giả: " . $e->getMessage());

            // return response()->json([
            //     'message' => 'Lỗi hệ thống khi thêm mới diễn giả',
            // ], 500);
            return response()->json([
                'errors' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $speaker = $this->speakerRepository->findById($id);

            if (!$speaker) {
                return response()->json([
                    'message' => 'Diễn giả không tồn tại',
                ], 404);
            }

            return response()->json([
                'message' => 'Thông tin diễn giả',
                'data' => $speaker,
            ]);
        } catch (\Exception $e) {
            Log::error("Lỗi khi lấy thông tin diễ giả:" . $e->getMessage());

            return response()->json([
                'message' => 'Lỗi hệ thống khi lấy thông tin diễn giả'
            ], 500);
        }
    }

    public function update($id, UpdateSpeakerRequest $request)
    {
        $data = $request->validated();

        try {
            $speaker = $this->speakerRepository->findById($id);

            if (!$speaker) {
                return response()->json([
                    'message' => 'Diễn giả không tồn tại',
                ], 404);
            }

            $speaker = $this->speakerRepository->update($id, $data);

            if (isset($data['event_id'])) {
                $speaker->events()->sync([$data['event_id']]);
            }

            return response()->json([
                'message' => 'Cập nhật diễn giả thành công',
                'data' => $speaker,
            ]);
        } catch (\Exception $e) {
            Log::error("Lỗi khi cập nhật diễn giả:" . $e->getMessage());

            return response()->json([
                'message' => 'Lỗi hệ thống khi cập nhật diễn giả',
            ], 500);
        }
    }

    public function delete($id)
    {

        $speaker = $this->speakerRepository->findById($id);

        if (!$speaker) {
            return response()->json([
                'message' => 'Không tìm thấy diễn giả',
            ], 404);
        }

        try {
            $speaker->delete();

            return response()->json([
                'message' => 'Xóa diễn gải thành công',
            ], 200);
        } catch (\Exception $e) {
            Log::error("Lỗi khi xóa diễn giả: " . $e->getMessage());

            return response()->json([
                'message' => 'Lỗi hệ thống khi xóa diễn giả',
            ], 500);
        }
    }
}
