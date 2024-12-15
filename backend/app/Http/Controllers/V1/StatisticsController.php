<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Repositories\EventRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class StatisticsController extends Controller
{
    protected $eventRepository;

    public function __construct(EventRepository $eventRepository)
    {
        $this->eventRepository = $eventRepository;
    }

    public function topRevenueEvents(Request $request)
    {
        $limit = $request->input('limit', 5);
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');



        if (!$startDate || !$endDate) {
            return response()->json([
                'status' => 'error',
                'message' => 'Vui lòng cung cấp ngày bắt đầu (start_date) và ngày kết thúc (end_date).'
            ], 400);
        }

        try {
            $topEvents = $this->eventRepository->getTopRevenueEvents($limit, $startDate, $endDate);

            return response()->json([
                'status' => 'success',
                'data' => $topEvents
            ]);
        } catch (InvalidArgumentException $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function getEventStatisticsByTime(Request $request)
    {
        $timeFrame = $request->input('time_frame', 'month');
        $year = $request->input('year');
        $month = $request->input('month');
        $quarter = $request->input('quarter');

        $query = DB::table('events')
            ->join('transactions', 'events.id', '=', 'transactions.event_id')
            ->where('events.status', '!=', 'pending');

        if ($year) {
            $query->whereYear('transactions.created_at', $year);
        }

        if ($timeFrame === 'month' && $month) {
            $query->whereMonth('transactions.created_at', $month);
        }

        if ($timeFrame === 'quarter' && $quarter) {
            $query->whereRaw('QUARTER(transactions.created_at) = ?', [$quarter]);
        }

        switch ($timeFrame) {
            case 'year':
                $query->select(
                    DB::raw('YEAR(transactions.created_at) as year'),
                    DB::raw('COUNT(events.id) as event_count'),
                    DB::raw('SUM(transactions.total_amount) as total_amount')
                )
                ->groupBy(DB::raw('YEAR(transactions.created_at)'));
                break;

            case 'quarter':
                $query->select(
                    DB::raw('YEAR(transactions.created_at) as year'),
                    DB::raw('QUARTER(transactions.created_at) as quarter'),
                    DB::raw('COUNT(events.id) as event_count'),
                    DB::raw('SUM(transactions.total_amount) as total_amount')
                )
                ->groupBy(DB::raw('YEAR(transactions.created_at)'), DB::raw('QUARTER(transactions.created_at)'));
                break;

            case 'month':
            default:
                $query->select(
                    DB::raw('YEAR(transactions.created_at) as year'),
                    DB::raw('MONTH(transactions.created_at) as month'),
                    DB::raw('COUNT(events.id) as event_count'),
                    DB::raw('SUM(transactions.total_amount) as total_amount')
                )
                ->groupBy(DB::raw('YEAR(transactions.created_at)'), DB::raw('MONTH(transactions.created_at)'));
                break;
        }

        $statistics = $query->get();

        return response()->json([
            'data' => $statistics,
            'time_frame' => $timeFrame,
            'filters' => [
                'year' => $year,
                'month' => $month,
                'quarter' => $quarter,
            ],
        ]);
    }

    public function getEventCountTotalAmountAndPercentageByEventType()
    {

        $totalRevenue = DB::table('events')
            ->join('transactions', 'events.id', '=', 'transactions.event_id')
            ->where('events.status', '!=', 'pending')
            ->sum('transactions.total_amount');

        return DB::table('events')
            ->join('transactions', 'events.id', '=', 'transactions.event_id')
            ->select('events.event_type',
                     DB::raw('COUNT(events.id) as event_count'),
                     DB::raw('SUM(transactions.total_amount) as total_amount'))
            ->where('events.status', '!=', 'pending')
            ->groupBy('events.event_type')
            ->get()
            ->map(function ($item) use ($totalRevenue) {

                $item->percentage_revenue = ($totalRevenue > 0) ? ($item->total_amount / $totalRevenue) * 100 : 0;
                return $item;
            });
    }

    public function topParticipantsEvents(Request $request)
    {
        $limit = $request->input('limit', 5);
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $timePeriod = $request->input('time_period');

        if (!$startDate || !$endDate) {
            if ($timePeriod) {
                $dates = $this->getDatesForTimePeriod($timePeriod);
                $startDate = $dates['start'];
                $endDate = $dates['end'];
            } else {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Vui lòng cung cấp ngày bắt đầu (start_date) và ngày kết thúc (end_date) hoặc chọn khoảng thời gian (time_period).'
                ], 400);
            }
        }


        try {

            $topEvents = DB::table('events')
                ->join('transactions', 'events.id', '=', 'transactions.event_id')
                ->select(
                    'events.name',
                    DB::raw('COUNT(transactions.id) as total_participants'),
                    DB::raw('SUM(transactions.total_amount) as total_amount'),
                    'events.status'
                )
                ->whereBetween('events.start_time', [$startDate, $endDate])
                ->where('events.status', 'hoàn thành')
                ->groupBy('events.id', 'events.name', 'events.status')
                ->orderByDesc('total_participants')
                ->limit($limit)
                ->get();


            return response()->json([
                'status' => 'success',
                'data' => $topEvents
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }


        public function getEventStatusStatistics(Request $request)
    {

        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $timePeriod = $request->input('time_period');

        if (!$startDate || !$endDate) {
            if ($timePeriod) {
                $dates = $this->getDatesForTimePeriod($timePeriod);
                $startDate = $dates['start'];
                $endDate = $dates['end'];
            } else {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Vui lòng cung cấp ngày bắt đầu (start_date) và ngày kết thúc (end_date) hoặc chọn khoảng thời gian (time_period).'
                ], 400);
            }
        }

        try {

            $statistics = DB::table('transactions')
                ->select('status', DB::raw('COUNT(id) as total_events'), DB::raw('SUM(total_amount) as total_revenue'))
                ->whereBetween('created_at', [$startDate, $endDate])
                ->groupBy('status')
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => $statistics
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    private function getConfirmedEventCount($startDate, $endDate)
    {
        return DB::table('events')
            ->where('status', 'confirmed')
            ->whereBetween('event_date', [$startDate, $endDate])
            ->count();
    }

    private function getCanceledEventCount($startDate, $endDate)
    {
        return DB::table('events')
            ->where('status', 'canceled')
            ->whereBetween('event_date', [$startDate, $endDate])
            ->count();
    }




      public function getEventRevenueAndParticipants(Request $request)
{

    $startDate = $request->input('start_date');
    $endDate = $request->input('end_date');
    $timePeriod = $request->input('time_period');

    if (!$startDate || !$endDate) {
        if ($timePeriod) {
            $dates = $this->getDatesForTimePeriod($timePeriod);
            $startDate = $dates['start'];
            $endDate = $dates['end'];
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Vui lòng cung cấp start_date và end_date, hoặc chọn time_period.'
            ], 400);
        }
    }

    try {

        $data = DB::table('transactions')
            ->leftJoin('event_users', function ($join) {
                $join->on('transactions.event_id', '=', 'event_users.event_id')
                     ->where('event_users.checked_in', true);
            })
            ->select(
                'transactions.event_id',
                DB::raw('SUM(transactions.total_amount) as revenue'),
                DB::raw('COUNT(DISTINCT transactions.user_id) as total_participants'),
                DB::raw('COUNT(DISTINCT CASE WHEN event_users.checked_in THEN event_users.user_id END) as checked_in_participants')
            )
            ->whereBetween('transactions.created_at', [$startDate, $endDate])
            ->where('transactions.status', 'completed')
            ->groupBy('transactions.event_id')
            ->get();

        $totalRevenue = $data->sum('revenue');
        $totalParticipants = $data->sum('total_participants');

        $result = $data->map(function ($event) use ($totalRevenue) {
            $event->revenue_percentage = $totalRevenue > 0
                ? ($event->revenue / $totalRevenue) * 100
                : 0;
            return $event;
        });

        return response()->json([
            'status' => 'success',
            'total_revenue' => $totalRevenue,
            'total_participants' => $totalParticipants,
            'data' => $result
        ]);
    } catch (\Exception $e) {

        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage(),
        ], 500);
    }
}

