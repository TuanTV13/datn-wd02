<?php

namespace App\Listeners;

use App\Events\TransactionVerified;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;
use SimpleSoftwareIO\QrCode\Facades\QrCode;


class SendTransactionConfirmationEmail implements ShouldQueue
{
    public function __construct()
    {
        // 
    }

    public function handle(TransactionVerified $event): void
    {
        $transaction = $event->transaction;

        // Kiểm tra thông tin giao dịch
        if (!$transaction || !$transaction->user) {
            // Xử lý lỗi nếu không có giao dịch hoặc người dùng
            return;
        }

        $eventDetails = $transaction->event;
        $ticketDetails = $transaction->tickets;
        $totalAmount = 0;

        $size = '200x200'; // Kích thước của mã QR
        $color = '000000'; // Màu sắc (đen)

        $qrCodeUrl = [];
        $ticketsWithQRCode = [];
        foreach ($ticketDetails as $ticket) {
            $ticketCode = $ticket['ticket_code'];
            $totalAmount += $ticket['original_price'];
            $qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?data=" . urlencode($ticketCode) . "&size=$size&color=$color";

            $ticketsWithQRCode[] = [
                'ticket_type' => $ticket['ticket_type'],
                'ticket_code' => $ticketCode,
                'seat_zone' => $ticket['seat_zone'],
                'original_price' => $ticket['original_price'],
                'qr_code_url' => $qrCodeUrl,
            ];
        } 

        $data = [
            'user' => $transaction->user,
            'transaction' => $transaction,
            'event' => $eventDetails,
            'tickets' => $ticketsWithQRCode,
            'total_amount' => $totalAmount,
        ];

        // Gửi email
        Mail::send('emails.transaction-confirmed', $data, function ($message) use ($transaction) {
            $message->from('no-reply@eventify.com', 'Eventify');
            $message->to($transaction->user->email, $transaction->user->name);
            $message->subject('Xác nhận giao dịch của bạn - ' . $transaction->transaction_code);
        });
    }
}
