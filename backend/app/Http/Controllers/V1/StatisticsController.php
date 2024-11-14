<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use App\Repositories\EventRepository;
use Illuminate\Http\Request;
use InvalidArgumentException;

class StatisticsController extends Controller
{
    protected $eventRepository;

    public function __construct(EventRepository $eventRepository)
    {
        $this->eventRepository = $eventRepository;
    }

    // Top sự kiện trong khoảng thời gian
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

            // if (!empty($topEvents)) {
            //     return  response()->json([
            //         'status' => 'message',
            //         'message' => 'Không có dữ liệu trong khoảng thời gian trên.'
            //     ], 400);
            // }

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

    // Số sự kiện hoàn thành trong khoảng thời gian
    public function getEventStatistics(Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $eventCount = $this->eventRepository->getEventCount($startDate, $endDate);

        return response()->json([
            'event_count' => $eventCount,
        ]);
    }
}
