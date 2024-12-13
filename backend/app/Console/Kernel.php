<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // $schedule->command('inspire')->hourly();
        $schedule->command('check:event-status')->everyMinute();
        // $schedule->command('users:delete-unverified')->everyMinute();
        // $schedule->command('queue:run')->everyMinute();
        // $schedule->command('send:email')->dailyAt('09:00');
        // $schedule->command('send:email')->everyMinute();

        $schedule->command('transactions:clear-pending')->everyMinute();
        $schedule->command('app:check-event-i-p-command')->everyMinute();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}
