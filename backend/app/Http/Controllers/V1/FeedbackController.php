<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use App\Mail\FeedbackConfirmationMail;
use App\Repositories\EventRepository;
use App\Repositories\UserRepository;
use App\Repositories\FeedbackRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

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

    public function getFeedbackFormData($eventId, $userId)
    {
        $event = $this->eventRepository->find($eventId);
        $user = $this->userRepository->find($userId);

        if (!$event || !$user) {
            return response()->json([
                'message' => 'Không tìm thấy sự kiện hoặc người dùng'
            ], 404);
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
            ]);
    
            $event = $this->eventRepository->find($data['event_id']);
            $user = $this->userRepository->find($data['user_id']);
         
            if (!$event || !$user) {
                return response()->json([
                    'message' => 'Sự kiện hoặc người dùng không tồn tại.'
                ], 404);
            }
            if (!$event->users()->where('user_id', $user->id)->wherePivot('status', 'attended')->exists()) {
                return response()->json([
                    'message' => 'Người dùng chưa tham gia sự kiện này.',
                ], 403);
            }
            if ($event->feedbacks()->where('user_id', $user->id)->count() > 2) {
                return response()->json([
                    'message' => 'Người dùng đã đạt tối đa số lần gửi phản hồi cho sự kiện này.',
                ], 422);
            }
            
            $this->feedbackRepository->create($data);
    
            // return response()->json([
            //     'message' => 'Đánh giá đã được gửi thành công.'
            // ], 201);
            DB::commit();
    
            return redirect('/your-react-url?message=success'); // Chuyển hướng đến trang thông báo đánh giá thành công
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error($e->getMessage());

            return response()->json([
                'message' => 'Đã có lỗi xảy ra khi gửi đánh giá.'
            ], 500);
        }
    }

    public function destroy($feedback)
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
