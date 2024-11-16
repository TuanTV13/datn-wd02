<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class RunQueue extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'queue:run';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Run queue the worker';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting queue worker...');
        exec('php artisan queue:work --daemon --timeout=60 --tries=3');
    }
}
