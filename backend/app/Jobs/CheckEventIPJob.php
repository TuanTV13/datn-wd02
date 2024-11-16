<?php

namespace App\Jobs;

use App\Http\Services\CheckEventIPService;
use App\Models\Event;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class CheckEventIPJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $checkEventIPService;
    /**
     * Create a new job instance.
     */
    public function __construct(CheckEventIPService $checkEventIPService)
    {
        $this->checkEventIPService = $checkEventIPService;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $result = $this->checkEventIPService->checkEventsWithoutIP();

        // Có thể thực hiện các hành động khác dựa trên kết quả trả về
        Log::info($result['message'], $result['events'] ?? []);
    }
}
