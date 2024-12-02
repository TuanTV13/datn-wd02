<?php 

namespace App\Http\Services;

use App\Events\TransactionVerified;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class VNPayService
{
    public function create(Request $request, $transaction_id)
    {
        // Lưu transaction_id vào session để dùng ở return
        session(['cost_id' => $request->id]);
        session(['url_prev' => url()->previous()]);

        $vnp_TmnCode = env('VNPAY_TMN_CODE');
        $vnp_HashSecret = env('VNPAY_HASH_SECRET');

        $vnp_Url = "http://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        $vnp_Returnurl = "http://127.0.0.1:8000/return-vnpay/" . '?transaction_id=' . $transaction_id;
        $vnp_TxnRef = date("YmdHis");
        $vnp_OrderInfo = "Thanh toán hóa đơn phí dịch vụ";
        $vnp_OrderType = 'billpayment';
        $vnp_Amount = $request->input('amount') * 100;  // VNPay yêu cầu số tiền tính bằng đồng
        $vnp_Locale = 'vn';
        $vnp_IpAddr = request()->ip();
        $vnp_BankCode = "NCB";

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
            $vnpSecureHash =   hash_hmac('sha512', $hashdata, $vnp_HashSecret);// Băm dữ liệu
            $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;
        }

        // Chuyển hướng người dùng đến VNPay
        return response()->json([
            'status' => 'success',
            'payment_url' => $vnp_Url
        ]);
    }

    public function return(Request $request)
    {
        // Ghi log vào file để kiểm tra xem hàm có được gọi không
        Log::info('VNPay return function called', ['request' => $request->all()]);
    
        $url = session('url_prev', '/');
        $vnp_SecureHash = $request->vnp_SecureHash;
        $vnp_HashSecret = env('VNPAY_HASH_SECRET');
        $inputData = $request->except('vnp_SecureHash'); 
        $vnp_ResponseCode = $request->query('vnp_ResponseCode');
    
        ksort($inputData);
        $hashData = "";
        foreach ($inputData as $key => $value) {
            $hashData .= ($hashData ? '&' : '') . $key . '=' . $value;
        }
    
        $secureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);
    
        if ($secureHash === $vnp_SecureHash) {
            if ($vnp_ResponseCode == "00") {
                $transactionId = session('transaction_id');
                $transaction = Transaction::find($transactionId);
                
                if ($transaction) {
                    $transaction->status = 'completed';
                    $transaction->vnp_TransactionNo = $request->vnp_TransactionNo;
                    $transaction->vnp_BankCode = $request->vnp_BankCode;
                    $transaction->vnp_PayDate = $request->vnp_PayDate;
                    $transaction->save();
    
                    event(new TransactionVerified($transaction));
    
                    // Ghi log sau khi giao dịch thành công
                    Log::info('Transaction completed', ['transaction' => $transaction]);
    
                    return redirect($url)->with('success', 'Thanh toán thành công và giao dịch đã được xử lý.');
                }
            } else {
                // Ghi log nếu giao dịch không thành công
                Log::error('Transaction failed', ['response_code' => $request->vnp_ResponseCode]);
    
                return redirect($url)->with('error', 'Giao dịch không thành công. Mã lỗi: ' . $request->vnp_ResponseCode);
            }
        } else {
            // Ghi log nếu xác thực chữ ký không thành công
            Log::error('SecureHash verification failed');
    
            return redirect($url)->with('error', 'Xác thực chữ ký không thành công.');
        }
    }
}


