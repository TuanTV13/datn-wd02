<?php

namespace App\Repositories\Auth;

use App\Models\User;

class LoginRepository
{

    public function findByEmail($email)
    {
        // Trả về user đầu tiên có email giống với email nhập vào
        return User::with(['province', 'district', 'ward'])->where('email', $email)->first();
    }
    
}