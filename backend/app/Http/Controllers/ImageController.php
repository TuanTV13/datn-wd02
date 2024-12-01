<?php

namespace App\Http\Controllers;

use Google\Cloud\Storage\StorageClient;
use Illuminate\Http\Request;

class ImageController extends Controller
{
    public function upload(Request $request)
    {
        // Validate file
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Nhận file từ request
        $file = $request->file('image');
        $fileName = time() . '_' . $file->getClientOriginalName();

        // Khởi tạo Storage Client
        $storage = new StorageClient([
            'projectId' => env('GOOGLE_CLOUD_PROJECT_ID'),
            'keyFilePath' => base_path(env('GOOGLE_CLOUD_KEY_FILE_PATH')),
        ]);

        // Lấy bucket
        $bucket = $storage->bucket(env('GOOGLE_CLOUD_BUCKET'));

        // Upload file
        $bucket->upload(
            fopen($file->getRealPath(), 'r'),
            [
                'name' => $fileName,
                'predefinedAcl' => 'publicRead', // Đặt public nếu muốn link ảnh công khai
            ]
        );

        // Tạo URL public của ảnh
        $imageUrl = "https://storage.googleapis.com/" . env('GOOGLE_CLOUD_BUCKET') . "/" . $fileName;

        // Lưu link ảnh vào database (tùy chọn)
        // Image::create(['url' => $imageUrl]);

        return response()->json([
            'success' => true,
            'image_url' => $imageUrl,
        ]);
    }

}
