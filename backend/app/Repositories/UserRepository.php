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
        return $this->user->all();
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
        $usersTrashed = $this->user->onlyTrashed()->orderBy('deleted_at', 'desc')->get();
        return $usersTrashed;
    }

    public function findTrashed($id)
    {
        return $this->user->onlyTrashed()->find($id);
    }

    public function restore($id)
    {
        $userTrashed = $this->user->withTrashed()->find($id);
        return $userTrashed->restore();
    }

    public function forceDelete($id)
    {
        $userTrashed = $this->user->withTrashed()->find($id);
        return $userTrashed->forceDelete();
    }
}
