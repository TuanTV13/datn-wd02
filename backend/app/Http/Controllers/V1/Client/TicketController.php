<?php

namespace App\Http\Controllers\V1\Client;

use App\Http\Controllers\Controller;
use App\Repositories\EventRepository;
use App\Repositories\TicketRepository;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    protected $ticketRepository, $eventRepository;

    public function __construct(TicketRepository $ticketRepository, EventRepository $eventRepository)
    {
        $this->ticketRepository = $ticketRepository;
        $this->eventRepository = $eventRepository;
    }

    public function buyTicket()
    {
        
    }
}
