<?php

namespace App\Http\Controllers\V1\Client;

use App\Http\Controllers\Controller;
use App\Repositories\EventRepository;

class HomeController extends Controller
{
    protected $eventRepository;

    public function __construct(EventRepository $eventRepository)
    {
        $this->eventRepository = $eventRepository;
    }
            
    public function headerEvents()
    {
        $headerEvents = $this->eventRepository->getHeaderEvents();

        if ($headerEvents->isEmpty()) {
            return response()->json([
                'message' => 'Không có sự kiện nào được hiển thị ở đầu trang.'
            ]);
        }
    
        return response()->json([
            'data' => $headerEvents
        ], 200);
    }
    
    public function upcomingEvents($province = null)
    {
        $upcomingEvents = $this->eventRepository->getUpcomingEvents($province);

        if ($upcomingEvents->isEmpty()) {
            return response()->json([
                'message' => 'Không có sự kiện nào sắp diễn ra.'
            ], 404);
        }
    
        return response()->json([
            'data' => $upcomingEvents
        ], 200);
    }

    public function featuredEvents()
    {
        $featuredEvents = $this->eventRepository->getFeaturedEvents();

        if (!$featuredEvents) {
            return response()->json([
                'message' => 'Không có sự kiện nổi bật nào.'
            ]);
        }

        return response()->json([
            'data' => $featuredEvents
        ], 200);
    }

    public function topRatedEvents()
    {
        $topRatedEvents = $this->eventRepository->getTopRatedEvents();

        if ($topRatedEvents->isEmpty()) {
            return response()->json([
                'message' => 'Không có sự kiện nào được đánh giá cao.'
            ]);
        }
    
        return response()->json([
            'data' => $topRatedEvents
        ], 200);
    }
}
