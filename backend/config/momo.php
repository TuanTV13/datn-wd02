<?php

return [
    'endpoint' => env('MOMO_ENDPOINT', 'https://test-payment.momo.vn/v2/gateway/api/create'),
    'partner_code' => env('MOMO_PARTNER_CODE', 'YOUR_PARTNER_CODE'),
    'access_key' => env('MOMO_ACCESS_KEY', 'YOUR_ACCESS_KEY'),
    'secret_key' => env('MOMO_SECRET_KEY', 'YOUR_SECRET_KEY'),
    'return_url' => env('MOMO_RETURN_URL', 'http://localhost:8000/return-momo'),
    'notify_url' => env('MOMO_NOTIFY_URL', 'http://localhost:8000/notify-momo'),
        'notify_url' => env('MOMO_NOTIFY_URL', 'http://your-domain.com/api/momo/notify'),


            

];
