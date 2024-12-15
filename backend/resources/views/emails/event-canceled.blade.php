<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thông Báo Hủy Sự Kiện</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</head>
<body>
    <div class="container mt-5">
        <h1 class="text-danger">Thông Báo Hủy Sự Kiện</h1>
        <div class="alert alert-warning">
            <strong>Chúng tôi xin thông báo rằng sự kiện "{{ $event->name }}" đã bị hủy.</strong>
        </div>
        <p><strong>Thông tin chi tiết về sự kiện:</strong></p>
        <ul>
            <li><strong>Thời gian:</strong> {{ $event->date }}</li>
            <li><strong>Địa điểm:</strong> {{ $event->venue }}</li>
            <li><strong>Người diễn giả:</strong> {{ $event->speakers }}</li>
        </ul>
        <p>Cảm ơn bạn đã quan tâm và chúng tôi xin lỗi vì sự bất tiện này.</p>
        <a href="{{ route('events.index') }}" class="btn btn-primary">Quay lại danh sách sự kiện</a>
    </div>

    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
