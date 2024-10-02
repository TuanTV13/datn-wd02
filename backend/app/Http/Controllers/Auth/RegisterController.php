<?php

namespace App\Http\Controllers\Auth;

use App\Events\UserRegisterdSuccess;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\District;
use App\Models\Province;
use App\Models\User;
use App\Models\Ward;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;

class RegisterController extends Controller
{

    // 
    public function showProvinces()
    {
        try {
            $provinces = Province::all();
            return response()->json($provinces);
        } catch (\Exception $e) {
            Log::error('Lỗi khi nạp dữ liệu tỉnh thành: ' . $e->getMessage());
            return response()->json(['error' => 'Không thể nạp dữ liệu tỉnh thành'], 500);
        }
    }

    // List các huyện
    public function getDistricts($provinceId)
    {
        try {
            $districts = District::where('province_id', $provinceId)->get();
            return response()->json($districts);
        } catch (\Exception $e) {
            Log::error('Lỗi khi nạp dữ liệu quận huyện: ' . $e->getMessage());
            return response()->json(['error' => 'Không thể nạp dữ liệu quận huyện'], 500);
        }
    }

    // List các xã
    public function getWards($districtId)
    {
        try {
            $wards = Ward::where('district_id', $districtId)->get();
            return response()->json($wards);
        } catch (\Exception $e) {
            Log::error('Lỗi khi nạp dữ liệu phường xã: ' . $e->getMessage());
            return response()->json(['error' => 'Không thể nạp dữ liệu phường xã'], 500);
        }
    }

    // Xử lý đăng kí
    public function register(RegisterRequest $registerRequest)
    {
        try {

            DB::transaction(function () use ($registerRequest) {

                $data = $registerRequest->validated();

                if ($registerRequest->hasFile('image')) {
                    $data['image'] = Storage::put('users', $registerRequest->file('image'));
                }

                $data['password'] = bcrypt($data['password']);

                $data['email_verification_token'] = Str::random(60);

                $user = User::create($data);

                $minutes = config('auth.passwords.users.expire');

                UserRegisterdSuccess::dispatch($user, $minutes);
            }, 3);

            return response()->json([
                'message' => 'Tài khoản cần được xác thực',
            ]);
        } catch (ValidationException $e) {
            Log::error($e->getMessage(), $e->errors());

            return response()->json([
                'message' => 'Đã xảy ra lỗi trong quá trình xác thực.',
                'errors' => $e->errors(),
            ], 422);
        }
    }
}
