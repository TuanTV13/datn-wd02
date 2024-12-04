<?php

namespace App\Http\Controllers\V1\Client;

use App\Http\Controllers\Controller;
use App\Repositories\TransactionRepository;
use App\Repositories\UserRepository;
use Illuminate\Http\Request;

class HistoryController extends Controller
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
        // Tìm người dùng theo ID thông qua repository
        $user = $this->userRepository->find($userID);

        // Nếu người dùng không tồn tại, trả về thông báo lỗi kèm mã HTTP 404
        if (!$user) {
            return response()->json([
                'error' => 'Người dùng không tồn tại'
            ], 404);
        }

        // Lấy lịch sử tham gia sự kiện của người dùng
        $participationHistory = $user->events()
            ->wherePivot('checked_in', true) // Chỉ lấy các sự kiện mà người dùng đã "check-in"
            ->select('events.id', 'events.name', 'events.start_time', 'events.location', 'events.thumbnail', 'events.status') // Chỉ lấy các cột cần thiết
            ->get();

        // Nếu người dùng chưa tham gia sự kiện nào, trả về thông báo
        if ($participationHistory->isEmpty()) {
            return response()->json([
                'message' => 'Người dùng chưa tham gia sự kiện nào'
            ]);
        }

        // Trả về lịch sử tham gia sự kiện kèm mã HTTP 200
        return response()->json([
            'message' => 'Lịch sử tham gia sự kiện',
            'data' => $participationHistory
        ]);
    }


    public function showParticipationHistory($userID, $eventID)
    {
        // Tìm người dùng theo ID thông qua repository
        $user = $this->userRepository->find($userID);

        // Nếu người dùng không tồn tại, trả về thông báo lỗi kèm mã HTTP 404
        if (!$user) {
            return response()->json([
                'error' => 'Người dùng không tồn tại'
            ], 404);
        }

        // Tìm sự kiện mà người dùng đã tham gia dựa trên eventID
        $event = $user->events()->where('events.id', $eventID)->first();

        // Nếu không tìm thấy sự kiện, trả về thông báo lỗi
        if (!$event) {
            return response()->json([
                'message' => 'Không tìm thấy thông tin sự kiện đã tham gia.'
            ]);
        }

        // Trả về chi tiết sự kiện mà người dùng đã tham gia
        return response()->json([
            'message' => 'Chi tiết sự kiện đã tham gia.',
            'data' => $event
        ]);
    }


    public function getTransactionHistory($id)
    {
        // Tìm người dùng theo ID thông qua repository
        $user = $this->userRepository->find($id);

        // Nếu người dùng không tồn tại, trả về thông báo lỗi kèm mã HTTP 404
        if (!$user) {
            return response()->json([
                'error' => 'Người dùng không tồn tại'
            ], 404);
        }

        // Lấy danh sách giao dịch của người dùng và cùng thông tin sự kiện
        $transactions = $user->transactions()
            ->with('event') // Tải thông tin sự kiện liên quan
            ->select('id', 'event_id', 'total_amount', 'payment_method', 'status', 'created_at') // Chỉ lấy các cột cần thiết
            ->get()
            ->map(function ($transaction) {
                // Định dạng lại dữ liệu giao dịch
                return [
                    'id' => $transaction->id,
                    'event_name' => $transaction->event ? $transaction->event->name : null, // Lấy tên sự kiện hoặc null nếu không có
                    'total_amount' => $transaction->total_amount,
                    'payment_method' => $transaction->payment_method,
                    'status' => $transaction->status,
                    'created_at' => $transaction->created_at ? date('d-m-Y', strtotime($transaction->created_at)) : null, // Định dạng ngày tháng
                ];
            });

        // Nếu không có giao dịch, trả về thông báo
        if ($transactions->isEmpty()) {
            return response()->json([
                'message' => 'Bạn hiện tại chưa có giao dịch nào.'
            ]);
        }

        // Trả về lịch sử giao dịch kèm mã HTTP 200
        return response()->json([
            'message' => 'Lịch sử giao dịch',
            'data' => $transactions
        ]);
    }
}
