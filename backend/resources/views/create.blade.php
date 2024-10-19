<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tạo Voucher</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>

<div class="container mt-5">
    <h2 class="text-center">Tạo Voucher</h2>
    <form action="{{ route('store') }}" method="POST">
        @csrf
        
        <input type="hidden" name="creator_id" value="1">

        <div class="mb-3">
            <label for="voucherCode" class="form-label">Mã Voucher</label>
            <input type="text" name="code" class="form-control @error('code') is-invalid @enderror" id="voucherCode"  value="{{ strtoupper(Str::random(5)) . rand(1, 9) }}" placeholder="Nhập mã voucher">
            @error('code')
                <small class="text-danger fw-bold fst-italic">* {{ $message }}</small>
            @enderror
        </div>

        <div class="mb-3">
            <label for="voucherType" class="form-label">Sự kiện</label>
            <select name="event_id" class="form-select @error('event_id') is-invalid @enderror @error('code') is-invalid @enderror" id="voucherType">
                <option value="">Chọn sự kiện</option>
                @foreach ($events as $event)
                    <option value="{{ $event->id }}" @if($event->id == old('event_id')) selected @endif>{{ $event->name }}</option>
                @endforeach
            </select>
            @error('event_id')
                <small class="text-danger fw-bold fst-italic">* {{ $message }}</small>
            @enderror
        </div>

        <div class="mb-3">
            <label for="voucherType" class="form-label">Loại vé</label>
            <select name="ticket_id" class="form-select @error('code') is-invalid @enderror" id="voucherType">
                <option value="">Chọn loại vé áp dụng voucher</option>
                @foreach ($events as $event)
                    @foreach ($event->tickets as $ticket)
                        <option value="{{ $ticket->id }}" @if ($ticket->id == old('ticket_id')) selected @endif>{{ strtoupper($ticket->ticket_type) }} | {{ $ticket->price }}</option>
                    @endforeach
                @endforeach
            </select>
            @error('ticket_id')
                <small class="text-danger fw-bold fst-italic">* {{ $message }}</small>
            @enderror
        </div>

        <div class="mb-3">
            <label for="voucherType" class="form-label">Loại Voucher</label>
            <select name="discount_type" class="form-select @error('discount_type') is-invalid @enderror" id="voucherType">
                <option value="">Chọn loại voucher</option>
                <option value="percent" @if('percent' == old('discount_type')) selected @endif>Giảm giá theo phần trăm</option>
                <option value="fixed"   @if('fixed' == old('discount_type')) selected @endif>Giảm giá cố định</option>
            </select>
            @error('discount_type')
                <small class="text-danger fw-bold fst-italic">* {{ $message }}</small>
            @enderror
        </div>

        <div class="mb-3">
            <label for="voucherValue" class="form-label">Giá trị mã giảm giá</label>
            <input type="number" name="discount_value" class="form-control @error('discount_value') is-invalid @enderror" id="voucherValue" min="0" value="{{ old('discount_value') }}" placeholder="Nhập giá trị voucher">
            @error('discount_value')
                <small class="text-danger fw-bold fst-italic">* {{ $message }}</small>
            @enderror
        </div>

        <div class="mb-3">
            <label for="minTicketValue" class="form-label">Giá trị vé tối thiểu</label>
            <input type="number" name="min_ticket_value" class="form-control @error('min_ticket_value') is-invalid @enderror" id="minTicketValue" min="0" value="{{ old('min_ticket_value') }}"  placeholder="Nhập giá vé tối thiểu">
            @error('min_ticket_value')
                <small class="text-danger fw-bold fst-italic">* {{ $message }}</small>
            @enderror
        </div>

        <div class="mb-3">
            <label for="maxTicketValue" class="form-label">Giá trị vé tối đa</label>
            <input type="number" name="max_ticket_value" class="form-control @error('max_ticket_value') is-invalid @enderror" id="maxTicketValue" min="0" value="{{ old('max_ticket_value') }}" placeholder="Nhập giá vé tối thiểu">
            @error('max_ticket_value')
                <small class="text-danger fw-bold fst-italic">* {{ $message }}</small>
            @enderror
        </div>

        <div class="mb-3">
            <label for="quantity" class="form-label">Số lượng mã giảm giá</label>
            <input type="number" name="issue_quantity" class="form-control @error('issue_quantity') is-invalid @enderror" id="quantity" min="0" value="{{ old('issue_quantity', 1) }}" placeholder="Nhập số lượng mã giảm giá">
            @error('issue_quantity')
                <small class="text-danger fw-bold fst-italic">* {{ $message }}</small>
            @enderror
        </div>

        <div class="mb-3">
            <label for="maxUsage" class="form-label">Số lần sử dụng tối đa</label>
            <input type="number" name="used_limit" class="form-control @error('used_limit') is-invalid @enderror" id="maxUsage" min="0" value="{{ old('used_limit', 1) }}" placeholder="Nhập số lần sử dụng tối đa">
            @error('used_limit')
                <small class="text-danger fw-bold fst-italic">* {{ $message }}</small>
            @enderror
        </div>

        {{-- <div class="mb-3">
            <label for="usedCount" class="form-label">Số lần đã sử dụng</label>
            <input type="number" class="form-control @error('code') is-invalid @enderror" id="usedCount" min="0" placeholder="Nhập số lần đã sử dụng">
        </div> --}}

        <div class="mb-3">
            <label for="startDate" class="form-label">Ngày bắt đầu</label>
            <input type="date" name="start_time" class="form-control @error('start_time') is-invalid @enderror" value="{{ old('start_time') }}" id="startDate">
            @error('start_time')
                <small class="text-danger fw-bold fst-italic">* {{ $message }}</small>
            @enderror
        </div>

        <div class="mb-3">
            <label for="endDate" class="form-label">Ngày kết thúc</label>
            <input type="date" name="end_time" class="form-control @error('end_time') is-invalid @enderror" value="{{ old('end_time') }}" id="endDate">
            @error('end_time')
                <small class="text-danger fw-bold fst-italic">* {{ $message }}</small>
            @enderror
        </div>

        <div class="mb-3">
            <label for="voucherStatus" class="form-label">Trạng thái</label>
            <select name="status_id" class="form-select @error('status_id') is-invalid @enderror" id="voucherStatus">
                <option value="">Chọn trạng thái</option>
                @foreach ($statuses as $status)
                    <option value="{{ $status->id }}" @if($status->id == old('status_id')) selected @endif>{{ $status->name }}</option>
                @endforeach
            </select>
            @error('status_id')
                <small class="text-danger fw-bold fst-italic">* {{ $message }}</small>
            @enderror
        </div>

        @if ($errors->any())
            <div class="alert alert-danger">
                <ul class="mb-0">
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        {{-- <div class="mb-3">
            <label for="issuedCount" class="form-label">Số lượng voucher phát hành</label>
            <input type="number" class="form-control" id="issuedCount" placeholder="Nhập số lượng voucher phát hành">
        </div> --}}

        <button type="submit" class="btn btn-primary">Tạo Voucher</button>
    </form>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
