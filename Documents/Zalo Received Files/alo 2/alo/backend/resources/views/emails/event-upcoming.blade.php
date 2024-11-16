<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thông báo sự kiện sắp bắt đầu</title>
</head>

<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
    <table align="center" cellpadding="0" cellspacing="0" width="600"
        style="border-collapse: collapse; background-color: #ffffff; margin: 20px auto; padding: 20px; border: 1px solid #dddddd;">
        <!-- Header -->
        <tr>
            <td align="center" style="padding: 10px 0;">
                <!-- Logo has been removed -->
            </td>
        </tr>

        <!-- Event Banner -->
        <tr>
            <td align="center" style="padding: 20px 0;">
                <h1 style="color: #333333; font-size: 24px; margin: 0;">Sự kiện {{ $event->name }} Sắp Bắt Đầu</h1>
                <p style="color: #555555; font-size: 16px; margin: 10px 0;">Đừng bỏ lỡ những khoảnh khắc đặc biệt của sự kiện này!</p>
            </td>
        </tr>

        <!-- Event Details -->
        <tr>
            <td style="padding: 20px; color: #333333; font-size: 16px;">
                <p><strong>Ngày:</strong> {{ date('d-m-y', strtotime($event->start_time)) }}</p>
                <p><strong>Thời gian:</strong> {{ date('h:i', strtotime($event->start_time)) }}</p>
                <p><strong>Địa điểm:</strong> {{ $event->location }}</p>
                <p><strong>Mô tả:</strong> {{ $event->description }}</p>
            </td>
        </tr>

        <!-- CTA Button -->
        <tr>
            <td align="center" style="padding: 20px 0;">
                <a href="{{ $eventUrl }}"
                    style="background-color: #28a745; color: #ffffff; padding: 12px 24px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block;">Xem sự kiện</a>
            </td>
        </tr>

        <!-- Contact Information -->
        <tr>
            <td style="padding: 20px; color: #555555; font-size: 14px;">
                <p>Nếu bạn cần hỗ trợ, vui lòng liên hệ với chúng tôi qua email <a href="mailto:support@yourcompany.com"
                        style="color: #0066cc; text-decoration: none;">support@yourcompany.com</a>.</p>
            </td>
        </tr>

        <!-- Footer -->
        <tr>
            <td align="center" style="padding: 10px 0; color: #999999; font-size: 12px;">
                <p style="margin: 0;">&copy; 2024 {{ env('APP_NAME') }}. Mọi quyền được bảo lưu.</p>
            </td>
        </tr>
    </table>
</body>

</html>