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

    public function create(array $data)
    {
        return $this->ticket->create($data);
    }

    public function find($id)
    {
        return $this->ticket->find($id);
    }

    public function update($id, array $data)
    {
        $ticket = $this->ticket->find($id);
        $ticket->update($data);

        return $ticket;
    }

    public function delete($id)
    {
        $ticket = $this->find($id);

        return $ticket->delete();
    }
}
