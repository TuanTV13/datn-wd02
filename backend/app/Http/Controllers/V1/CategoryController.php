<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCategoryRequest;
use App\Http\Requests\Admin\UpdateCategoryRequest;
use App\Repositories\CategoryRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CategoryController extends Controller
{
    protected $categoryRepository;

    public function __construct(CategoryRepository $categoryRepository)
    {
        $this->categoryRepository = $categoryRepository;
    }

    public function index()
    {
        $category = $this->categoryRepository->getAll();

        return response()->json([
            'message' => 'Danh sách loại sự kiện',
            'data' => $category
        ]);
    }

    public function create(StoreCategoryRequest $request)
    {
        $data = $request->validated();

        try {
            // Thêm mới loại sự kiện
            $category = $this->categoryRepository->create($data);

            return response()->json([
                'message' => 'Thêm mới loại sự kiện thành công',
                'data' => $category,
            ], 201);
        } catch (\Exception $e) {

            Log::error("Lỗi khi thêm mới loại sự kiện:" . $e->getMessage());

            return response()->json([
                'message' => 'Lỗi hệ thống khi thêm mới loại sự kiện',
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            //
            $category = $this->categoryRepository->find($id);

            if (!$category) {
                return response()->json([
                    'message' => 'Loại sự kiện không tồn tại',
                ], 404);
            }

            return response()->json([
                'message' => 'Thông tin loại sự kiện',
                'data' => $category,
            ], 200);
        } catch (\Exception $e) {
            Log::error("Lỗi khi lấy thông tin loại sự kiện:" . $e->getMessage());

            return response()->json([
                'message' => 'Lỗi hệ thống khi lấy thông tin loại sự kiện',
            ], 500);
        }
    }

    public function update($id, UpdateCategoryRequest $requets)
    {
        $data = $requets->validated();

        try {
            //Tìm
            $category = $this->categoryRepository->find($id);

            if (!$category) {
                return response()->json([
                    'message' => 'Loại sự kiện không tồn tại',
                ], 404);
            }

            // Cập nhật
            $category = $this->categoryRepository->update($id, $data);

            return response()->json([
                'message' => 'Cập nhật loại sự kiện thành công',
                'data' => $category,
            ]);
        } catch (\Exception $e) {
            Log::error("Lỗi khi cập nhật loại sự kiện:" . $e->getMessage());

            return response()->json([
                'message' => 'Lỗi hệ thống khi cập nhật loại sự kiện',
            ], 500);
        }
    }

    public function destroy($id)
    {
        $category = $this->categoryRepository->find($id);

        if (!$category) {
            return response()->json([
                'message' => 'Loại sự kiện không tồn tại',
            ], 404);
        }

        if ($category->events()->count() > 0) {
            return response()->json([
                'message' => 'Không thể xóa loại sự kiện này vì nó có sự kiện liên quan.',
            ], 400);
        }

        try {
            $category->delete();

            return response()->json([
                'message' => 'Xóa loại sự kiện thành công',
            ], 200);
        } catch (\Exception $e) {
            Log::error("Lỗi khi xóa loại sự kiện: " . $e->getMessage());

            return response()->json([
                'message' => 'Lỗi hệ thống khi xóa loại sự kiện',
            ], 500);
        }
    }
}
