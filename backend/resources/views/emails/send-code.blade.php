<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mã Xác Thực Đổi Mật Khẩu</title>
</head>
<body>
    <h2>Xin chào {{ $user->name }},</h2>

    <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình tại {{ config('app.name') }}.</p>

    <p>Dưới đây là mã xác thực của bạn để đổi mật khẩu:</p>

    <h3 style="color: #2d3748; font-size: 24px; font-weight: bold;">{{ $verification_code }}</h3>

    <p>Mã này có hiệu lực trong vòng {{ $minutes }} phút. Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>

    <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>

    <p>Trân trọng,<br>
    Đội ngũ hỗ trợ của {{ config('app.name') }}</p>
</body>
</html>
