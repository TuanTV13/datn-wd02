<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $json = File::get(database_path('data/vietnam_provinces.json'));
        $data = json_decode($json, true);

        // Chèn dữ liệu vào bảng provinces
        foreach ($data['provinces'] as $province) {
            DB::table('provinces')->updateOrInsert([
                'id' => $province['id']
            ], [
                'name' => $province['name'],
            ]);

            // Chèn dữ liệu vào bảng districts
            foreach ($province['districts'] as $district) {
                DB::table('districts')->updateOrInsert([
                    'id' => $district['id']
                ], [
                    'name' => $district['name'],
                    'province_id' => $province['id']
                ]);

                // Chèn dữ liệu vào bảng wards
                foreach ($district['wards'] as $ward) {
                    DB::table('wards')->updateOrInsert([
                        'id' => $ward['id']
                    ], [
                        'name' => $ward['name'],
                        'district_id' => $district['id']
                    ]);
                }
            }
        }
    }
}
