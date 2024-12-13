<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác nhận giao dịch: {{ $transaction->id }}</title>
</head>

<body style="font-family: 'Arial', sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; color: #333;">
    <div style="max-width: 700px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
        <h1 style="color: #007BFF; font-size: 26px; margin-bottom: 10px; text-align: center;">
            Xác Nhận Giao Dịch: {{ $transaction->transaction_code }}
        </h1>
        <p>Chào {{ $user->name }},</p>
        <p style="color: #28a745; font-weight: bold;">Giao dịch của bạn đã được xác nhận thành công!</p>

        <h2 style="color: #333; font-size: 20px; margin-top: 20px; margin-bottom: 10px;">Thông tin giao dịch:</h2>
        <ul style="list-style-type: none; padding: 0; margin: 0;">
            <li style="margin: 8px 0; padding: 10px; background: #e9ecef; border-radius: 5px;">
                <strong>Mã giao dịch:</strong> {{ $transaction->transaction_code }}
            </li>
            <li style="margin: 8px 0; padding: 10px; background: #e9ecef; border-radius: 5px;">
                <strong>Phương thức thanh toán:</strong> <span style="color: #007BFF;">{{ $transaction->payment_method }}</span>
            </li>
        </ul>

        <h2 style="color: #333; font-size: 20px; margin-top: 20px; margin-bottom: 10px;">Thông tin sự kiện:</h2>
        <ul style="list-style-type: none; padding: 0; margin: 0;">
            <li style="margin: 8px 0; padding: 10px; background: #e9ecef; border-radius: 5px;">
                <strong>Tên sự kiện:</strong> {{ $event->name }}
            </li>
            <li style="margin: 8px 0; padding: 10px; background: #e9ecef; border-radius: 5px;">
                <strong>Thời gian:</strong> {{ $event->start_time }}
            </li>
            <li style="margin: 8px 0; padding: 10px; background: #e9ecef; border-radius: 5px;">
                <strong>Địa điểm:</strong> {{ $event->location }}
            </li>
            @if ($event->link_oneline != null)
                <li style="margin: 8px 0; padding: 10px; background: #e9ecef; border-radius: 5px;">
                    <strong>Link online:</strong> {{ $event->link_online }}
                </li>
            @endif
        </ul>

        <h2 style="color: #333; font-size: 20px; margin-top: 20px; margin-bottom: 10px;">Thông tin vé:</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px; text-align: left; font-size: 14px; white-space: nowrap;">
            <thead>
                <tr style="background-color: #007BFF; color: #ffffff;">
                    <th style="padding: 10px; border: 1px solid #ddd; white-space: nowrap;">STT</th>
                    <th style="padding: 10px; border: 1px solid #ddd; white-space: nowrap;">Mã vé</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Loại vé</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Ví trí</th>
                    <th style="padding: 10px; border: 1px solid #ddd; white-space: nowrap;">QR Code</th>
                    <th style="padding: 10px; border: 1px solid #ddd; white-space: nowrap;">Giá tiền</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($tickets as $index => $ticket)
                    <tr style="background-color: {{ $index % 2 == 0 ? '#f9f9f9' : '#ffffff' }};">
                        <td style="padding: 10px; border: 1px solid #ddd; text-align: center; white-space: nowrap;">{{ $index + 1 }}</td>
                        <td style="padding: 10px; border: 1px solid #ddd; white-space: nowrap;">{{ $ticket['ticket_code'] }}</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">{{ $ticket['ticket_type'] }}</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">{{ $ticket['seat_zone'] }}</td>
                        <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">
                            <img src="{{ $ticket['qr_code_url'] }}" alt="QR Code" style="width: 50px; height: 50px;">
                        </td>
                        <td style="padding: 10px; border: 1px solid #ddd; text-align: right; white-space: nowrap;">
                            {{ number_format($ticket['original_price'], 0, ',', '.') }} VNĐ
                        </td>
                    </tr>
                @endforeach
            </tbody>
            <tfoot>
                <tr style="background-color: #007BFF; color: #ffffff;">
                    <td colspan="5" style="padding: 10px; text-align: right; font-weight: bold;">Tổng tiền:</td>
                    <td style="padding: 10px; text-align: right; font-weight: bold; white-space: nowrap;">
                        {{ number_format($total_amount, 0, ',', '.') }} VNĐ
                    </td>
                </tr>
            </tfoot>
        </table>

        <p style="margin: 20px 0; font-weight: bold; text-align: center;">Cảm ơn bạn đã tham gia đăng ký sự kiện!</p>

        <div style="margin-top: 30px; font-size: 0.9em; color: #666; text-align: center;">
            <p>Nếu bạn có bất kỳ câu hỏi nào, hãy liên hệ với chúng tôi qua email: <a href="mailto:support@example.com" style="color: #007BFF; text-decoration: none;">support@example.com</a></p>
            <p>Địa chỉ: 123 Đường ABC, Thành phố XYZ</p>
            <p>Số điện thoại: (012) 345-6789</p>
        </div>
    </div>
</body>

</html>
