<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Maatwebsite\Excel\Facades\Excel;
use App\Models\Province;
use App\Models\District;
use App\Models\Ward;
use Illuminate\Support\Facades\DB;

class LocationSeeder extends Seeder
{
    public function run()
    {
        $filePath = base_path('database/data/vnzone.xls'); // Đảm bảo đường dẫn đúng
        $data = Excel::toArray([], $filePath)[0]; // Đọc dữ liệu từ sheet đầu tiên

        DB::beginTransaction();
        try {
            $provinces = [];
            $districts = [];

            foreach ($data as $row) {
                // Kiểm tra nếu số lượng cột đủ trước khi sử dụng chúng
                if (count($row) < 8) {
                    echo "Skipping row with insufficient columns: " . implode(',', $row) . "\n";
                    continue;
                }

                // Đọc các cột từ file Excel
                $provinceName = $row[0] ?? null;  // Cột tỉnh/thành phố
                $provinceCode = $row[1] ?? null;  // Mã tỉnh thành
                $districtName = $row[2] ?? null;  // Cột quận/huyện
                $districtCode = $row[3] ?? null;  // Mã quận huyện
                $wardName = $row[4] ?? null;      // Cột phường/xã
                $wardCode = $row[5] ?? null;      // Mã phường xã
                $level = $row[6] ?? null;         // Cấp (province, district, ward)
                $provinceNameEn = $row[7] ?? null; // Tên tiếng Anh

                if ($provinceCode && !isset($provinces[$provinceCode])) {
                    $province = Province::updateOrCreate(
                        ['province_code' => $provinceCode], // Điều kiện kiểm tra tồn tại
                        [
                            'name' => $provinceName,
                            'name_en' => $provinceNameEn
                        ]
                    );
                    $provinces[$provinceCode] = $province->id;
                }

                if ($districtCode) {
                    if (!isset($districts[$districtCode])) {
                        $district = District::updateOrCreate(
                            ['district_code' => $districtCode], // Điều kiện kiểm tra tồn tại
                            [
                                'name' => $districtName,
                                'province_id' => $provinces[$provinceCode] ?? null
                            ]
                        );
                        $districts[$districtCode] = $district->id;
                    }
                }

                if ($wardCode) {
                    Ward::updateOrCreate(
                        ['ward_code' => $wardCode], // Điều kiện kiểm tra tồn tại
                        [
                            'name' => $wardName,
                            'district_id' => $districts[$districtCode] ?? null
                        ]
                    );
                }
            }

            DB::commit();
            echo "Data imported successfully.\n";
        } catch (\Exception $e) {
            DB::rollBack();
            echo "Failed to import data: " . $e->getMessage() . "\n";
        }
    }
}
