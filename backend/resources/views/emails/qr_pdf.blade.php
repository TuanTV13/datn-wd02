<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ticket PDF - {{ $ticket->ticket_code }}</title>
</head>
<body style="font-family: 'DejaVu Sans', sans-serif; line-height: 1.6; margin: 0; padding: 0; color: #333; background-color: #f8f8f8;">
    <div style="max-width: 600px; margin: 30px auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- Tiêu đề -->
        <h1 style="text-align: center; color: #007BFF; margin-bottom: 20px; font-size: 28px;">Thông tin vé</h1>

        <!-- Thông tin vé -->
        <p style="font-size: 16px; margin: 10px 0; color: #555;">
            <strong>Mã vé:</strong> {{ $ticket->ticket_code }}
        </p>
        <p style="font-size: 16px; margin: 10px 0; color: #555;">
            <strong>Loại vé:</strong> {{ $ticket->ticket_type }}
        </p>
        <p style="font-size: 16px; margin: 10px 0; color: #555;">
            <strong>Vùng ghế:</strong> {{ $ticket->seat_zone }}
        </p>
        <p style="font-size: 16px; margin: 10px 0; color: #555;">
            <strong>Giá:</strong> {{ number_format($ticket->original_price, 0, ',', '.') }} VNĐ
        </p>
        <p style="font-size: 16px; margin: 10px 0; color: #555;">
            <strong>Sự kiện:</strong> {{ $ticket->event->name }}
        </p>

        <!-- QR Code -->
        <div style="text-align: center; margin-top: 30px;">
            <p style="font-size: 18px; font-weight: bold; color: #444;">Quét mã QR để xác nhận vé:</p>
            <img src="data:image/png;base64, {!! base64_encode(QrCode::size(400)->generate($ticket->ticket_code)) !!}" 
                 style="display: block; margin: 0 auto; width: 250px; height: 250px; border: 5px solid #007BFF; border-radius: 8px;">
        </div>
    </div>
</body>
</html>