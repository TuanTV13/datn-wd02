<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác nhận giao dịch</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 20px;
            color: #333;
        }

        .container {
            max-width: 600px;
            margin: auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        h1 {
            color: #007BFF;
            font-size: 26px;
            margin-bottom: 10px;
            text-align: center;
        }

        h2 {
            color: #333;
            font-size: 20px;
            margin-top: 20px;
            margin-bottom: 10px;
        }

        ul {
            list-style-type: none;
            padding: 0;
            margin: 0;
        }

        li {
            margin: 8px 0;
            padding: 10px;
            background: #e9ecef;
            border-radius: 5px;
        }

        .qr-code {
            text-align: center;
            margin: 20px 0;
        }

        img {
            border: 1px solid #007BFF;
            border-radius: 5px;
            margin-top: 10px;
            width: 200px;
            height: auto;
        }

        .footer {
            margin-top: 30px;
            font-size: 0.9em;
            color: #666;
            text-align: center;
        }

        a {
            color: #007BFF;
            text-decoration: none;
        }

        a:hover {
            text-decoration: underline;
        }

        .thank-you {
            margin: 20px 0;
            font-weight: bold;
            text-align: center;
        }
    </style>
</head>

<body>
    <div class="container">
        <h1>Xác Nhận Giao Dịch</h1>
        <p>Chào {{ $user->name }},</p>
        <p>Giao dịch của bạn đã được xác nhận thành công!</p>

        <h2>Thông tin giao dịch:</h2>
        <ul>
            <li><strong>Mã giao dịch:</strong> {{ $transaction->id }}</li>
            <li><strong>Tổng số tiền:</strong> {{ $transaction->total_amount }} VNĐ</li>
            <li><strong>Phương thức thanh toán:</strong> {{ $transaction->payment_method }}</li>
        </ul>

        <h2>Thông tin sự kiện:</h2>
        <ul>
            <li><strong>Tên sự kiện:</strong> {{ $event->name }}</li>
            <li><strong>Thời gian:</strong> {{ $event->start_time }}</li>
            <li><strong>Địa điểm:</strong> {{ $event->location }}</li>
        </ul>

        <h2>Thông tin vé:</h2>
        <ul>
            <li><strong>Mã vé:</strong> {{ $transaction->ticket_code }} - <strong>Link Online:</strong> {{ $event->link_online }}</li>
        </ul>

        <div class="qr-code">
            <h2>Mã QR của vé:</h2>
            <img src="{{ $qrCodeUrl }}" alt="Mã QR của vé">
        </div>

        <p class="thank-you">Cảm ơn bạn đã tham gia!</p>

        <div class="footer">
            <p>Nếu bạn có bất kỳ câu hỏi nào, hãy liên hệ với chúng tôi qua email: <a href="mailto:support@example.com">support@example.com</a></p>
            <p>Địa chỉ: 123 Đường ABC, Thành phố XYZ</p>
            <p>Số điện thoại: (012) 345-6789</p>
        </div>
    </div>
</body>

</html>
