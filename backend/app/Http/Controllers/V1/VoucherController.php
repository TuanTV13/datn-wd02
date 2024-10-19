<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreVoucherRequest;
use App\Http\Requests\Admin\UpdateVoucherRequest;
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

    private function jsonResponse($success, $message, $data = [], $status = 200) {
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
            $vouchers = $this->voucherRepository->getAll();

            return $this->jsonResponse(true, 'Lấy danh sách mã giảm giá thành công.', $vouchers);
        } catch (Exception $e) {
            Log::error('Error:' . $e->getMessage());

            return $this->jsonResponse(false, 'Có lỗi xảy ra khi lấy danh sách mã giảm giá.', 500);
        }
    }

    public function create(StoreVoucherRequest $request)
    {
        DB::beginTransaction();
        
        $data = $request->validated();

        try {
            $voucher = $this->voucherRepository->create($data);

            if ($data['event_id'] ?? false) {
                $voucher->events()->attach($data['event_id']);
            }

            DB::commit();

            return $this->jsonResponse(true, 'Tạo mã giảm giá thành công.', $voucher, 201);
        } catch (Exception $e) {
            DB::rollback();

            Log::error('Error:' . $e->getMessage());

            return $this->jsonResponse(false, 'Có lỗi xảy ra khi tạo mã giảm giá.', 500);
        }
    }

    public function update(UpdateVoucherRequest $request, $id)
    {
        DB::beginTransaction();
        
        $data = $request->validated();

        try {
            $voucher = $this->voucherRepository->update($id, $data);

            if ($data['event_id'] ?? false) {
                $voucher->events()->sync($data['event_id']);
            }

            DB::commit();

            return $this->jsonResponse(true, 'Cập nhật mã giảm giá thành công.', $voucher);

        } catch (Exception $e) {
            DB::rollback();

            Log::error('Error:' . $e->getMessage());

            return $this->jsonResponse(false, 'Có lỗi xảy ra khi cập nhật mã giảm giá.', 500);
        }
    }

    public function delete($id)
    {
        try {
            $voucher = $this->voucherRepository->findById($id);

            if (!$voucher) {
                return $this->jsonResponse(false, 'Không tìm thấy mã giảm giá.', 404);
            }

            if (!in_array($voucher->status->key_name, ['draft', 'pending'])) {
                return $this->jsonResponse(false, 'Không thể xóa mã giảm giá.', 400);
            }

            $this->voucherRepository->delete($voucher->id);

            return $this->jsonResponse(true, 'Xóa mã giảm giá thành công.');

        } catch (Exception $e) {
            Log::error('Error:' . $e->getMessage());

            return $this->jsonResponse(false, 'Có lỗi xảy ra khi xóa mã giảm giá.', 500);
        }
    }

    public function trashed()
    { 
        try {
            $vouchersTrashed = $this->voucherRepository->trashed();

            if ($vouchersTrashed->isEmpty()) {
                return $this->jsonResponse(false, 'Không có mã giảm giá nào đã xóa.', 404);
            }

            return $this->jsonResponse(true, 'Lấy danh sách mã giảm giá đã xóa thành công.', $vouchersTrashed);
        } catch (Exception $e) {
            Log::error('Error:' . $e->getMessage());

            return $this->jsonResponse(false, 'Có lỗi xảy ra khi lấy danh sách mã giảm giá đã xóa.', 500);
        }
    }

    public function restore($id) 
    {
        try {
            $voucher = $this->voucherRepository->findTrashed($id);

            if (!$voucher) {
                return $this->jsonResponse(false, 'Không tìm thấy mã giảm giá đã xóa.', 404);
            }

            $this->voucherRepository->restore($voucher->id);

            return $this->jsonResponse(true, 'Khôi phục mã giảm giá thành công.');
        } catch (Exception $e) {
            Log::error('Error:' . $e->getMessage());

            return $this->jsonResponse(false, 'Có lỗi xảy ra khi khôi phục mã giảm giá.', 500);
        }
    }

    public function apply(Request $request)
    {
        $request->validate([
            'user_id' => ['required', 'integer'],
            'code' => ['required', 'string'],
        ]);

        try {
            $voucher = $this->voucherRepository->findByCode($request->code);
            
            if (!$voucher) {
                return $this->jsonResponse(false, 'Mã giảm giá không hợp lệ.', 404);
            }
            
            if ($validateResponse = $this->validateVoucher($voucher)) {
                return $validateResponse;
            }

            $totalPrice = $this->calculateDiscountPrice($voucher);
            
            if ($applyResponse = $this->applyVoucherForUser($voucher, $totalPrice)) {
                return $applyResponse;
            }

            return $this->jsonResponse(true, 'Áp dụng mã giảm giá thành công.', [
                'total_price' => $totalPrice,
                'voucher' => $voucher,
            ]);
        } catch (Exception $e) {
            Log::error('Error:' . $e->getMessage());

            return $this->jsonResponse(false, 'Có lỗi xảy ra khi áp dụng mã giảm giá.', 500);
        }
    }

    private function validateVoucher($voucher)
    {
        if ($voucher->status->key_name !== 'published') {
            return $this->jsonResponse(false, 'Mã giảm giá chưa được phát hành.', 400);
        }

        if (Carbon::parse($voucher->end_time) < now()) {
            return $this->jsonResponse(false, 'Mã giảm giá đã hết hạn.', 400);
        }

        if ($voucher->status->key_name == 'published' && Carbon::parse($voucher->start_time) > now()) {
            return $this->jsonResponse(false, 'Mã giảm giá chưa được kích hoạt.', 400);
        }
    }

    private function calculateDiscountPrice($voucher)
    {
        $ticketPrice = $voucher->ticket->price;

        return max(
            $voucher->discount_type === 'percent' ? $ticketPrice * ((100 - $voucher->discount_value) / 100) : $ticketPrice - $voucher->discount_value, 0
        );
    }

    private function applyVoucherForUser($voucher, $totalPrice)
    {
        $existVoucher = $voucher->users()->where('user_id', 2)->first();

        $count = 0;
        foreach ($voucher->users as $user) {
            if ($count += $user->pivot->used_count == $voucher->issue_quantity && $user->pivot->voucher_id == $voucher->id) {
                return $this->jsonResponse(false, 'Mã giảm giá đã hết lượt sử dụng.', 400);
            }
        }

        $discountValue = $voucher->discount_value;
        $discountType = $voucher->discount_type; 
        $usedAt = now(); 

        if ($existVoucher) {
            if ($existVoucher->pivot->used_count == $voucher->used_limit) {
                return $this->jsonResponse(false, 'Mã giảm giá đã hết lượt sử dụng.', 400);
            }

            $voucher->users()->updateExistingPivot(2, [
                'used_count' => $existVoucher->pivot->used_count + 1,
                'ticket_price' => $voucher->ticket->price,
                'discount_value' => $discountValue,
                'discount_type' => $discountType,
                'total_ticket_value' => ($totalPrice * $existVoucher->pivot->used_count),
                'used_at' => $usedAt
            ]);
        } else {
            $voucher->users()->attach(2, [
                'used_count' => 1,
                'discount_value' => $discountValue,
                'ticket_price' => $voucher->ticket->price,
                'discount_type' => $discountType,
                'total_ticket_value' => $totalPrice,
                'used_at' => $usedAt
            ]);
        }
    }
}
