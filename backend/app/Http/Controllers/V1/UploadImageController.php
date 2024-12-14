<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class UploadImageController extends Controller
{
    public function upload(Request $request)
    {
        if ($request->hasFile('file')) {
            try {
                $uploadedFile = $request->file('file');

                // Kiểm tra file upload
                if (!$uploadedFile->isValid()) {
                    throw new \InvalidArgumentException('Tệp tải lên không hợp lệ');
                }

                // Upload file lên Cloudinary
                $uploadResult = Cloudinary::upload($uploadedFile->getRealPath());

                // Kiểm tra kết quả upload
                if (!$uploadResult || !$uploadResult->getSecurePath()) {
                    throw new \RuntimeException('Không thể lấy URL của ảnh từ Cloudinary');
                }

                // Lấy URL của file
                $uploadedFileUrl = $uploadResult->getSecurePath();

                Log::info('Uploaded File URL: ' . $uploadedFileUrl);

                return response()->json([
                    'url' => $uploadedFileUrl,
                    'message' => 'Upload successful!'
                ], 200);
            } catch (\InvalidArgumentException $e) {
                Log::error('Invalid file: ' . $e->getMessage());
                return response()->json(['message' => 'Tệp tải lên không hợp lệ: ' . $e->getMessage()], 400);
            } catch (\RuntimeException $e) {
                Log::error('Cloudinary upload failed: ' . $e->getMessage());
                return response()->json(['message' => 'Lỗi khi tải lên Cloudinary: ' . $e->getMessage()], 500);
            } catch (\Exception $e) {
                Log::error('An unexpected error occurred: ' . $e->getMessage());
                return response()->json(['message' => 'Có lỗi xảy ra trong quá trình tải lên.'], 500);
            }
        }

        return response()->json(['message' => 'Không tìm thấy hình ảnh để tải lên'], 400);
    }
}
