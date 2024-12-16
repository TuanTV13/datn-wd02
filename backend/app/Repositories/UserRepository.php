<?php

namespace App\Repositories;

use App\Models\User;

class UserRepository
{
    protected $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function all()
    {
        return User::whereDoesntHave('roles', function ($query) {
            $query->where('name', 'admin');
        })->get();
    }

    public function create(array $data)
    {
        return $this->user->create($data);
    }

    public function find($id)
    {
        return $this->user->find($id);
    }

    public function findByEmail($email)
    {
        return $this->user->where('email', $email)->first();
    }

    public function findByPhone($phone)
    {
        return $this->user->where('phone', $phone)->first();
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

    public function trashed()
    {
        return $this->user->onlyTrashed()->get();
    }

    public function findTrashed($id)
    {
        return $this->user->onlyTrashed()->find($id);
    }
}
