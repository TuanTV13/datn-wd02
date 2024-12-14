<?php

namespace App\Repositories;

use App\Models\Ticket;
use App\Models\TicketPrice;

class TicketRepository
{
    protected $ticket;

    public function __construct(Ticket $ticket)
    {
        $this->ticket = $ticket;
    }

    public function getAll()
    {
        return $this->ticket->with(['price'])->get();
    }

    public function find($id)
    {
        return $this->ticket->with(['price', 'users' => function ($query) {
            $query->distinct();
        }])
            ->withCount(['users as users_count'])
            ->find($id);
    }

    public function findById($id)
    {
        return $this->ticket->with(['price'])->find($id);
    }

    public function findByType($ticketType, $eventId)
    {
        return $this->ticket->where('ticket_type', $ticketType)->where('event_id', $eventId)->first();
    }

    public function findByEvent($eventId)
    {
        return $this->ticket->where('event_id', $eventId)->get();
    }

    public function findTrashed($id)
    {
        return $this->ticket->onlyTrashed()->find($id);
    }

    public function trashed()
    {
        return $this->ticket->onlyTrashed()->with(["price", "price.event"])->get();
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

    public function findByTicketTypeAndZoneName($ticketType, $zoneName, $eventId)
    {
        return $this->ticket
            ->where('ticket_type', $ticketType)
            ->where('event_id', $eventId)
            ->whereHas('price', function ($query) use ($zoneName) {
                $query->whereHas('zone', function ($query) use ($zoneName) {
                    $query->where('name', $zoneName);
                });
            })
            ->first();
    }
}
