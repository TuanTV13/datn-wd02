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
        return Speaker::where('email', $email)->first();
    }


    public function create(array $data)
    {
        return $this->speaker->create($data);
    }
}