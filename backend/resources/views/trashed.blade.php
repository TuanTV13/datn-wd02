<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Danh sách Voucher đã xóa</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body>
    <div class="container">
        <h1 class="mb-4">Danh sách Voucher đã xóa</h1>
        
        <a href="{{ route('create') }}" class="btn btn-primary mb-4">Tạo Voucher</a>

        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Người dùng</th>
                    <th>Sự kiện</th>
                    <th>Vé</th>
                    <th>Trạng thái</th>
                    <th>Mã giảm giá</th>
                    <th>Loại giảm giá</th>
                    <th>Giá trị giảm giá</th>
                    <th>Giá trị vé tối thiểu</th>
                    <th>Giá trị vé tối đa</th>
                    <th>Thời gian bắt đầu</th>
                    <th>Thời gian kết thúc</th>
                    <th>Số lần sử dụng tối đa</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody>
                {{-- @dd($vouchers) --}}
                @foreach ($vouchersTrashed as $voucher)
                    {{-- @dd($voucher->status) --}}
                    <tr>
                        <td>{{ $voucher->id }}</td>
                        <td>{{ $voucher->user->name ?? 'N/A' }}</td>
                        <td>{{ $voucher->event->name ?? 'N/A' }}</td>
                        <td>{{ $voucher->ticket->ticket_type ?? 'N/A' }}</td>
                        <td>{{ $voucher->status->name ?? 'N/A' }}</td>
                        <td>{{ $voucher->code }}</td>
                        <td>{{ $voucher->discount_type }}</td>
                        <td>{{ $voucher->discount_value }}</td>
                        <td>{{ $voucher->min_ticket_value }}</td>
                        <td>{{ $voucher->max_ticket_value }}</td>
                        <td>{{ $voucher->start_time }}</td>
                        <td>{{ $voucher->end_time }}</td>
                        <td>{{ $voucher->used_limit }}</td>
                        <td>
                            <form action="{{ route('restore', $voucher->id) }}" method="POST"> @csrf <button class="btn btn-primary">Khôi phục</button></form>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>
