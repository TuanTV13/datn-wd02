<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use App\Repositories\EventRepository;
use Illuminate\Http\Request;
use InvalidArgumentException;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class StatisticsController extends Controller
{
    protected $eventRepository;

    public function __construct(EventRepository $eventRepository)
    {
        $this->eventRepository = $eventRepository;
    }

    // Top sự kiện trong khoảng thời gian -> trả về tổng doanh thu và % của từng sự kiện
    public function topRevenueEvents(Request $request)
    {
        $limit = $request->input('limit', 5);
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $timePeriod = $request->input('time_period'); // 'day', 'month', 'quarter', 'year'

        if (!$startDate || !$endDate) {
            // Xử lý khoảng thời gian từ các lựa chọn (ngày, tháng, quý, năm)
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
            // Lấy các sự kiện có doanh thu cao nhất trong khoảng thời gian
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

    // Số sự kiện hoàn thành trong khoảng thời gian
    public function getEventStatistics(Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $timePeriod = $request->input('time_period'); // 'day', 'month', 'quarter', 'year'

        if (!$startDate || !$endDate) {
            // Xử lý khoảng thời gian từ các lựa chọn
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

        $eventCount = $this->eventRepository->getEventCount($startDate, $endDate);

        return response()->json([
            'event_count' => $eventCount,
        ]);
    }

    /**
     * Thống kê sự kiện theo thể loại (chỉ lấy sự kiện có trạng thái confirmed)
     */
    public function getStatisticsByEventType(Request $request)
{
    // Lấy dữ liệu từ request
    $startDate = $request->input('start_date');
    $endDate = $request->input('end_date');
    $timePeriod = $request->input('time_period'); // 'day', 'month', 'quarter', 'year'

    // Kiểm tra và xử lý nếu không có ngày bắt đầu hoặc ngày kết thúc
    if (!$startDate || !$endDate) {
        // Xử lý khoảng thời gian từ các lựa chọn
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
        // Lấy thống kê theo event_type (thể loại sự kiện)
        $statistics = $this->eventRepository->getStatisticsByEventType($startDate, $endDate);

        // Trả về kết quả
        return response()->json([
            'status' => 'success',
            'data' => $statistics,
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage(),
        ], 500);
    }
}


    // Thống kê sự kiện theo tỉnh/thành phố với trạng thái "confirmed"
    public function getStatisticsByProvince(Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $timePeriod = $request->input('time_period'); // 'day', 'month', 'quarter', 'year'

        if (!$startDate || !$endDate) {
            // Xử lý khoảng thời gian từ các lựa chọn
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
            $statistics = $this->eventRepository->getStatisticsByProvinceAndStatus(
                'confirmed',
                $startDate,
                $endDate
            );

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

    /**
     * Tính toán ngày bắt đầu và kết thúc dựa trên khoảng thời gian.
     */

    // Top sự kiện theo số lượng người tham gia
public function topParticipantsEvents(Request $request)
{
    $limit = $request->input('limit', 5);  // Limit to top 5 events
    $startDate = $request->input('start_date');
    $endDate = $request->input('end_date');
    $timePeriod = $request->input('time_period'); // 'day', 'month', 'quarter', 'year'

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
        // Lấy các sự kiện có số lượng người tham gia cao nhất trong khoảng thời gian
        $topEvents = $this->eventRepository->getTopParticipantsEvents($limit, $startDate, $endDate);

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


    // Thống kê sự kiện đã được tổ chức (confirmed) và bị hủy bỏ (canceled)
    public function getEventStatusStatistics(Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $timePeriod = $request->input('time_period'); // 'day', 'month', 'quarter', 'year'

        if (!$startDate || !$endDate) {
            // Xử lý khoảng thời gian từ các lựa chọn (ngày, tháng, quý, năm)
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
            // Đếm số sự kiện đã được tổ chức (status = confirmed)
            $confirmedEventCount = $this->getConfirmedEventCount($startDate, $endDate);

            // Đếm số sự kiện bị hủy bỏ (status = canceled)
            $canceledEventCount = $this->getCanceledEventCount($startDate, $endDate);

            return response()->json([
                'status' => 'success',
                'data' => [
                    'confirmed_events' => $confirmedEventCount,
                    'canceled_events' => $canceledEventCount
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Đếm số sự kiện đã xác nhận (status = confirmed)
    private function getConfirmedEventCount($startDate, $endDate)
    {
        return DB::table('events')
            ->where('status', 'confirmed') // Trạng thái là 'confirmed'
            ->whereBetween('event_date', [$startDate, $endDate])
            ->count();
    }

    // Đếm số sự kiện bị hủy (status = canceled)
    private function getCanceledEventCount($startDate, $endDate)
    {
        return DB::table('events')
            ->where('status', 'canceled') // Trạng thái là 'canceled'
            ->whereBetween('event_date', [$startDate, $endDate])
            ->count();
    }


    
    
        public function getEventRevenueAndParticipants(Request $request)
        {
            // Lấy thông tin từ request
            $startDate = $request->input('start_date');  // Ngày bắt đầu
            $endDate = $request->input('end_date');  // Ngày kết thúc
            $timePeriod = $request->input('time_period'); // 'day', 'month', 'quarter', 'year'
    
            // Kiểm tra nếu chưa cung cấp ngày bắt đầu và ngày kết thúc
            if (!$startDate || !$endDate) {
                if ($timePeriod) {
                    // Lấy khoảng thời gian dựa trên lựa chọn time_period
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
                // Truy vấn bảng transactions để lấy dữ liệu doanh thu của các sự kiện trong khoảng thời gian
                $transactions = DB::table('transactions')
                    ->select('event_id', DB::raw('SUM(total_amount) as revenue'), DB::raw('COUNT(DISTINCT user_id) as total_participants'))
                    ->whereBetween('created_at', [$startDate, $endDate])
                    ->where('status', 'completed')  // Chỉ tính các giao dịch đã hoàn thành
                    ->groupBy('event_id')
                    ->get();
    
                // Tính tổng doanh thu và tổng số người tham gia từ bảng transactions
                $totalRevenue = $transactions->sum('revenue');
                $totalParticipants = $transactions->sum('total_participants');
    
                // Truy vấn bảng event_users để lấy số lượng người tham gia (checked_in)
                $eventUsers = DB::table('event_users')
                    ->select('event_id', DB::raw('COUNT(DISTINCT user_id) as checked_in_participants'))
                    ->whereBetween('created_at', [$startDate, $endDate])  // Có thể cần điều chỉnh nếu muốn lọc theo thời gian
                    ->where('checked_in', true)
                    ->groupBy('event_id')
                    ->get();
    
                // Kết hợp doanh thu và số người tham gia thực tế (checked_in)
                $result = $transactions->map(function ($transaction) use ($eventUsers, $totalRevenue) {
                    // Lấy số lượng người tham gia đã check-in
                    $checkedInParticipants = $eventUsers->firstWhere('event_id', $transaction->event_id);
                    $transaction->checked_in_participants = $checkedInParticipants ? $checkedInParticipants->checked_in_participants : 0;
    
                    // Tính phần trăm doanh thu của từng sự kiện
                    $transaction->revenue_percentage = $totalRevenue > 0 
                        ? ($transaction->revenue / $totalRevenue) * 100  // Tính phần trăm doanh thu của sự kiện
                        : 0;
    
                    return $transaction;
                });
    
                // Trả về kết quả
                return response()->json([
                    'status' => 'success',
                    'total_revenue' => $totalRevenue,
                    'total_participants' => $totalParticipants,
                    'data' => $result,  // Chi tiết thông tin doanh thu và người tham gia đã check-in của từng sự kiện
                ]);
            } catch (\Exception $e) {
                return response()->json([
                    'status' => 'error',
                    'message' => $e->getMessage(),  // Lỗi nếu có
                ], 500);
            }
        }
    
        // Hàm này dùng để lấy ngày bắt đầu và ngày kết thúc theo khoảng thời gian (ví dụ: day, month, year...)
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
    
    
    





