<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use App\Repositories\EventRepository;
use Illuminate\Http\Request;

class EventTrackingController extends Controller
{
    protected $eventRepository;

    public function __construct(EventRepository $eventRepository)
    {
        $this->eventRepository = $eventRepository;
    }

    public function getEventDetails($eventId)
    {
        $event = $this->eventRepository->find($eventId);

        $eventAttendees = $this->eventRepository->getEventAttendees($eventId);

        $totalAttendees = $eventAttendees->count();

        $getTicketsSold = $this->eventRepository->getTicketsSold($eventId);

        $totalAmount = $this->eventRepository->toltalAmount($eventId);

        return response()->json([
            'event' => $event,
            'totalUsers' => $totalAttendees,
            'users' => $eventAttendees,
            'ticketsSold' => $getTicketsSold,
            'totalAmount' => $totalAmount
        ]);
    }
}
