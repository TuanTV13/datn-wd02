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

    public function getAll()
    {
        return $this->event->with(['users', 'speakers', 'category', 'province', 'district', 'ward'])->get();
    }

    public function find($id)
    {
        return $this->event->with(['users', 'speakers', 'category', 'province', 'district', 'ward'])->find($id);
    }

    public function findByCategory($categoryId)
    {
        return $this->event->with(['speakers', 'category', 'province', 'district', 'ward'])->where('category_id', $categoryId)->get();
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

    public function checkConflict($startTime, $endTime, $wardId, $excludeId = null)
    {
        $query = Event::where('ward_id', $wardId)
            ->where(function ($q) use ($startTime, $endTime) {
                $q->whereBetween('start_time', [$startTime, $endTime])
                    ->orWhereBetween('end_time', [$startTime, $endTime])
                    ->orWhere(function ($q2) use ($startTime, $endTime) {
                        $q2->where('start_time', '<=', $startTime)
                            ->where('end_time', '>=', $endTime);
                    });
            });

        if ($excludeId) {
            $query->where('id', '<>', $excludeId);
        }

        return $query->first();
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
            ->select('id', 'name', 'description', 'thumbnail', 'start_time')
            ->orderBy('start_time', 'asc')
            ->limit(4)
            ->get();
    }
    
    public function getUpcomingEvents()
    {
        return $this->event
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
}
