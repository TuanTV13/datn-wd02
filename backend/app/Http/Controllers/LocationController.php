<?php

namespace App\Http\Controllers;

use App\Models\District;
use App\Models\Province;
use App\Models\Ward;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LocationController extends Controller
{
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
}
