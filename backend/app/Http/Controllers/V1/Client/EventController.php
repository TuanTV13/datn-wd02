<?php

namespace App\Http\Controllers\V1\Client;

use App\Http\Controllers\Controller;
use App\Models\EventUser;
use App\Repositories\EventRepository;
use App\Repositories\TicketRepository;
use App\Repositories\TransactionRepository;
use Illuminate\Http\Request;

class EventController extends Controller
{
    protected $eventRepository, $ticketRepository, $transactionRepository;

    public function __construct(EventRepository $eventRepository, TicketRepository $ticketRepository, TransactionRepository $transactionRepository)
    {
        $this->eventRepository = $eventRepository;
        $this->ticketRepository = $ticketRepository;
        $this->transactionRepository = $transactionRepository;
    }
    
    public function checkIn(Request $request, $eventId)
    {
        $request->validate([
            'ticket_code' => 'required|string|max:100',
        ]);

        $ticketCode = strtoupper($request->input('ticket_code'));

        $transaction = $this->transactionRepository->findByTicketCode($ticketCode, $eventId);
        $userId = $transaction->user_id;
        $ticketId = $transaction->ticket_id;

        if(!$transaction){
            return response()->json([
                'error' => 'Vé không hợp lệ vui lòng kiểm tra lại'
            ], 404);
        }

        $user = EventUser::where('ticket_code', $ticketCode)
            ->first();

        if(!$user){
            return response()->json([
                'message' => 'Vé của bạn không hợp lệ cho sự kiện này'
            ]);
        }
        if($user->checked_in == 1){
            return response()->json([
                'message' => 'Bạn đã check in trước đó rồi!'
            ], 403);
        }

        $statusEvent = $transaction->event->status;
        if($statusEvent === 'checkin'){
            $user->checked_in = 1;
            $user->save();

            return response()->json([
                'message' => 'Check-in sự kiện thành công'
            ], 201);
        }

        return response()->json([
            'message' => 'Chưa đến thời gian check-in sự kiện'
        ]);
    }

    public function show($eventId)
    {
        $event = $this->eventRepository->find($eventId);

        if(!$event){
            return response()->json([
                'error' => 'Không tìm thấy sự kiện'
            ], 404);
        }

        return response()->json([
            'data' => $event
        ], 200);
    }

    public function index()
    {
        $events = $this->eventRepository->getAll();

        return response()->json([
            'data' => $events
        ]);
    }
}
