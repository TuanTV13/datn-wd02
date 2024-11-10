<?php

namespace App\Repositories;

use App\Models\Event;

class EventRepository
{

    protected $event;

    public function __construct(Event $event)
    {
        $this->event = $event;
    }

    public function getEventAttendees($eventId)
    {
        $event = $this->find($eventId);

        return $event->users()->withPivot('checked_in')->get();
    }

    public function getTicketsSold($eventId)
    {
        $event = $this->find($eventId);

        return $event->transactions()->where('status', 'completed')->count();
    }

    public function toltalAmount($eventId)
    {
        $event = $this->find($eventId);

        return $event->transactions()
            ->where('status', 'completed')
            ->sum('total_amount');
    }

    public function getAll()
    {
        return $this->event->get();
    }

    public function find($id)
    {
        return $this->event->with('tickets')->find($id);
    }

    public function findByCategory($categoryId)
    {
        return $this->event->where('category_id', $categoryId)->get();
    }

    public function findTrashed($id)
    {
        return $this->event->onlyTrashed()->find($id);
    }

    public function create(array $data)
    {
        return $this->event->create($data);
    }

    public function update($id, array $data)
    {
        $event = $this->find($id);
        $event->update();
        return $event;
    }

    public function delete($id)
    {
        $event = $this->find($id);
        return $event->delete();
    }

    public function countHeaderEvents()
    {
        return $this->event
            ->where('display_header', true)
            ->count();
    }

    public function getHeaderEvents()
    {
        return $this->event
            ->where('status', 'confirmed')
            ->where('display_header', true)
            ->select('id', 'category_id', 'name', 'description', 'thumbnail', 'start_time')
            ->orderBy('start_time', 'asc')
            ->limit(4)
            ->get();
    }

    public function getUpcomingEvents($province = null)
    {
        return $this->event
            ->when($province, function ($query) use ($province) {
                $query->whereRaw(
                    "LOWER(REPLACE(province, ' ', '-')) = ?", 
                    [strtolower($province)]
                );
            })
            ->where('status', 'confirmed')
            ->where('start_time', '>', now())
            ->where('start_time', '<=', now()->addDays(7))
            ->orderBy('start_time', 'asc')
            ->limit(12)
            ->get();
    }

    public function getFeaturedEvents()
    {
        return $this->event
            ->withCount('registrants')
            ->orderBy('registrants_count', 'desc')
            ->limit(10)
            ->get();
    }

    public function getTopRatedEvents()
    {
        return $this->event
            ->withSum('feedbacks', 'rating')
            ->having('feedbacks_sum_rating', '>', 0)
            ->orderByDesc('feedbacks_sum_rating')
            ->limit(12)
            ->get();
    }

    public function getIp($eventId)
    {
        $event = $this->event->find($eventId);
        if ($event) {
            return $event->subnets->pluck('subnet');
        }
    
        return null; 
    }
}
