<?php

namespace App\Http\Controllers\Admin;

use App\Events\EventUpdate;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreEventRequest;
use App\Http\Requests\Admin\UpdateEventRequest;
use App\Models\Event;
use App\Models\SeatLocation;
use App\Models\Voucher;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EventController extends Controller
{
    
    // Danh sách sự kiện
    public function index()
    {
        $events = Event::with([
            'category',
            'status',
            'province',
            'district',
            'ward',
            'eventImages',
            'tickets.seatLocations',
            'tickets.vouchers',
            'speakers'
        ])->get();

        if ($events->isEmpty()) {
            return response()->json([
                'message' => 'Chưa có sự kiện nào được tạo'
            ], 404);
        }

        return response()->json($events);
    }

    // Thêm mới
    public function store(StoreEventRequest $request)
    {
        try {

            $eventData = $request->validated()['event'];
            $eventData['registered_attendees'] = 0;

            $start_time = Carbon::parse($request->input('event.start_time'));
            $end_time = Carbon::parse($request->input('event.end_time'));

            if ($end_time->diffInRealMinutes($start_time) < 60) {

                return response()->json([
                    'message' => 'Thời gian kết thúc không cách thời gian bắt đầu ít nhất 1 tiếng.'
                ]);
            }

            DB::transaction(function () use ($request, $eventData) {

                $event = Event::create($eventData);

                // Tạo vé
                if ($request->has('tickets')) {
                    foreach ($request->validated('tickets') as $ticketData) {
                        $ticket = $event->tickets()->create($ticketData);

                        // Tạo vị trí ngồi cho từng vé
                        if (isset($ticketData['seat_locations'])) {
                            foreach ($ticketData['seat_locations'] as $seatData) {
                                $seatLocation = new SeatLocation([
                                    'ticket_id' => $ticket->id,
                                    'section' => $seatData['section'],
                                    'seat_number' => $seatData['seat_number'],
                                    'status' => $seatData['status'] ?? true,
                                ]);
                                $seatLocation->save();
                            }
                        }

                        // Tạo voucher cho từng vé nếu có
                        if (isset($ticketData['vouchers'])) {
                            foreach ($ticketData['vouchers'] as $voucherData) {
                                $voucher = new Voucher([
                                    'ticket_id' => $ticket->id,
                                    'code' => $voucherData['code'],
                                    'discount_amount' => $voucherData['discount_amount'],
                                    'expiration_date' => $voucherData['expiration_date'] ?? null,
                                    'used_limit' => $voucherData['used_limit'] ?? 0,
                                ]);
                                $voucher->save();
                            }
                        }
                    }
                }

                // Tạo diễn giả
                if ($request->has('speakers')) {
                    foreach ($request->validated('speakers') as $speakerData) {
                        $event->speakers()->create($speakerData);
                    }
                }

                // Tạo ảnh sự kiện
                if ($request->hasFile('event_images')) {
                    foreach ($request->file('event_images') as $image) {
                        $imagePath = Storage::put('events', $image);
                        $event->eventImages()->create(['image_url' => $imagePath]);
                    }
                }
            }, 3);

            return response()->json([
                'message' => 'Tạo mới sự kiện thành công, vui lòng kiểm tra',
            ], 201);
        } catch (\Throwable $th) {
            Log::error("Error creating event: " . $th->getMessage(), [
                'request' => $request->all(),
                'stack_trace' => $th->getTraceAsString(),
            ]);

            return response()->json(['message' => 'Error creating event', 'error' => $th->getMessage()], 500);
        }
    }

    // Chi tiết
    public function show($id) {}

    // Cập nhật
    public function update(UpdateEventRequest $updateEventRequest, $id) {}
}
