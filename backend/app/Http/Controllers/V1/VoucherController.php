<?php

namespace App\Http\Controllers\V1;

use App\Enums\VoucherStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreVoucherRequest;
use App\Http\Requests\Admin\UpdateVoucherRequest;
use App\Models\Event;
use App\Repositories\VoucherRepository;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class VoucherController extends Controller
{
    protected $voucherRepository;

    public function __construct(VoucherRepository $voucherRepository)
    {
        $this->voucherRepository = $voucherRepository;
    }

    private function jsonResponse($success, $message, $data = [], $status = 200)
    {
        $response = [
            'success' => $success,
            'message' => $message,
        ];
        if (!empty($data)) {
            $response['data'] = $data;
        }
        return response()->json($response, $status);
    }

    public function index()
    {
        try {
            // Lấy danh sách mã gaimr giá
            $vouchers = $this->voucherRepository->getAll();

            return $this->jsonResponse(true, 'Lấy danh sách mã giảm giá thành công.', $vouchers);
        } catch (Exception $e) {
            Log::error('Error:' . $e->getMessage());

            return $this->jsonResponse(false, 'Có lỗi xảy ra khi lấy danh sách mã giảm giá.', [], 500);
        }
    }

    public function voucherByEvent($id)
    {
        $vouchers = $this->voucherRepository->findByEvent($id);

        return response()->json($vouchers);
    }

    public function create(StoreVoucherRequest $request)
    {
        DB::beginTransaction();

        $data = $request->validated();

        try {
            // Thêm mã giảm giá
            $voucher = $this->voucherRepository->create($data);

            if ($data['event_id'] ?? false) {
                $voucher->events()->attach($data['event_id']);
            }

            DB::commit();

            return $this->jsonResponse(true, 'Tạo mã giảm giá thành công.', $voucher, 201);
        } catch (Exception $e) {
            DB::rollback();

            Log::error('Error:' . $e->getMessage());

            return $this->jsonResponse(false, 'Có lỗi xảy ra khi tạo mã giảm giá.', [], 500);
        }
    }

    public function update(UpdateVoucherRequest $request, $id)
    {
        DB::beginTransaction();

        $data = $request->validated();

        try {
            // Cập nhật mã giảm giá
            $voucher = $this->voucherRepository->update($id, $data);

            if ($data['event_id'] ?? false) {
                $voucher->events()->sync($data['event_id']);
            }

            DB::commit();

            return $this->jsonResponse(true, 'Cập nhật mã giảm giá thành công.', $voucher);
        } catch (Exception $e) {
            DB::rollback();

            Log::error('Error:' . $e->getMessage());

            return $this->jsonResponse(false, 'Có lỗi xảy ra khi cập nhật mã giảm giá.', [], 500);
        }
    }

    public function delete($id)
    {
        try {
            // Tìm mã giảm giá theo ID
            $voucher = $this->voucherRepository->findById($id);

            if (!$voucher) {
                return $this->jsonResponse(false, 'Không tìm thấy mã giảm giá.', [], 404);
            }


            $this->voucherRepository->delete($voucher->id);

            return $this->jsonResponse(true, 'Xóa mã giảm giá thành công.');
        } catch (Exception $e) {
            Log::error('Error:' . $e->getMessage());

            return $this->jsonResponse(false, 'Có lỗi xảy ra khi xóa mã giảm giá.', [], 500);
        }
    }

    public function trashed()
    {
        try {
            $vouchersTrashed = $this->voucherRepository->trashed();

            if ($vouchersTrashed->isEmpty()) {
                return $this->jsonResponse(false, 'Không có mã giảm giá nào đã xóa.', [], 404);
            }

            return $this->jsonResponse(true, 'Lấy danh sách mã giảm giá đã xóa thành công.', $vouchersTrashed);
        } catch (Exception $e) {
            Log::error('Error:' . $e->getMessage());

            return $this->jsonResponse(false, 'Có lỗi xảy ra khi lấy danh sách mã giảm giá đã xóa.', [], 500);
        }
    }

    public function restore($id)
    {
        try {
            $voucher = $this->voucherRepository->findTrashed($id);

            if (!$voucher) {
                return $this->jsonResponse(false, 'Không tìm thấy mã giảm giá đã xóa.', [], 404);
            }

            // Khôi phục mã giảm giá
            $this->voucherRepository->restore($voucher->id);

            return $this->jsonResponse(true, 'Khôi phục mã giảm giá thành công.');
        } catch (Exception $e) {
            Log::error('Error:' . $e->getMessage());

            return $this->jsonResponse(false, 'Có lỗi xảy ra khi khôi phục mã giảm giá.', [], 500);
        }
    }

    public function apply(Request $request, $totalAmount)
    {
        $request->validate([
            'event_id' => ['required', 'integer'],
            'user_id' => ['required', 'integer'],
            'code' => ['required', 'string'],
        ]);

        try {
            $voucher = $this->voucherRepository->findByCode($request->code);

            if (!$voucher) {
                return $this->jsonResponse(false, 'Mã giảm giá của bạn không hợp lệ không hợp lệ.', [], 404);
            }

            if ($validateResponse = $this->validateVoucher($voucher, $request->event_id)) {
                return $validateResponse;
            }

            $totalPrice = $this->calculateDiscountPrice($voucher, $totalAmount);

            if ($applyResponse = $this->applyVoucherForUser($voucher, $request->user_id)) {
                return $applyResponse;
            }

            return $this->jsonResponse(true, 'Bạn đã áp dụng mã giảm giá thành công.', [
                'total_price' => $totalPrice,
                'voucher' => $voucher->only(['code', 'discount_value', 'discount_type']),
            ]);
        } catch (Exception $e) {
            Log::info('Total Price before PayPal call: ', ['total_price' => $totalPrice]);
            Log::error('Error:' . $e->getMessage());

            return $this->jsonResponse(false, 'Có lỗi xảy ra khi bạn áp dụng mã giảm giá.', [], 500);
        }
    }

    private function validateVoucher($voucher, $eventId)
    {
        if ($voucher->status !== 'published') {
            return $this->jsonResponse(false, 'Mã giảm giá này chưa được phát hành.', [], 400);
        }

        if ($voucher->event_id != $eventId) {
            return $this->jsonResponse(false, 'Mã giảm giá không áp dụng cho sự kiện này.', [], 400);
        }

        if (Carbon::parse($voucher->end_time) < now()) {
            if ($voucher->status !== VoucherStatus::EXPIRED) {
                $voucher->update(['status' => VoucherStatus::EXPIRED]);
            }
            return $this->jsonResponse(false, 'Mã giảm giá này đã hết hạn.', [], 400);
        }
    }

    private function calculateDiscountPrice($voucher, $totalPrice)
    {


        return max(
            $voucher->discount_type === 'percent' ? $totalPrice * ((100 - $voucher->discount_value) / 100) : $totalPrice - $voucher->discount_value,
            0
        );
    }

    private function applyVoucherForUser($voucher, $userId)
    {
        $existVoucher = $voucher->users()->where('user_id', $userId)->first();

        $count = 0;
        foreach ($voucher->users as $user) {
            $count += $user->pivot->used_count;

            if ($count == $voucher->issue_quantity && $user->pivot->voucher_id == $voucher->id) {
                if ($voucher->status !== VoucherStatus::OUT_OF_STOCK) {
                    $voucher->update(['status' => VoucherStatus::OUT_OF_STOCK]);
                }
                return $this->jsonResponse(false, 'Mã giảm giá này đã hết lượt sử dụng.', [], 400);
            }
        }

        $discountValue = $voucher->discount_value;
        $discountType = $voucher->discount_type;
        $usedAt = now();

        if ($existVoucher) {
            if ($existVoucher->pivot->used_count == $voucher->used_limit) {
                return $this->jsonResponse(false, 'Mã giảm giá này đã đến tối đa số lần sử dụng.', [], 400);
            }

            $voucher->users()->updateExistingPivot($userId, [
                'used_count' => $existVoucher->pivot->used_count + 1,
                'discount_value' => $discountValue,
                'discount_type' => $discountType,
                'used_at' => $usedAt
            ]);
        } else {
            $voucher->users()->attach($userId, [
                'used_count' => 1,
                'discount_value' => $discountValue,
                'discount_type' => $discountType,
                'used_at' => $usedAt
            ]);
        }
    }
}
