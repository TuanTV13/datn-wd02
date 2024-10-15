<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreVoucherRequest;
use App\Repositories\VoucherRepository;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class VoucherController extends Controller
{
    protected $voucherRepository;

    public function __construct(VoucherRepository $voucherRepository)
    {
        $this->voucherRepository = $voucherRepository;
    }

    public function create(StoreVoucherRequest $request)
    {
        $data = $request->validated();
        $data['status_id'] = 11;

        try {
            $voucher = $this->voucherRepository->create($data);

            return response()->json([
                'data' => $voucher
            ]);
        } catch (Exception $e) {
            Log::error("message" . $e->getMessage());

            return response()->json([
                'errors' => $e->getMessage()
            ]);
        }
    }
}
