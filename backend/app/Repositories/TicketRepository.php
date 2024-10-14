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
        return $this->ticket->all();
    }

    public function find($id)
    {
        return $this->ticket->find($id);
    }

    public function findTrashed($id)
    {
        return $this->ticket->onlyTrashed()->find($id);
    }

    public function findByEventAndType($eventId, $ticketTypeId)
    {
        return $this->ticket->where('event_id', $eventId)
            ->where('ticket_type_id', $ticketTypeId)
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
