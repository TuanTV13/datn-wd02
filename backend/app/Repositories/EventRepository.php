<?php

namespace App\Repositories;

use App\Models\Event;
use App\Models\Ticket;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

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
        return $this->event->with(['users' => function ($query) {
            $query->distinct();
        }])->withCount('users as ticket_count')->get();
    }

    public function getByConfirmed()
    {
        return $this->event->where(function ($query) {
            $query->where('status', 'confirmed')
                ->orWhere('status', 'checkin');
        })->get();
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
            ->select('id', 'name', 'description', 'thumbnail', 'start_time')
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

    public function query()
    {
        return $this->event->newQuery();
    }

    public function getTopRevenueEvents($limit, $startDate, $endDate)
    {
        $startDate = Carbon::parse($startDate)->startOfDay();
        $endDate = Carbon::parse($endDate)->endOfDay();

        $ticket = new Ticket();
        $totalRevenue = $ticket
            ->whereBetween('created_at', [$startDate, $endDate])
            ->sum('price');

        $topEvents = $this->event
            ->select('events.id', 'events.name', DB::raw('SUM(tickets.price) as total_revenue'))
            ->join('tickets', 'events.id', '=', 'tickets.event_id')
            ->whereBetween('tickets.created_at', [$startDate, $endDate])
            ->groupBy('events.id', 'events.name')
            ->orderByDesc('total_revenue')
            ->limit($limit)
            ->get();

        if ($topEvents->isEmpty()) {
            return $topEvents;
        }

        $totalTopRevenue = $topEvents->sum('total_revenue');

        foreach ($topEvents as $event) {
            $event->percentage = ($totalTopRevenue > 0) ? ($event->total_revenue / $totalTopRevenue) * 100 : 0;
        }

        return [
            'total_revenue' => $totalRevenue,
            'top_events' => $topEvents
        ];
    }

    public function getEventCount($startDate, $endDate)
    {
        $startDate = Carbon::parse($startDate)->startOfDay();
        $endDate = Carbon::parse($endDate)->endOfDay();

        $eventCount = $this->event
            ->where('status', 'completed')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();

        return $eventCount;
    }
}
