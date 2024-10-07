<?php

namespace App\Services\Admin;

use App\Http\Requests\Admin\StoreEventRequest;
use App\Models\EventImage;
use App\Models\Speaker;
use App\Models\Ticket;
use App\Repositories\Admin\EventRepository;
use Exception;
use Illuminate\Support\Facades\Log;

class EventService
{
    protected $eventSepository;

    public function __construct(EventRepository $eventRepository)
    {
        $this->eventSepository = $eventRepository;
    }

    public function getAll()
    {
        $events = $this->eventSepository->getAll();

        return ['data' => $events];
    }

    public function find($id)
    {
        $event = $this->eventSepository->find($id);

        if (!$event) {
            return ['status' => false, 'message' => 'Không timd thấy sự kiện nào'];
        }

        return ['status' => true, 'data' => $event];
    }

    public function create(StoreEventRequest $storeEventRequest)
    {
// dd($storeEventRequest);
        $event = $storeEventRequest->validated()['event'];

        $event['status_id'] = 24;

        if ($storeEventRequest->has('speakers')) {
            $speakers = $storeEventRequest->validated()['speakers'];
        }

        try {

            $event = $this->eventSepository->create($event);

            foreach ($speakers as $speaker) {
                $speaker['event_id'] = $event->id;
                Speaker::create($speaker);
            }

            // if ($storeEventRequest->has('event_images')) {
            //     $images = $storeEventRequest->validated()['event_images'];

            //     foreach ($images as $image) {
            //         $image['event_id'] = $event->id;
            //         EventImage::create($image);
            //     }
            // }

            // if ($storeEventRequest->has('tickets')) {
            //     $images = $storeEventRequest->validated()['tickets'];

            //     foreach ($images as $image) {
            //         $image['event_id'] = $event->id;
            //         Ticket::create($image);
            //     }
            // }

            return ['status' => true, 'data' => $event];
        } catch (Exception $e) {
            Log::error('Lỗi tạo sự kiện: ' . $e->getMessage());

            return ['status' => false, 'message' => 'Đã xảy ra lỗi khi tạo sự kiện. Vui lòng thử lại sau.'];
        }
    }
}
