<?php

namespace App\Http\Services\Payments;

use Illuminate\Http\Request;

class VNPayService
{
    public function VNPay(array $vnpData)
    {
        error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
        date_default_timezone_set('Asia/Ho_Chi_Minh');

        $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        $vnp_Returnurl = "https://yourdomain.com/vnpay_return";
        $vnp_TmnCode = "EP6D195M";
        $vnp_HashSecret = "BXHMKQDC6JE9LTJEMKIW0MR9XQO3QG2M"; 

        // Các tham số cần gửi
        $vnp_TxnRef = $vnpData['txn_ref']; 
        $vnp_OrderInfo = $vnpData['order_desc']; 
        $vnp_OrderType = $vnpData['order_type'];
        $vnp_Amount = $vnpData['total_amount']; 
        $vnp_Locale = $vnpData['language']; 
        $vnp_BankCode = $vnpData['bank_code']; 
        $vnp_IpAddr = $vnpData['ip_addr'];

        $inputData = array(
            "vnp_Version" => "2.1.0",
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
            "vnp_TxnRef" => $vnp_TxnRef
        );

        if (!empty($vnp_BankCode)) {
            $inputData['vnp_BankCode'] = $vnp_BankCode;
        }

        ksort($inputData);
        $hashdata = "";
        $query = "";
        $i = 0;
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashdata .= '&' . $key . "=" . $value;
            } else {
                $hashdata .= $key . "=" . $value;
                $i = 1;
            }
            $query .= urlencode($key) . "=" . urlencode($value) . '&';
        }

        $hashdata = http_build_query($inputData);
        $vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret); 

        $vnp_Url .= "?" . $hashdata . '&vnp_SecureHash=' . $vnpSecureHash;

        return response()->json([
            'status' => 'success',
            'payment_url' => $vnp_Url
        ]);
    }
}
