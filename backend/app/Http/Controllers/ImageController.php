<?php

namespace App\Http\Controllers;

use Google\Cloud\Storage\StorageClient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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

        try {
            // **Upload lên Amazon S3**
            $path = Storage::disk('s3')->putFileAs('uploads', $file, $fileName);

            // Lấy URL public từ S3
            $s3Url = Storage::disk('s3')->url($path);

            // **Upload lên Google Cloud Storage (GCS)**
            $storage = new StorageClient([
                'projectId' => env('GOOGLE_CLOUD_PROJECT_ID'),
                'keyFilePath' => base_path(env('GOOGLE_CLOUD_KEY_FILE_PATH')),
            ]);

            $bucket = $storage->bucket(env('GOOGLE_CLOUD_BUCKET'));

            $bucket->upload(
                fopen($file->getRealPath(), 'r'),
                [
                    'name' => $fileName,
                    'predefinedAcl' => 'publicRead',
                ]
            );

            $gcsUrl = "https://storage.googleapis.com/" . env('GOOGLE_CLOUD_BUCKET') . "/" . $fileName;

            // Trả về JSON response với cả hai link
            return response()->json([
                'success' => true,
                'message' => 'Upload successful!',
                's3_url' => $s3Url,
                'gcs_url' => $gcsUrl,
            ], 200);
        } catch (\Exception $e) {
            // Trả về lỗi nếu quá trình upload thất bại
            return response()->json([
                'success' => false,
                'message' => 'Upload failed: ' . $e->getMessage(),
            ], 500);
        }
    }
}
