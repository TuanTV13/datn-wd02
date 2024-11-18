<?php

namespace App\Repositories;

use App\Models\Ticket;

class TicketRepository
{
    protected $ticket;

    public function __construct(Ticket $ticket)
    {
        $this->ticket = $ticket;
    }

    public function getAll()
    {
        return $this->ticket->with('event')->get();
    }

    public function find($id)
    {
        return $this->ticket->with('event')->find($id);
    }

    public function findByEvent($eventId)
    {
        return $this->ticket->where('event_id', $eventId)->get();
    }

    public function findTrashed()
    {
        return $this->ticket->onlyTrashed()->get();
    }

    public function findByEventAndType($eventId, $ticketTypeId)
    {
        return $this->ticket->where('event_id', $eventId)
            ->where('ticket_type', $ticketTypeId)
            ->first();
    }


    public function create(array $data)
    {
        return $this->ticket->create($data);
    }

    public function update($id, array $data)
    {
        $ticket = $this->find($id);
        $ticket->update($data);
        return $ticket;
    }

    public function delete($id)
    {
        $ticket = $this->find($id);
        return $ticket->delete();
    }

}
