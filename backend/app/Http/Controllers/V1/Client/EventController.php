<?php

namespace App\Http\Controllers\V1\Client;

use App\Http\Controllers\Controller;
use App\Repositories\EventRepository;
use App\Repositories\TicketRepository;
use Illuminate\Http\Request;

class EventController extends Controller
{
    protected $eventRepository, $ticketRepository;

    public function __construct(EventRepository $eventRepository, TicketRepository $ticketRepository)
    {
        $this->eventRepository = $eventRepository;
        $this->ticketRepository = $ticketRepository;
    }

    public function index()
    {
        $events = $this->eventRepository->getAll();

        if (!$events) {
            return response()->json([
                'message' => 'Không có sự kiện nào'
            ]);
        }

        return response()->json([
            'data' => $events
        ]);
    }

    public function show($id)
    {
        $event = $this->eventRepository->find($id);
        $tickets = $this->ticketRepository->findByEvent($id);

        if (!$event) {
            return response()->json([
                'message' => 'Không tồn tại sự kiện'
            ]);
        }

        return response()->json([
            'data' => $event,
            'tickets' => $tickets
        ]);
    }

    public function filter(Request $request, $categoryId)
    {
        $category = $request->input('category');
        $event = $this->eventRepository->findByCategory($categoryId);

        if (!$event) {
            return response()->json([
                'message' => 'Không tồn tại sự kiện'
            ]);
        }

        return response()->json([
            'data' => $event
        ]);
    }
}
