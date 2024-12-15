<?php

namespace App\Http\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class VNPayService
{
    public function create(Request $request, $transaction_id, $totalAmount)
    {
        session(['cost_id' => $request->id]);
        session(['url_prev' => url()->previous()]);

        $vnp_TmnCode = env('VNPAY_TMN_CODE');
        $vnp_HashSecret = env('VNPAY_HASH_SECRET');

        $vnp_Url = "http://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        $vnp_Returnurl = 'http://localhost:5173/order-detail/' + $transaction_id;
        $vnp_TxnRef = date("YmdHis");
        $vnp_OrderInfo = "Thanh toán hóa đơn phí dịch vụ";
        $vnp_OrderType = 'billpayment';
        $vnp_Amount = $totalAmount * 100;  // VNPay yêu cầu số tiền tính bằng đồng
        $vnp_Locale = 'vn';
        $vnp_IpAddr = request()->ip();
        $vnp_BankCode = "QR";

        // Dữ liệu đầu vào cho VNPay
        $inputData = [
            "vnp_Version" => "2.0.0",
            "vnp_TmnCode" => $vnp_TmnCode,
            "vnp_Amount" => $vnp_Amount,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => date('YmdHis'),
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => $vnp_IpAddr,
            "vnp_Locale" => $vnp_Locale,
            "vnp_OrderInfo" => $vnp_OrderInfo,
            "vnp_OrderType" => $vnp_OrderType,
            "vnp_ReturnUrl" => $vnp_Returnurl,
            "vnp_TxnRef" => $vnp_TxnRef,
            "vnp_BankCode" => $vnp_BankCode,
        ];

        // Sắp xếp các tham số theo thứ tự từ A đến Z
        ksort($inputData);

        // Tạo chuỗi để băm (Secure Hash)
        $query = "";
        $i = 0;
        $hashdata = "";
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashdata .= '&' . $key . "=" . $value;
            } else {
                $hashdata .= $key . "=" . $value;
                $i = 1;
            }
            $query .= urlencode($key) . "=" . urlencode($value) . '&';
        }

        // Tạo URL thanh toán
        $vnp_Url = $vnp_Url . "?" . $query;
        if (isset($vnp_HashSecret)) {
            $vnpSecureHash =   hash_hmac('sha512', $hashdata, $vnp_HashSecret); // Băm dữ liệu
            $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;
        }

        Log::info('VNPay URL: ' . $vnp_Url);
        // Chuyển hướng người dùng đến VNPay
        return response()->json([
            'status' => 'success',
            'payment_url' => $vnp_Url
        ]);
    }
}
