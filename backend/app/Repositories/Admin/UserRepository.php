<?php

namespace App\Repositories\Admin;

use App\Models\User;

class UserRepository
{
    protected $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function create(array $data)
    {
        return $this->user->create($data);
    }

    public function find($id)
    {
        return $this->user->find($id);
    }

    public function update($id, array $data)
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
