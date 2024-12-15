<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác nhận tài khoản</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .btn {
            display: inline-block;
            background-color: #28a745;
            color: #fff;
            padding: 10px 20px;
            border-radius: 5px;
            text-decoration: none;
        }
        .btn:hover {
            background-color: #218838;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 14px;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Xác nhận tài khoản của bạn</h2>
        <p>Chào {{ $user->name }},</p>
        <p>Cảm ơn bạn đã đăng ký tài khoản tại {{ config('app.name') }}. Vui lòng nhấp vào nút dưới đây để xác nhận địa chỉ email của bạn:</p>
        
        <p style="text-align: center;">
            <a href="{{ route('verification.verify', ['token' => $user->email_verification_token]) }}" style="color: #fff;" class="btn">Xác nhận tài khoản</a>
        </p>

        <p>Liên kết này sẽ hết hạn sau {{ $minutes }} phút.</p>
        <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
        
        <p>Trân trọng,<br>{{ config('app.name') }}</p>
        
        <div class="footer">
            &copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
        </div>
    </div>
</body>
</html>
