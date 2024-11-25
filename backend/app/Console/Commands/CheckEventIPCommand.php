<?php

namespace App\Console\Commands;

use App\Http\Services\CheckEventIPService;
use App\Jobs\CheckEventIPJob;
use Illuminate\Console\Command;

class CheckEventIPCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:check-event-i-p-command';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Kiểm tra các sự kiện chưa có địa chỉ IP cục bộ cho check-in';

    protected $checkEventIPService;

    public function __construct(CheckEventIPService $checkEventIPService)
    {
        parent::__construct();
        $this->checkEventIPService = $checkEventIPService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        CheckEventIPJob::dispatch($this->checkEventIPService);
        
        $this->info('Đã gửi job kiểm tra địa chỉ IP cho các sự kiện.');
    }
    
}
