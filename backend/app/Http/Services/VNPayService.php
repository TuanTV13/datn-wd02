<?php

namespace App\Http\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;

class VNPayService
{
    public function create(Request $request)
    {
        session(['cost_id' => $request->id]);
        session(['url_prev' => url()->previous()]);
        
        // Các thông tin cần thiết cho VNPay
        $vnp_TmnCode = env('VNPAY_TMN_CODE');
        $vnp_HashSecret = env('VNPAY_HASH_SECRET');
        $vnp_Url = "http://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        $vnp_Returnurl = "http://localhost:8000/return-vnpay";
        $vnp_TxnRef = date("YmdHis");
        $vnp_OrderInfo = "Thanh toán hóa đơn phí dịch vụ";
        $vnp_OrderType = 'billpayment';
        $vnp_Amount = $request->input('amount') * 100;  // VNPay yêu cầu số tiền tính bằng đồng
        $vnp_Locale = 'vn';
        $vnp_IpAddr = request()->ip();

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
        ];

        // Nếu có mã ngân hàng, thêm vào dữ liệu
        $vnp_BankCode = $request->input('vnp_BankCode');
        if ($vnp_BankCode) {
            $inputData['vnp_BankCode'] = $vnp_BankCode;
        }

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
            $vnpSecureHash = hash('sha256', $vnp_HashSecret . $hashdata);
            $vnp_Url .= 'vnp_SecureHashType=SHA256&vnp_SecureHash=' . $vnpSecureHash;
        }

        // Chuyển hướng người dùng đến VNPay
        return redirect($vnp_Url);
    }

    public function return(Request $request)
    {
        $url = session('url_prev', '/');

        // Kiểm tra kết quả thanh toán
        if ($request->vnp_ResponseCode == "00") {
            // Thanh toán thành công
            // Ví dụ, gọi phương thức xử lý thanh toán thành công
            // $this->apSer->thanhtoanonline(session('cost_id'));

            // Lưu giao dịch thành công và quay lại URL trước đó
            return redirect($url)->with('success', 'Đã thanh toán phí dịch vụ');
        } else {
            // Thanh toán không thành công, xóa URL trước đó khỏi session
            session()->forget('url_prev');

            // Quay lại URL trước đó và hiển thị lỗi
            return redirect($url)->with('error', 'Lỗi trong quá trình thanh toán phí dịch vụ. Mã lỗi: ' . $request->vnp_ResponseCode);
        }
    }
}
