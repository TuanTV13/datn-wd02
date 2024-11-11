<?php

namespace App\Repositories;

use App\Models\Speaker;

class SpeakerRepository
{
    protected $speaker;

    public function __construct(Speaker $speaker)
    {
        $this->speaker = $speaker;
    }

    public function getAll()
    {
        return $this->speaker->all();
    }

    public function findById($id)
    {
        return $this->speaker->find($id);
    }

    public function findByEmail($email)
    {
        return $this->speaker->where('email', $email)->first();
    }


    public function create(array $data)
    {
        return $this->speaker->create($data);
    }

    public function update($id, array $data)
    {
        $speaker = $this->speaker->find($id);
        $speaker->update($data);

        return $speaker;
    }

    public function delete($id)
    {
        $speaker = $this->speaker->find($id);

        return $speaker->delete();
    }
}
