<?php

namespace App\Console\Commands;

use App\Events\EventCompleted;
use App\Events\EventUpcoming;
use App\Models\Event;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class CheckEventStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'check:event-status';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Kiểm tra và cập nhật trạng thái của sự kiện, gửi email khi sự kiện kết thúc.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $now = Carbon::now();
        $addHourLater = $now->copy()->addHour();

        $events = Event::whereIn('status', ['confirmed', 'checkin', 'ongoing'])
            ->whereBetween('start_time', [$now, $addHourLater])
            ->get();

        foreach ($events as $event) {
            $startTime = Carbon::parse($event->start_time);
            
            if ($startTime->greaterThan($now) && $now->lessThanOrEqualTo($addHourLater) && $event->status === 'confirmed') {
                $event->update(['status' => 'checkin']);
                $users = $event->users()->select('users.id', 'users.name', 'users.email')->distinct()->get();
                
                event(new EventUpcoming($users, $event));
                $this->info("Đã cập nhật trạng thái của sự kiện {$event->id} thành checkin.");
            }
            
            if ($startTime->isSameMinute($now) && $event->status === 'checkin') {
                $event->update(['status' => 'ongoing']);
                $this->info("Đã cập nhật trạng thái của sự kiện {$event->id} thành ongoing.");
            }
        }

        $endedEvents = Event::where('status', 'ongoing')
            ->where('end_time', '<=', $now)
            ->get();

        foreach ($endedEvents as $event) {
            $event->update(['status' => 'completed']);
            
            $users = $event->users()->wherePivot('checked_in', 1)->get()->unique('id');
            event(new EventCompleted($users, $event));
            
            $this->info("Đã cập nhật trạng thái sự kiện {$event->id} thành completed và gửi email cảm ơn.");
        }

        $this->info('Đã hoàn thành kiểm tra và cập nhật trạng thái sự kiện.');
    }
}
