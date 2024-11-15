<!DOCTYPE html>
<html>
<head>
    <title>Phản hồi đánh giá</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
        <h2 style="text-align: center; color: #4CAF50;">Phản hồi đánh giá của bạn</h2>
        <p>Xin chào <strong>{{ $feedback->user->name }}</strong>,</p>
        <p style="margin-bottom: 15px;">Cảm ơn bạn đã gửi đánh giá. Dưới đây là chi tiết đánh giá của bạn:</p>
        <blockquote style="background-color: #f0f0f0; padding: 15px; border-left: 5px solid #2196F3; margin: 20px 0;">
            <p style="margin: 0;"><em>{{ $feedback->feedback }}</em></p>
        </blockquote>
        @if ($feedback->suggestions != null)
            <p>Đề xuất từ bạn:</p>
            <blockquote style="background-color: #f7f7f7; padding: 15px; border-left: 5px solid #FF9800; margin: 20px 0;">
                <p style="margin: 0;"><em>{{ $feedback->suggestions }}</em></p>
            </blockquote>
        @endif
        <p>Phản hồi từ chúng tôi:</p>
        <blockquote style="background-color: #f9f9f9; padding: 15px; border-left: 5px solid #4CAF50; margin: 20px 0;">
            <p style="margin: 0;">{{ $feedback->response }}</p>
        </blockquote>
        <p>Trân trọng,</p>
        <p style="font-weight: bold;">Đội ngũ hỗ trợ</p>
    </div>
</body>
</html>
