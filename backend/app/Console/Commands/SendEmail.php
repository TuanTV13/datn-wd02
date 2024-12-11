<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\V1\EventController;  // Import EventController
use App\Models\Event;
use App\Repositories\EventRepository;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon; // Import Carbon để xử lý thời gian

class SendEmail extends Command
{
    // Tên và mô tả của command
    protected $signature = 'send:email';
    protected $description = 'Gửi email tự động qua EmailJS';

    // Cấu hình EmailJS
    private $user_id = 'HcRPgJ1iOPe4OPPG1'; // Lấy từ EmailJS
    private $service_id = 'service_oc42a4h'; // Lấy từ EmailJS
    private $template_id = 'template_d3v1t5m'; // Lấy từ EmailJS

    // Hàm thực thi lệnh
    public function handle()
    {
        // Tạo đối tượng EventRepository
        $eventRepository = new EventRepository(new Event());

        // Lấy danh sách sự kiện
        $events = $eventRepository->getAll();

        // Lấy thời gian hiện tại cộng thêm 2 giờ
        $now = Carbon::now();
        $two_hours_later = $now->copy()->addHours(2);

        // Duyệt qua các sự kiện và kiểm tra thời gian
        foreach ($events as $event) {
            // Kiểm tra xem thời gian bắt đầu sự kiện có sau 2 giờ không

            $event_start_time = Carbon::parse($event->start_time);
            $this->info($now);
            $this->info($two_hours_later);
            $this->info($event_start_time);
            if ($event_start_time->between($now, $two_hours_later)) {
                foreach ($event->users as $user) {
                    // Nếu thời gian bắt đầu sự kiện lớn hơn 2 giờ, gửi email
                    $email_data = [
                        'to_name' => $user->name, // Tên người nhận (có thể lấy từ người tham gia sự kiện)
                        'to_email' => $user->email, // Email người nhận
                        'subject' => 'Thông báo về sự kiện',
                        'message' => "Chào bạn, sự kiện '{$event->name}' sắp diễn ra trong vòng 2 giờ nữa, hãy di chuyển đến địa điểm tổ chức sự kiện trước 15 phút để không phải bỏ lỡ tiết mục nào."
                    ];

                    // Cấu hình API EmailJS
                    $response = Http::withHeaders([
                        'Content-Type' => 'application/json',
                    ])->post('https://api.emailjs.com/api/v1.0/email/send', [
                        'service_id' => $this->service_id,
                        'template_id' => $this->template_id,
                        'user_id' => $this->user_id,
                        'template_params' => $email_data,
                    ]);

                    // Kiểm tra kết quả phản hồi từ API
                    if ($response->successful()) {
                        $this->info('Email đã được gửi thành công cho sự kiện: ' . $event->name);
                    } else {
                        $this->error('Có lỗi xảy ra khi gửi email cho sự kiện: ' . $event->name);
                    }
                }
            } else {
                $this->info('Sự kiện ' . $event->name . ' không thỏa mãn điều kiện gửi email (start_time <= 2 giờ).');
            }
        }
    }
}
