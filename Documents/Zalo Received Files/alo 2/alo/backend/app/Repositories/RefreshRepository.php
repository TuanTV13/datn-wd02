<?php

namespace App\Repositories;

use App\Models\RefreshToken;

class RefreshRepository
{
    protected $refreshToken;
    public function __construct(RefreshToken $refreshToken)
    {
        $this->refreshToken = $refreshToken;
    }
    public function create($userId, $token, $expiresAt)
    {
        return $this->refreshToken->create([
            'user_id' => $userId,
            'token' => $token,
            'expires_at' => $expiresAt,
        ]);
    }

    public function findByToken($token)
    {
        return $this->refreshToken->where('token', $token)->first();
    }

    public function findByUserId($UserId)
    {
        return $this->refreshToken->where('user_id', $UserId)->first();
    }

    public function delete($id)
    {
        $refreshToken = $this->findByUserId($id);
        return $refreshToken->delete();
    }
}
