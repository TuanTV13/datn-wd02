<?php

namespace App\Http\Controllers\V1\Client;

use App\Http\Controllers\Controller;
use App\Repositories\EventRepository;
use Illuminate\Http\Request;

class EventController extends Controller
{
    protected $eventRepository;

    public function __construct(EventRepository $eventRepository)
    {
        $this->eventRepository = $eventRepository;
    }

    public function index()
    {
        $events = $this->eventRepository->getAll();

        if (!$events) {
            return response()->json([
                'message' => 'Không có sự kiện nào'
            ]);
        }

        return response()->json([
            'data' => $events
        ]);
    }

    public function show($id)
    {
        $event = $this->eventRepository->find($id);

        if (!$event) {
            return response()->json([
                'message' => 'Không tồn tại sự kiện'
            ]);
        }

        return response()->json([
            'data' => $event
        ]);
    }

    public function filter(Request $request, $categoryId)
    {
        $category = $request->input('category');
        $event = $this->eventRepository->findByCategory($categoryId);

        if (!$event) {
            return response()->json([
                'message' => 'Không tồn tại sự kiện'
            ]);
        }

        return response()->json([
            'data' => $event
        ]);
    }

    public function search(Request $request)
    {
        $name = $request->input('name');
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $categoryId = $request->input('category_id');

        $events = $this->eventRepository->search($name, $startDate, $endDate, $categoryId);

        if ($events->isEmpty()) {
            return response()->json([
                'message' => 'Không tìm thấy sự kiện nào'
            ]);
        }

        return response()->json([
            'data' => $events
        ]);
    }
}
