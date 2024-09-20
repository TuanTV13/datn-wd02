<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function getAll()
    {
        $users = User::with(['province', 'district', 'ward']);

        return response()->json([
            'users' => $users
        ]);
    }

    public function query(Request $request)
    {
        $search = $request->input('search');
        $provinceId = $request->input('province_id');
        $districtId = $request->input('district_id');
        $wardId = $request->input('ward_id');

        $query = User::with(['province', 'district', 'ward']);

        if ($search) {
            $query->where(function ($query) use ($search) {
                $query->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('email', 'LIKE', "%{$search}%")
                    ->orWhere('phone', 'LIKE', "%{$search}%");
            });
        }

        if ($provinceId) {
            $query->where('province_id', $provinceId);
        }

        if ($districtId) {
            $query->where('district_id', $districtId);
        }

        if ($wardId) {
            $query->where('ward_id', $wardId);
        }

        $users = $query->paginate(5);

        return response()->json([
            'data' => $users
        ]);
    }

}
