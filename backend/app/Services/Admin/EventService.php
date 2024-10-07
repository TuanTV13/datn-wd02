<?php

namespace App\Services\Admin;

use App\Models\Event;
use App\Repositories\Admin\EventRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class EventService
{
    protected $eventRepository;

    public function __construct(EventRepository $eventRepository)
    {
        $this->eventRepository = $eventRepository;
    }

    public function getAll()
    {
        return $this->eventRepository->getAll();
    }

    public function getAllCategories()
    {
        return $this->eventRepository->getAllCategories();
    }

    public function getAllStatus()
    {
        return $this->eventRepository->getAllStatus();
    }

    public function getAllProvinces()
    {
        return $this->eventRepository->getAllProvinces();
    }

    public function getAllDistricts()
    {
        return $this->eventRepository->getAllDistricts();
    }

    public function getAllWards()
    {
        return $this->eventRepository->getAllWards();
    }

    public function getDistrictByProvince($provinceId)
    {
        return $this->eventRepository->getDistrictByProvince($provinceId);
    }

    public function getWardByDistrict($districtId)
    {
        return $this->eventRepository->getWardByDistrict($districtId);
    }

    public function getAllTicketTypes()
    {
        return $this->eventRepository->getAllTicketTypes();
    }

    public function create($eventData, $speakers, $tickets, $eventImages)
    {
        try {
            DB::beginTransaction();

            $event = Event::create($eventData);

            // Mảng chứa đường dẫn của các ảnh đã lưu để rollback nếu có lỗi
            $savedImagePaths = [];

            // Xử lý diễn giả (speakers)
            if (!empty($speakers)) {
                foreach ($speakers as $speaker) {
                    if (isset($speaker['image_url']) && $speaker['image_url'] instanceof UploadedFile && $speaker['image_url']->isValid()) {
                        $imagePath = Storage::put('speakers', $speaker['image_url']);
                        $savedImagePaths[] = $imagePath;
                        $speaker['image_url'] = $imagePath;
                    }
                    
                    $dataSpeaker = [
                        'event_id' => $event->id,
                        'name' => $speaker['name'],
                        'email' => $speaker['email'],
                        'phone' => $speaker['phone'],
                        'profile' => $speaker['profile'],
                        'image_url' => $speaker['image_url'],
                    ];
                    $this->eventRepository->createSpeaker($dataSpeaker);
                }
            }

            // Xử lý vé sự kiện (tickets)
            if (!empty($tickets)) {
                foreach ($tickets as $ticket) {
                    $dataTicket = [
                        'event_id' => $event->id,
                        'ticket_type_id' => $ticket['ticket_type_id'],
                        'status_id' => $ticket['status_id'],
                        'price' => $ticket['price'],
                        'quantity' => $ticket['quantity'],
                        'available_quantity' => $ticket['available_quantity'],
                        'seat_location' => $ticket['seat_location'],
                        'sale_start' => $ticket['sale_start'],
                        'sale_end' => $ticket['sale_end'],
                        'description' => $ticket['description'],
                    ];
                    $this->eventRepository->createTicket($dataTicket);
                }
            }

            // Xử lý ảnh sự kiện (event_images)
            if (!empty($eventImages)) {
                foreach ($eventImages as $eventImage) {
                    if ($eventImage instanceof UploadedFile && $eventImage->isValid()) {
                        $imagePath = Storage::put('events', $eventImage);
                        $savedImagePaths[] = $imagePath; 

                        $this->eventRepository->saveEventImage([
                            'event_id' => $event->id,
                            'image_url' => $imagePath,
                        ]);
                    }
                }
            }

            DB::commit();

            return $event;
        } catch (\Exception $e) {
            DB::rollBack();

            // Nếu có ảnh nào đã lưu trước đó thì xóa 
            if (!empty($savedImagePaths)) {
                foreach ($savedImagePaths as $path) {
                    Storage::delete($path);
                }
            }

            throw $e;
        }
    }
}