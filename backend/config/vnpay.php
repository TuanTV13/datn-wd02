<?php

// config/vnpay.php
return [
    'tmn_code' => env('VNPAY_TMN_CODE'), // Mã website của bạn
    'hash_secret' => env('VNPAY_HASH_SECRET'), // Secret key của bạn
    'url' => 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html', // VNPay URL cho môi trường thử nghiệm (sandbox)
    'return_url' => env('VNPAY_RETURN_URL'), // URL trả về sau khi giao dịch
    // 'cancel_url' => env('VNPAY_CANCEL_URL'), // URL nếu giao dịch bị hủy
];
