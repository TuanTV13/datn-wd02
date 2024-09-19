<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function getAll()
    {
        $users = User::with(['province', 'district', 'ward'])->latest('id')->get();

        return response()->json([
            'message' => $users
        ]);
    }
}
