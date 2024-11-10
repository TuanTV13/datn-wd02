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
        $ticketDetails = $transaction->ticket;

        $ticketCode = $transaction->ticket_code;
        $size = '200x200'; // Kích thước của mã QR
        $color = '000000'; // Màu sắc (đen)

        $qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?data=" . urlencode($ticketCode) . "&size=$size&color=$color";

        $data = [
            'user' => $transaction->user,
            'transaction' => $transaction,
            'event' => $eventDetails,
            'ticket' => $ticketDetails,
            'qrCodeUrl' => $qrCodeUrl,
        ];

        // Gửi email
        Mail::send('emails.transaction-confirmed', $data, function ($message) use ($transaction) {
            $message->from('no-reply@eventify.com', 'Eventify');
            $message->to($transaction->user->email, $transaction->user->name);
            $message->subject('Xác nhận giao dịch của bạn');
        });
    }
}
