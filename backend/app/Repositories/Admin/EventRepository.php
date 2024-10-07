<?php

namespace App\Repositories\Admin;

use App\Models\Event;

class EventRepository
{
    protected $event;

    public function __construct(Event $event)
    {
        $this->event = $event;
    }

    public function getAll()
    {
        return $this->event->getAll();
    }

    public function find($id)
    {
        return $this->event->find($id);
    }

    public function create(array $data)
    {
        return $this->event->create($data);
    }

    public function update(array $data, $id)
    {
        $user = $this->find($id);
        $user->update($data);
        return $user;
    }

    public function delete($id)
    {
        $user = $this->find($id);
        return $user->delete();
    }
}