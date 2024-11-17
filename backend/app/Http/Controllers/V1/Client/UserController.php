<?php

namespace App\Http\Controllers\V1\Client;

use App\Http\Controllers\Controller;
use App\Repositories\TransactionRepository;
use App\Repositories\UserRepository;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public $userRepository;
    public $transactionRepository;

    public function __construct(UserRepository $userRepository, TransactionRepository $transactionRepository)
    {
        $this->userRepository = $userRepository;
        $this->transactionRepository = $transactionRepository;
    }

    public function getEventParticipationHistory($userID)
    {
        $user = $this->userRepository->find($userID);
    
        if (!$user) {
            return response()->json([
                'error' => 'Người dùng không tồn tại'
            ], 404);
        }
    
        $participationHistory = $user->events()
            ->where('checked_in', true)  
            ->select('events.id', 'events.name', 'events.start_time', 'events.location', 'events.thumbnail', 'events.status') 
            ->distinct()
            ->get()
            ->map(function ($event) {
                return [
                    'event_name' => $event->name,
                    'event_date' => $event->start_time, 
                    'location' => $event->location,
                    'thumbanail' => $event->thumbnail, 
                    'status' => $event->status,
                ];
            });
    
        if ($participationHistory->isEmpty()) {
            return response()->json([
                'message' => 'Người dùng chưa tham gia sự kiện nào'
            ]);
        }
    
        return response()->json([
            'message' => 'Lịch sử tham gia sự kiện',
            'data' => $participationHistory
        ]);
    }
    
    public function showParticipationHistory($userID, $eventID)
    {
        $user = $this->userRepository->find($userID);
    
        if (!$user) {
            return response()->json([
                'error' => 'Người dùng không tồn tại'
            ], 404);
        }
    
        $event = $user->events()->where('events.id', $eventID)->first();
    
        if (!$event) {
            return response()->json([
                'message' => 'Không tìm thấy thông tin sự kiện đã tham gia.'
            ]);
        }
    
        return response()->json([
            'message' => 'Chi tiết sự kiện đã tham gia.',
            'data' => $event
        ]);
    }
    
    public function getTransactionHistory($id)
    {
        $user = $this->userRepository->find($id);

        if (!$user) {
            return response()->json([
                'error' => 'Người dùng không tồn tại'
            ], 404);
        }

        $transactions = $user->transactions()
            ->with('event')  
            ->select('id', 'event_id', 'total_amount', 'payment_method', 'status', 'created_at')  
            ->get()
            ->map(function($transaction) {
                return [
                    'id' => $transaction->id,
                    'event_name' => $transaction->event ? $transaction->event->name : null, 
                    'total_amount' => $transaction->total_amount,
                    'payment_method' => $transaction->payment_method,
                    'status' => $transaction->status,
                    'created_at' => $transaction->created_at ? date('d-m-Y',strtotime($transaction->created_at)) : null,
                ];
            });

        if ($transactions->isEmpty()) {
            return response()->json([
                'message' => 'Bạn hiện tại chưa có giao dịch nào.'
            ]);
        }

        return response()->json([
            'message' => 'Lịch sử giao dịch',
            'data' => $transactions
        ]);
    }

}
