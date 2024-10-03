<?php

namespace App\Repositories\Auth;

use App\Models\User;

class RegisterRepository
{
    protected $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function create(array $data)
    {
        $this->user->create($data);
    }
}