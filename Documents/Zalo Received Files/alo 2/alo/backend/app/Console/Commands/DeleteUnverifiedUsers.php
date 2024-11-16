<?php

namespace App\Console\Commands;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;

class DeleteUnverifiedUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:delete-unverified';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete unverified users after a certain period';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $expirationTime = config('auth.passwords.users.expire'); // Thời gian hết hạn (phút)
        $expirationDate = Carbon::now()->subMinutes($expirationTime);

        User::whereNull('email_verified_at')
            ->where('created_at', '<', $expirationDate)
            ->delete();

        $this->info('Unverified users deleted successfully.');
    }
}
