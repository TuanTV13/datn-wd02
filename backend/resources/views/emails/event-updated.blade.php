<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thông báo cập nhật sự kiện</title>
</head>

<body style="font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f7fa;">
    <table align="center" cellpadding="0" cellspacing="0" width="800"
        style="border-collapse: collapse; background-color: #ffffff; margin: 30px auto; padding: 0; border-radius: 12px; box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);">
        
        <!-- Header -->
        <tr>
            <td align="center" style="padding: 20px 0; background: linear-gradient(90deg, #007bff, #00c4ff); color: #ffffff; border-top-left-radius: 12px; border-top-right-radius: 12px;">
                <h1 style="margin: 0; font-size: 28px;">🔔 Sự Kiện {{ ucfirst($event->name) }} Đã Được Cập Nhật</h1>
                <p style="margin: 5px 0 0 0; font-size: 16px;">Cập nhật những thay đổi mới nhất!</p>
            </td>
        </tr>
        
        <!-- Message And Event Details-->
        <tr>
            <td style="padding: 20px; font-size: 16px; line-height: 1.8; color: #333333;">
                <p>Xin chào {{ $user->name }},</p>
                <p>
                    Chúng tôi muốn thông báo rằng sự kiện <strong style="color: #007bff;">{{ $event->name }}</strong> đã được cập nhật với các thông tin mới như sau:
                </p>
                <ul style="padding-left: 20px;">
                    <li><strong>Thời gian bắt đầu:</strong> {{ $event->start_time }}</li>
                    <li><strong>Thời gian kết thúc:</strong> {{ $event->end_time }}</li>
                    <li><strong>Địa điểm:</strong> {{ $event->location }}</li>
                </ul>
                <p>Xin vui lòng kiểm tra lại thông tin và chuẩn bị tốt nhất cho sự kiện. Nếu bạn có bất kỳ câu hỏi nào, hãy liên hệ với chúng tôi.</p>
            </td>
        </tr>

        <!-- CTA Button -->
        {{-- <tr>
            <td align="center" style="padding: 20px;">
                <a href="{{ $eventUrl }}" style="display: inline-block; background-color: #28a745; color: #ffffff; padding: 15px 35px; text-decoration: none; font-size: 18px; border-radius: 5px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15); transition: background-color 0.3s;">
                    Xem Chi Tiết Sự Kiện
                </a>
            </td>
        </tr> --}}

        <!-- Contact Information -->
        <tr>
            <td style="padding: 20px; font-size: 14px; color: #555555; background-color: #f9fbfd; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;">
                <p style="margin: 0;">Nếu bạn cần hỗ trợ, vui lòng liên hệ với chúng tôi qua email <a href="mailto:{{ config('mail.from.address') }}" style="color: #007bff; text-decoration: none;">{{ config('mail.from.address') }}</a>.</p>
            </td>
        </tr>

        <!-- Footer -->
        <tr>
            <td align="center" style="padding: 15px 0; font-size: 12px; color: #999999; background-color: #f1f1f1; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;">
                <p style="margin: 0;">&copy; 2024 {{ config('app.name') }}. Mọi quyền được bảo lưu.</p>
            </td>
        </tr>
    </table>
</body>

</html>
