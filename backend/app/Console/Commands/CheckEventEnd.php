<?php

namespace App\Console\Commands;

use App\Events\EventCompleted;
use App\Models\Event;
use Carbon\Carbon;
use Illuminate\Console\Command;

class CheckEventEnd extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'check:event-end';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Kiểm tra sự kiện đã kết thúc, cập nhật trạng thái và gửi email cảm ơn cho người tham gia.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $events = Event::where('status', 'ongoing')->where('end_time', Carbon::now())->get();

        foreach ($events as $event) {
            $event->status = 'completed';
            $event->save();

            $users = $event->users()->wherePivot('checked_in', 1)->get()->unique('id');
            event(new EventCompleted($users, $event));
        }

        $this->info('Đã cập nhật trạng thái và gửi email cảm ơn cho người tham gia.');
    }
}
