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
        return $this->event
            ->with(['tickets'])
            ->find($id);
    }


    public function findDetail($id)
    {
        $event = $this->event->with(['tickets', 'users'])->find($id);

        $totalTickets = $event->users->count();

        $vipTickets = $event->users->where('pivot.ticket_type', 'VIP')->count();

        $normalTickets = $event->users->where('pivot.ticket_type', 'Thường')->count();

        $vipPercentage = $totalTickets > 0 ? ($vipTickets / $totalTickets) * 100 : 0;
        $normalPercentage = $totalTickets > 0 ? ($normalTickets / $totalTickets) * 100 : 0;

        return [
            'event' => $event,
            'totalTickets' => $totalTickets,
            'vipTickets' => $vipTickets,
            'normalTickets' => $normalTickets,
            'vipPercentage' => $vipPercentage,
            'normalPercentage' => $normalPercentage
        ];
    }

    public function findByCategory($categoryId)
    {
        return $this->event
            ->with('category')
            ->where('category_id', $categoryId)->get();
    }

    public function findTrashed($id)
    {
        return $this->event->onlyTrashed()->find($id);
    }

    public function trashed()
    {
        return $this->event->onlyTrashed()->get();
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
            ->whereNotIn('status', ['pending', 'cancaled'])
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

    /**
     * Thống kê sự kiện theo thể loại (chỉ lấy sự kiện có trạng thái confirmed)
     */
    public function getStatisticsByEventType($startDate, $endDate)
    {
        try {
            // Truy vấn lấy thống kê theo event_type (thể loại sự kiện)
            $statistics = DB::table('events')
                ->select(
                    'event_type',
                    DB::raw('COUNT(*) as total'), // Số lượng sự kiện theo thể loại
                    DB::raw('GROUP_CONCAT(name) as event_names'), // Danh sách tên sự kiện
                    DB::raw('GROUP_CONCAT(status) as statuses'), // Danh sách trạng thái của các sự kiện
                    DB::raw('SUM(registed_attendees) as total_attendees') // Tổng số người tham gia
                )
                ->where('status', 'confirmed') // Lọc theo trạng thái 'confirmed'
                ->whereBetween('start_time', [$startDate, $endDate]) // Lọc theo khoảng thời gian
                ->whereNull('deleted_at') // Lọc các sự kiện không bị xóa
                ->groupBy('event_type') // Nhóm theo event_type
                ->get();

            return $statistics;
        } catch (\Exception $e) {
            throw new \Exception("Lỗi khi lấy thống kê theo event_type: " . $e->getMessage());
        }
    }

    public function getStatisticsByProvinceAndStatus($status, $startDate, $endDate)
    {
        try {
            // Truy vấn lấy thống kê theo tỉnh/thành phố và trạng thái 'confirmed'
            $statistics = DB::table('events')
                ->select(
                    'province',
                    DB::raw('COUNT(*) as total'), // Số lượng sự kiện theo tỉnh
                    DB::raw('GROUP_CONCAT(name) as event_names'), // Danh sách tên sự kiện
                    DB::raw('GROUP_CONCAT(status) as statuses'), // Danh sách trạng thái các sự kiện
                    DB::raw('SUM(registed_attendees) as total_attendees') // Tổng số người tham gia
                )
                ->where('status', $status) // Lọc theo trạng thái 'confirmed'
                ->whereBetween('start_time', [$startDate, $endDate]) // Lọc theo khoảng thời gian
                ->whereNull('deleted_at') // Lọc các sự kiện không bị xóa
                ->groupBy('province') // Nhóm theo tỉnh/thành phố
                ->get();

            return $statistics;
        } catch (\Exception $e) {
            throw new \Exception("Lỗi khi lấy thống kê theo tỉnh/thành phố: " . $e->getMessage());
        }
    }

    // Add this method to the EventRepository
    public function getTopParticipantsEvents($limit, $startDate, $endDate)
    {
        return $this->event
            ->withCount(['participants' => function ($query) use ($startDate, $endDate) {
                $query->whereBetween('created_at', [$startDate, $endDate]); // Điều kiện cho người tham gia trong khoảng thời gian
            }])
            ->whereBetween('event_date', [$startDate, $endDate]) // Điều kiện cho sự kiện trong khoảng thời gian
            ->orderByDesc('participants_count') // Sắp xếp theo số lượng người tham gia
            ->limit($limit)
            ->get();
    }

    public function getEventStatusStatistics($startDate, $endDate)
    {
        try {
            // Đếm số sự kiện theo trạng thái "confirmed"
            $confirmedCount = DB::table('events')
                ->where('status', 'confirmed')
                ->whereBetween('start_time', [$startDate, $endDate])
                ->whereNull('deleted_at')
                ->count();

            // Đếm số sự kiện theo trạng thái "canceled"
            $canceledCount = DB::table('events')
                ->where('status', 'canceled')
                ->whereBetween('start_time', [$startDate, $endDate])
                ->whereNull('deleted_at')
                ->count();

            return [
                'confirmed_events' => $confirmedCount,
                'canceled_events' => $canceledCount,
            ];
        } catch (\Exception $e) {
            throw new \Exception("Lỗi khi lấy thống kê sự kiện: " . $e->getMessage());
        }
    }

    public function getTotalRevenue($startDate, $endDate)
    {
        return DB::table('transactions')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->sum('total_amount');
    }

    public function getCompletedEventIds($startDate, $endDate)
    {
        return DB::table('events')
            ->whereBetween('start_time', [$startDate, $endDate])
            ->where('status', 'completed') // Only completed events
            ->pluck('id'); // Get the event IDs
    }

    public function getTotalRevenueByEventIds($eventIds)
    {
        return DB::table('transactions')
            ->whereIn('event_id', $eventIds)  // Chỉ tính doanh thu cho các sự kiện đã hoàn thành
            ->sum('total_amount'); // Tổng doanh thu từ các giao dịch
    }

    // Trong EventRepository.php
    public function getCompletedEventCountByDateRange($startDate, $endDate)
    {
        return Event::whereBetween('start_time', [$startDate, $endDate])  // Lọc sự kiện trong khoảng thời gian
            ->where('status', 'completed')  // Chỉ lấy sự kiện có trạng thái 'completed'
            ->whereNull('deleted_at')  // Đảm bảo không lấy sự kiện đã bị xóa (nếu có)
            ->count();  // Đếm số lượng sự kiện
    }
}
