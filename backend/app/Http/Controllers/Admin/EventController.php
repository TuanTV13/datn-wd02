<?php

namespace App\Http\Controllers\Admin;

use App\Events\EventUpdate;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreEventRequest;
use App\Http\Requests\Admin\UpdateEventRequest;
use App\Models\Event;
use App\Models\SeatLocation;
use App\Models\Voucher;
use App\Services\Admin\EventService;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class EventController extends Controller
{

    protected $eventService;

    public function __construct(EventService $eventService)
    {
        $this->eventService = $eventService;
    }
    // Danh sách sự kiện
    public function index() {}

    // Thêm mới
    public function store(StoreEventRequest $storeEventRequest) {

        $event = $this->eventService->create($storeEventRequest);

        if(!$event['status']){
            return response()->json([
                'message' => $event['message']
            ], 400);
        }

        return response()->json([
            'data' => $event['data']
        ], 201);

    }

    // Chi tiết
    public function show($id) {}

    // Cập nhật
    public function update(UpdateEventRequest $updateEventRequest, $id) {}
}
