<?php

namespace App\Http\Controllers\Auth;

use App\Events\UserRegisterdSuccess;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\District;
use App\Models\Province;
use App\Models\User;
use App\Models\Ward;
use App\Services\Auth\RegisterService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;

class RegisterController extends Controller
{

    protected $registerService;

    public function __construct(RegisterService $registerService)
    {
        $this->registerService = $registerService;
    }

    // Tỉnh
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

    public function register(RegisterRequest $registerRequest)
    {
        $user = $this->registerService->create($registerRequest);

        return response()->json([
            'message' => $user['message']
        ]);
    }
}
