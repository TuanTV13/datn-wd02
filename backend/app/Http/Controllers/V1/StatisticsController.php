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

    // Top sự kiện trong khoảng thời gian -> trả về tổng doanh thu và % của từng sự kiện
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
    public function getEventStatisticsByTime(Request $request)
    {
        $timeFrame = $request->input('time_frame', 'month'); // 'year', 'quarter', 'month' (mặc định là 'month')
        $year = $request->input('year'); // Năm cụ thể
        $month = $request->input('month'); // Tháng cụ thể
        $quarter = $request->input('quarter'); // Quý cụ thể
    
        // Khởi tạo query
        $query = DB::table('events')
            ->join('transactions', 'events.id', '=', 'transactions.event_id')
            ->where('events.status', '!=', 'pending');
    
        // Lọc theo năm (nếu được cung cấp)
        if ($year) {
            $query->whereYear('transactions.created_at', $year);
        }
    
        // Lọc theo tháng (nếu người dùng chọn tháng)
        if ($timeFrame === 'month' && $month) {
            $query->whereMonth('transactions.created_at', $month);
        }
    
        // Lọc theo quý (nếu người dùng chọn quý)
        if ($timeFrame === 'quarter' && $quarter) {
            $query->whereRaw('QUARTER(transactions.created_at) = ?', [$quarter]);
        }
    
        // Tính toán nhóm dữ liệu
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
    
        // Lấy dữ liệu
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
    



    /**
     * Thống kê sự kiện theo thể loại (chỉ lấy sự kiện có trạng thái confirmed)
     */
    public function getEventCountTotalAmountAndPercentageByEventType()
    {
        // Tính tổng doanh thu của tất cả các sự kiện
        $totalRevenue = DB::table('events')
            ->join('transactions', 'events.id', '=', 'transactions.event_id')
            ->where('events.status', '!=', 'pending')
            ->sum('transactions.total_amount');
        
        // Tính số lượng sự kiện và tổng doanh thu theo từng loại sự kiện
        return DB::table('events')
            ->join('transactions', 'events.id', '=', 'transactions.event_id')
            ->select('events.event_type', 
                     DB::raw('COUNT(events.id) as event_count'), 
                     DB::raw('SUM(transactions.total_amount) as total_amount'))
            ->where('events.status', '!=', 'pending')
            ->groupBy('events.event_type')
            ->get()
            ->map(function ($item) use ($totalRevenue) {
                // Tính tỷ lệ phần trăm doanh thu theo loại sự kiện
                $item->percentage_revenue = ($totalRevenue > 0) ? ($item->total_amount / $totalRevenue) * 100 : 0;
                return $item;
            });
    }
    
    

        /**
         * Helper method to calculate start and end date for time periods like day, month, quarter, year.
         */
      
    
    

    /**
     * Tính toán ngày bắt đầu và kết thúc dựa trên khoảng thời gian.
     */




    // Top sự kiện theo số lượng người tham gia
    public function topParticipantsEvents(Request $request)
    {
        $limit = $request->input('limit', 5); // Mặc định lấy top 5 sự kiện
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $timePeriod = $request->input('time_period'); // 'day', 'month', 'quarter', 'year'

        // Tính khoảng thời gian nếu không có start_date và end_date
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
            // Lấy các sự kiện top theo số người tham gia và trạng thái hoàn thành
            $topEvents = DB::table('events')
                ->join('transactions', 'events.id', '=', 'transactions.event_id')
                ->select(
                    'events.name',
                    DB::raw('COUNT(transactions.id) as total_participants'),
                    DB::raw('SUM(transactions.total_amount) as total_amount'),
                    'events.status'
                )
                ->whereBetween('events.start_time', [$startDate, $endDate])
                ->where('events.status', 'hoàn thành') // Lọc trạng thái hoàn thành
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





    // Thống kê sự kiện đã được tổ chức (confirmed) và bị hủy bỏ (canceled)
   

  
        public function getEventStatusStatistics(Request $request)
    {
        // Lấy dữ liệu từ request
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $timePeriod = $request->input('time_period'); // 'day', 'month', 'quarter', 'year'

        // Kiểm tra và xử lý nếu không có ngày bắt đầu hoặc kết thúc
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
            // Truy vấn tổng số sự kiện và doanh thu theo trạng thái
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
        // Truy vấn bảng transactions để lấy dữ liệu doanh thu và số người tham gia
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
            ->where('transactions.status', 'completed') // Chỉ tính các giao dịch hoàn thành
            ->groupBy('transactions.event_id')
            ->get();

        // Tính tổng doanh thu và tổng số người tham gia
        $totalRevenue = $data->sum('revenue');
        $totalParticipants = $data->sum('total_participants');

        // Tính toán phần trăm doanh thu cho từng sự kiện
        $result = $data->map(function ($event) use ($totalRevenue) {
            $event->revenue_percentage = $totalRevenue > 0 
                ? ($event->revenue / $totalRevenue) * 100 
                : 0;
            return $event;
        });

        // Trả về kết quả
        return response()->json([
            'status' => 'success',
            'total_revenue' => $totalRevenue,
            'total_participants' => $totalParticipants,
            'data' => $result // Thông tin chi tiết từng sự kiện
        ]);
    } catch (\Exception $e) {
        // Trả về lỗi nếu có
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage(),
        ], 500);
    }
}



// Thống kê sự kiện theo tỉnh/thành phố với trạng thái "confirmed"
public function getEventCountTotalAmountAndPercentageByProvince()
{
    // Tính tổng doanh thu của tất cả các sự kiện
    $totalRevenue = DB::table('events')
        ->join('transactions', 'events.id', '=', 'transactions.event_id')
        ->where('events.status', '!=', 'pending')
        ->sum('transactions.total_amount');
    
    // Tính số lượng sự kiện và tổng doanh thu theo từng tỉnh
    return DB::table('events')
        ->join('transactions', 'events.id', '=', 'transactions.event_id')
        ->select('events.province', 
                 DB::raw('COUNT(events.id) as event_count'), 
                 DB::raw('SUM(transactions.total_amount) as total_amount'))
        ->where('events.status', '!=', 'pending')
        ->groupBy('events.province')
        ->get()
        ->map(function ($item) use ($totalRevenue) {
            // Tính tỷ lệ phần trăm doanh thu theo địa điểm
            $item->percentage_revenue = ($totalRevenue > 0) ? ($item->total_amount / $totalRevenue) * 100 : 0;
            return $item;
        });
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
        // return response()->json([
        //     'event_count' => $eventCount,
        // ]);
    
    

