<?php

namespace App\Repositories\Admin;

use App\Models\Category;
use App\Models\District;
use App\Models\Event;
use App\Models\EventImage;
use App\Models\Province;
use App\Models\Speaker;
use App\Models\Status;
use App\Models\Ticket;
use App\Models\TicketType;
use App\Models\Ward;

class EventRepository 
{
    public function getAll() 
    {
        return Event::with(['category', 'status', 'district', 'ward', 'images', 'tickets', 'speakers'])->get();
    }

    public function getAllCategories()
    {
        return Category::all();
    }
    
    public function getAllStatus()
    {
        return Status::all();
    }

    public function getAllProvinces() 
    {
        return Province::all();
    }

    public function getAllDistricts()
    {
        return District::all();
    }

    public function getAllWards()
    {
        return Ward::all();
    }

    public function getDistrictByProvince($provinceId)
    {
        return District::where('province_id', $provinceId)->get();
    }

    public function getWardByDistrict($districtId)
    {
        return Ward::where('district_id', $districtId)->get();
    }

    public function getAllTicketTypes()
    {
        return TicketType::all();
    }

    public function createEvent ($eventData) {
        return Event::create($eventData);
    }

    public function createSpeaker($dataSpeaker) {
        return Speaker::create($dataSpeaker);
    }

    public function createTicket($dataTicket) {
        return Ticket::create($dataTicket);
    }

    public function saveEventImage($eventImage) {
        return EventImage::create($eventImage);
    }
}