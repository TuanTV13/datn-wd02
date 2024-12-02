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
                'message' => 'Thêm mới danh mục sự kiện thành công',
                'data' => $category,
            ], 201);
        } catch (\Exception $e) {

            Log::error("Lỗi khi thêm mới danh mục sự kiện:" . $e->getMessage());

            return response()->json([
                'message' => 'Lỗi hệ thống khi thêm mới danh mục sự kiện',
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
                    'message' => 'Danh mục sự kiện không tồn tại',
                ], 404);
            }

            return response()->json([
                'message' => 'Thông tin danh mục sự kiện',
                'data' => $category,
            ], 200);
        } catch (\Exception $e) {
            Log::error("Lỗi khi lấy thông tin danh mục sự kiện:" . $e->getMessage());

            return response()->json([
                'message' => 'Lỗi hệ khi lấy thông tin danh mục sự kiện',
            ], 500);
        }
    }

    public function update($id, UpdateCategoryRequest $requets)
    {
        $data = $requets->validated();

        try {
            //Tìm id của danh mục sự kiện
            $category = $this->categoryRepository->find($id);

            if (!$category) {
                return response()->json([
                    'message' => 'Danh mục sự kiện không tồn tại',
                ], 404);
            }

            // Cập nhật
            $category = $this->categoryRepository->update($id, $data);

            return response()->json([
                'message' => 'Cập nhật danh mục sự kiện thành công',
                'data' => $category,
            ]);
        } catch (\Exception $e) {
            Log::error("Lỗi khi cập nhật danh mục sự kiện:" . $e->getMessage());

            return response()->json([
                'message' => 'Lỗi hệ thống khi cập nhật danh mục sự kiện',
            ], 500);
        }
    }

    public function destroy($id)
    {
        $category = $this->categoryRepository->find($id);

        if (!$category) {
            return response()->json([
                'message' => 'Danh mục sự kiện không tồn tại',
            ], 404);
        }

        if ($category->events()->count() > 0) {
            return response()->json([
                'message' => 'Không thể xóa danh mục sự kiện này vì nó có sự kiện liên quan.',
            ], 400);
        }

        try {
            $category->delete();

            return response()->json([
                'message' => 'Xóa danh mục sự kiện thành công',
            ], 200);
        } catch (\Exception $e) {
            Log::error("Lỗi khi xóa danh mục sự kiện: " . $e->getMessage());

            return response()->json([
                'message' => 'Lỗi hệ thống khi xóa danh mục sự kiện',
            ], 500);
        }
    }
}