public function getEventCountTotalAmountAndPercentageByProvince()
{

    $totalRevenue = DB::table('events')
        ->join('transactions', 'events.id', '=', 'transactions.event_id')
        ->where('events.status', '!=', 'pending')
        ->sum('transactions.total_amount');

    return DB::table('events')
        ->join('transactions', 'events.id', '=', 'transactions.event_id')
        ->select('events.province',
                 DB::raw('COUNT(events.id) as event_count'),
                 DB::raw('SUM(transactions.total_amount) as total_amount'))
        ->where('events.status', '!=', 'pending')
        ->groupBy('events.province')
        ->get()
        ->map(function ($item) use ($totalRevenue) {
            $item->percentage_revenue = ($totalRevenue > 0) ? ($item->total_amount / $totalRevenue) * 100 : 0;
            return $item;
        });
}


        private function getDatesForTimePeriod($timePeriod)
        {
            $startDate = null;
            $endDate = null;

            switch ($timePeriod) {
                case 'day':
                    $startDate = now()->startOfDay();
                    $endDate = now()->endOfDay();
                    break;
                case 'month':
                    $startDate = now()->startOfMonth();
                    $endDate = now()->endOfMonth();
                    break;
                case 'quarter':
                    $startDate = now()->startOfQuarter();
                    $endDate = now()->endOfQuarter();
                    break;
                case 'year':
                    $startDate = now()->startOfYear();
                    $endDate = now()->endOfYear();
                    break;
                default:
                    break;
            }

            return ['start' => $startDate, 'end' => $endDate];

        }
    }




