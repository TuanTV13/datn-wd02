<?php

namespace App\Http\Services;

use Illuminate\Http\Request;

class PaymentService
{
    public function vnpayPayment(Request $request)
    {
        error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
        date_default_timezone_set('Asia/Ho_Chi_Minh');

        // Load từ file .env
        $vnp_Returnurl = "https://localhost/vnpay_php/vnpay_return.php";
        $vnp_TmnCode = env('VNP_TMNCODE');
        $vnp_HashSecret = env('VNP_HASHSECRET');
        $vnp_Url = env('VNP_URL');

        // Xác thực dữ liệu đầu vào
        $request->validate([
            'order_id' => 'required|string',
            'order_desc' => 'required|string',
            'order_type' => 'required|string',
            'amount' => 'required|numeric|min:1',
            'language' => 'nullable|string',
            'bank_code' => 'nullable|string',
            'txtexpire' => 'nullable|string',
            'txt_billing_mobile' => 'required|string',
            'txt_billing_email' => 'required|email',
            'txt_billing_fullname' => 'required|string',
            'txt_inv_addr1' => 'nullable|string',
            'txt_bill_city' => 'nullable|string',
            'txt_bill_country' => 'nullable|string',
            'txt_bill_state' => 'nullable|string',
            'txt_inv_mobile' => 'nullable|string',
            'txt_inv_email' => 'nullable|email',
            'txt_inv_customer' => 'nullable|string',
            'txt_inv_company' => 'nullable|string',
            'txt_inv_taxcode' => 'nullable|string',
            'cbo_inv_type' => 'nullable|string',
        ]);

        // Lấy dữ liệu từ request
        $vnp_TxnRef = $request->input('order_id');
        $vnp_OrderInfo = $request->input('order_desc');
        $vnp_OrderType = $request->input('order_type');
        $vnp_Amount = $request->input('amount') * 100;
        $vnp_Locale = $request->input('language', 'vn');
        $vnp_BankCode = $request->input('bank_code');
        $vnp_IpAddr = $request->ip();
        $vnp_ExpireDate = $request->input('txtexpire');

        // Billing info
        $fullName = trim($request->input('txt_billing_fullname'));
        $name = explode(' ', $fullName);
        $vnp_Bill_FirstName = array_shift($name);
        $vnp_Bill_LastName = array_pop($name);

        $inputData = [
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
            "vnp_TxnRef" => $vnp_TxnRef,
            "vnp_ExpireDate" => $vnp_ExpireDate,
            "vnp_Bill_Mobile" => $request->input('txt_billing_mobile'),
            "vnp_Bill_Email" => $request->input('txt_billing_email'),
            "vnp_Bill_FirstName" => $vnp_Bill_FirstName,
            "vnp_Bill_LastName" => $vnp_Bill_LastName,
            "vnp_Bill_Address" => $request->input('txt_inv_addr1'),
            "vnp_Bill_City" => $request->input('txt_bill_city'),
            "vnp_Bill_Country" => $request->input('txt_bill_country'),
            "vnp_Inv_Phone" => $request->input('txt_inv_mobile'),
            "vnp_Inv_Email" => $request->input('txt_inv_email'),
            "vnp_Inv_Customer" => $request->input('txt_inv_customer'),
            "vnp_Inv_Address" => $request->input('txt_inv_addr1'),
            "vnp_Inv_Company" => $request->input('txt_inv_company'),
            "vnp_Inv_Taxcode" => $request->input('txt_inv_taxcode'),
            "vnp_Inv_Type" => $request->input('cbo_inv_type'),
        ];

        if ($vnp_BankCode) {
            $inputData['vnp_BankCode'] = $vnp_BankCode;
        }

        ksort($inputData);
        $query = http_build_query($inputData);
        $vnp_Url = $vnp_Url . '?' . $query;

        if ($vnp_HashSecret) {
            $vnpSecureHash = hash_hmac('sha512', urldecode(http_build_query($inputData)), $vnp_HashSecret);
            $vnp_Url .= '&vnp_SecureHash=' . $vnpSecureHash;
        }

        $returnData = [
            'code' => '00',
            'message' => 'success',
            'data' => $vnp_Url
        ];

        return response()->json($returnData);
    }
}
