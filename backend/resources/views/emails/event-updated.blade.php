<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thông báo cập nhật sự kiện</title>
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
        <h2>Thông báo cập nhật sự kiện</h2>
        <p>Chào {{ $user->name }},</p>
        <p>Chúng tôi muốn thông báo rằng sự kiện <strong>{{ $event->name }}</strong> đã được cập nhật với các thông tin mới:</p>
        
        <ul>
            <li><strong>Thời gian bắt đầu:</strong> {{ $event->start_time }} </li>
            <li><strong>Kết thúc:</strong> {{ $event->end_time }}</li>
            <li><strong>Địa điểm:</strong> {{ $event->location }}</li>
            @if($newSpeakers)
                <li><strong>Diễn giả mới:</strong> {{ implode(', ', $newSpeakers) }}</li>
            @endif
        </ul>

        <p>Xin vui lòng kiểm tra lại thông tin sự kiện để đảm bảo rằng bạn đã sẵn sàng tham gia.</p>
        
        <p>Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi.</p>
        
        <p>Trân trọng,<br>{{ config('app.name') }}</p>
        
        <div class="footer">
            &copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
        </div>
    </div>
</body>
</html>
