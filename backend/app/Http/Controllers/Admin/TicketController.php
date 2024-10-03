<?php

namespace App\Http\Controllers\Admin;

use App\Events\EventUpdate;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTicketRequest;
use App\Models\Event;
use App\Models\Ticket;
use App\Models\Ticket_type;
use App\Models\TicketType;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tickets = Ticket::with([
            'event',
            'ticket_type',
            'seatLocations',
        ])->get();

        return response()->json($tickets);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTicketRequest $request)
    {
        $events = Event::all();
        $ticket_type = TicketType::all();

        $ticketData = $request->validated();

        $ticket = Ticket::create($ticketData);

        if ($request->has('seatLocations')) {
            foreach ($request->input('seatLocations') as $seatLocationData) {
                $ticket->seatLocations()->create($seatLocationData);
            }
        }

        if ($request->has('vouchers')) {
            foreach ($request->input('vouchers') as $voucherData) {
                $voucherData['ticket_id'] = $ticket->id;
                $ticket->vouchers()->create($voucherData);
            }
        }

        return response()->json([
            'message' => 'Ticket created successfully',
            'ticket' => $ticket
        ], 201);
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
