<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use App\Services\Admin\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{

    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }
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

    public function create(RegisterRequest $registerRequest)
    {
        $user = $this->userService->create($registerRequest);

        return response()->json([
            'message' => $user['message']
        ]);
    }

    public function update(UpdateUserRequest $updateUserRequest, $id)
    {
        try {
            $result = $this->userService->update($updateUserRequest, $id);

            return response()->json([
                'message' => $result['message'],
                'user' => $result['user']
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Không tồn tại người dùng: ' . $id,
            ], 404); 
        } catch (\Throwable $th) {
            Log::error('message' . $th);
            return response()->json([
                'message' => 'Lỗi hệ thống'
            ], 500);
        }
    }

    public function destroy($id)
    {
        $result = $this->userService->destroy($id);

        if (!$result['status']) {
            return response()->json([
                'message' => $result['message']
            ], 404);
        }

        return response()->json([
            'message' => $result['message']
        ], 200); 
    }

    public function show($id)
    {
        $result = $this->userService->show($id);

        if(!$result['status']){
            return response()->json([
                'message' => $result['message']
            ]);
        }

        return response()->json([
            'user' => $result['user']
        ]);
    }
}
