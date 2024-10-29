<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use App\Repositories\EventRepository;
use App\Repositories\UserRepository;
use App\Repositories\FeedbackRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class FeedbackController extends Controller
{
    public $eventRepository;
    public $userRepository;
    public $feedbackRepository;

    public function __construct(EventRepository $eventRepository, UserRepository $userRepository, FeedbackRepository $feedbackRepository)
    {
        $this->eventRepository = $eventRepository;
        $this->userRepository = $userRepository;
        $this->feedbackRepository = $feedbackRepository;
    }

    public function index()
    {
        $feedbacks = $this->feedbackRepository->getAll();
        
        return response()->json([
            'message' => 'Danh sách phản hồi',
            'data'    => $feedbacks,
        ], 200);
    }

    public function getFeedbackFormData(Request $request, $eventId, $userId)
    {
        $event = $this->eventRepository->find($eventId);
        $user = $this->userRepository->find($userId);

        if (!$request->hasValidSignature()) {
            return response()->json(['message' => 'Đường dẫn không hợp lệ hoặc đã hết hạn.'], 403);
        }

        if (!$event) {
            return response()->json(['message' => 'Sự kiện không tồn tại.'], 404);
        }
        if (!$user) {
            return response()->json(['message' => 'Người dùng không tồn tại.'], 404);
        }
        
        // return response()->json([
        //     'message' => 'Form đánh giá',
        //     'data'    => [
        //         'event' => $event->only(['id', 'name']),
        //         'user'  => $user->only(['id', 'name', 'email']),
        //     ],
        // ], 200);
        return view('emails.evaluation', compact('event', 'user'));
    }

    public function show($feedback)
    {
        $feedback = $this->feedbackRepository->find($feedback);

        if (!$feedback) {
            return response()->json([
                'message' => 'Không tìm thấy phản hồi'
            ], 404);
        }

        return response()->json([
            'message' => 'Chi tiết phản hồi',
            'data'    => $feedback,
        ], 200);
    }

    public function submit(Request $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->validate([
                'event_id' => 'required|exists:events,id',
                'user_id' => 'required|exists:users,id',
                'rating' => 'required|numeric',
                'feedback' => 'nullable|string',
                'suggestions' => 'nullable|string',
            ], 
            [
                'event_id.required' => 'Sự kiện không được để trống.',
                'event_id.exists' => 'Sự kiện không tồn tại.',
                'user_id.required' => 'Người dùng không được để trống.',
                'user_id.exists' => 'Người dùng không tồn tại.',
                'rating.required' => 'Đánh giá không được để trống.',
                'rating.numeric' => 'Đánh giá phải là số.',
                'feedback.string' => 'Phản hồi phải là chuỗi.',
                'suggestions.string' => 'Góp ý phải là chuỗi.',
            ]);
    
            $event = $this->eventRepository->find($data['event_id']);
            $user = $this->userRepository->find($data['user_id']);

            if (!$event) {
                return response()->json(['message' => 'Sự kiện không tồn tại.'], 404);
            }
            if (!$user) {
                return response()->json(['message' => 'Người dùng không tồn tại.'], 404);
            }

            if (!$event->users()->where('user_id', $user->id)->wherePivot('checked_in', 1)->exists()) {
                return response()->json(['message' => 'Người dùng chưa tham gia sự kiện này.'], 403);
            }
    
            if ($event->feedbacks()->where('user_id', $user->id)->count() >= 2) {
                return response()->json(['message' => 'Người dùng đã đạt tối đa số lần gửi phản hồi cho sự kiện này.'], 422);
            }

            $this->feedbackRepository->create($data);
    
            DB::commit();
    
            return response()->json(['message' => 'Đánh giá đã được gửi thành công.'], 201);
            
        } catch (\Exception $e) {
            DB::rollBack();
    
            Log::error('Có lỗi xảy ra khi gửi đánh giá: ' . $e->getMessage());
    
            return response()->json(['message' => 'Đã có lỗi xảy ra khi gửi đánh giá.'], 500);
        }
    }
    

    public function delete($feedback)
    {
        $feedback = $this->feedbackRepository->find($feedback);

        if (!$feedback) {
            return response()->json([
                'message' => 'Không tìm thấy phản hồi.'
            ], 404);
        }

        $this->feedbackRepository->delete($feedback);

        return response()->json([
            'message' => 'Xóa phản hồi thành công.'
        ], 200);
    }
}
