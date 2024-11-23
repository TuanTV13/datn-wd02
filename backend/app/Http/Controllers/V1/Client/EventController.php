<?php

namespace App\Http\Controllers\V1\Client;

use App\Http\Controllers\Controller;
use App\Models\EventUser;
use App\Repositories\EventRepository;
use App\Repositories\TicketRepository;
use App\Repositories\TransactionRepository;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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
        $allowedIpRanges = $this->eventRepository->getIp($eventId);
        // dd($allowedIpRanges);
        $clientIp = $request->ip();

        $isAllowed = false;
        if ($allowedIpRanges && count($allowedIpRanges) > 0) {
            $isAllowed = false;
            foreach ($allowedIpRanges as $range) {
                // Kiểm tra IP của người dùng có nằm trong dải IP được phép không
                if (str_starts_with($clientIp, $range)) {
                    $isAllowed = true;
                    break;
                }
            }

            // Nếu IP không nằm trong dải IP cho phép, từ chối check-in
            if (!$isAllowed) {
                return response()->json([
                    'error' => 'Yêu cầu chỉ được thực hiện từ mạng nội bộ.'
                ], 403);
            }
        }

        $request->validate([
            'ticket_code' => 'required|string|max:100',
        ]);

        $ticketCode = strtoupper($request->input('ticket_code'));

        $transaction = $this->transactionRepository->findByTicketCode($ticketCode, $eventId);
        $userId = $transaction->user_id;
        $ticketId = $transaction->ticket_id;

        if (!$transaction) {
            return response()->json([
                'error' => 'Vé không hợp lệ vui lòng kiểm tra lại'
            ], 404);
        }

        $user = EventUser::where('ticket_code', $ticketCode)
            ->first();

        if (!$user) {
            return response()->json([
                'message' => 'Vé của bạn không hợp lệ cho sự kiện này'
            ]);
        }
        if ($user->checked_in == 1) {
            return response()->json([
                'message' => 'Bạn đã check in trước đó rồi!'
            ], 403);
        }

        $statusEvent = $transaction->event->status;
        if ($statusEvent === 'checkin') {
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

        if (!$event) {
            return response()->json([
                'error' => 'Không tìm thấy sự kiện'
            ], 404);
        }
        $event->speakers = $event->speakers ? json_decode($event->speakers, true) : null;

        return response()->json([
            'data' => $event
        ], 200);
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
            'data' => $events
        ]);
    }

    public function getEventsByCategory($categoryId)
    {
        $events = $this->eventRepository->findByCategory($categoryId);

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
            'data' => $events
        ]);
    }

    public function filter(Request $request)
    {

        $query = $this->eventRepository->query();

        if ($request->has('name')) {
            $query->where('name', 'like', '%' . $request->input('name') . '%');
        }

        if ($request->has('category_id')) {
            $query->where('category_id', $request->input('category_id'));
        }

        if ($request->has('location')) {
            $query->where('location', 'like', '%' . $request->input('location') . '%');
        }

        $startTime = Carbon::parse($request->input('start_time'))->startOfDay();
        $endTime = Carbon::parse($request->input('end_time'))->endOfDay();

        if ($request->has('start_time') && $request->has('end_time')) {
            $startTime = Carbon::parse($request->input('start_time'))->startOfDay();
            $endTime = Carbon::parse($request->input('end_time'))->endOfDay();

            $query->where(function ($q) use ($startTime, $endTime) {
                $q->where('start_time', '>=', $startTime)
                    ->where('end_time', '<=', $endTime);
            });
        }

        $perPage = $request->input('per_page', 10);

        $events = $query->paginate($perPage);

        if ($events->isEmpty()) {
            return response()->json([
                'message' => 'Không tìm thấy sự kiện nào'
            ], 404);
        }

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
        // Log::info('data' . $request->all());

        return response()->json([
            'data' => $events,
            'pagination' => [
                'total' => $events->total(),
                'current_page' => $events->currentPage(),
                'per_page' => $events->perPage(),
                'last_page' => $events->lastPage(),
                'from' => $events->firstItem(),
                'to' => $events->lastItem(),
            ]
        ], 200);
    }

    public function search(Request $request)
    {
        $query = $this->eventRepository->query();

        if ($request->has('name') && $request->input('name') !== '') {
            $query->where('name', 'like', '%' . $request->input('name') . '%');
        }

        $perPage = $request->input('per_page', 10);
        $events = $query->paginate($perPage);

        if ($events->isEmpty()) {
            return response()->json([
                'message' => 'Không tìm thấy sự kiện nào'
            ], 404);
        }

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
            'data' => $events,
            'pagination' => [
                'total' => $events->total(),
                'current_page' => $events->currentPage(),
                'per_page' => $events->perPage(),
                'last_page' => $events->lastPage(),
                'from' => $events->firstItem(),
                'to' => $events->lastItem(),
            ]
        ], 200);
    }

    public function getByConfirmed()
    {
        $events = $this->eventRepository->getByConfirmed();
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
            'data' => $events
        ]);
    }
}
