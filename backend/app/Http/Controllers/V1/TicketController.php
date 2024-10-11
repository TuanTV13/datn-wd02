<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTicketRequest;
use App\Http\Requests\Admin\UpdateTicketRequest;
use App\Repositories\TicketRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TicketController extends Controller
{
    protected $ticketRepository;

    public function __construct(TicketRepository $ticketRepository)
    {
        $this->ticketRepository = $ticketRepository;
    }

    public function index()
    {
        $ticket = $this->ticketRepository->getAll();

        return response()->json([
            'message' => 'Danh sách vé',
            'data' => $ticket
        ]);
    }

    public function create(StoreTicketRequest $request)
    {
        $data = $request->validated();

        try {
            $ticket = $this->ticketRepository->create($data);

            return response()->json([
                'message' => 'Thêm mới vé thành công',
                'data' => $ticket,
            ], 201);
        } catch (\Exception $e) {
            Log::error("Lỗi khi thêm mới vé:" . $e->getMessage());

            return response()->json([
                'message' => 'Lỗi hệ thống khi thêm mới vé',
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $ticket = $this->ticketRepository->find($id);

            if (!$ticket) {
                return response()->json([
                    'message' => 'Vé không tồn tại',
                ], 404);
            }

            return response()->json([
                'message' => 'Thông tin vé',
                'data' => $ticket,
            ]);
        } catch (\Exception $e) {
            Log::error("Lỗi khi lấy thông tin vé: " . $e->getMessage());

            return response()->json([
                'message' => 'Lỗi hệ thống khi lấy thông tin vé',
            ], 500);
        }
    }

    public function update($id, UpdateTicketRequest $request)
    {
        $data = $request->validated();

        try {
            $ticket = $this->ticketRepository->find($id);

            if (!$ticket) {
                return response()->json([
                    'message' => 'Vé không tồn tại',
                ], 404);
            }

            $ticket = $this->ticketRepository->update($id, $data);

            return response()->json([
                'message' => 'Cập nhật vé thành công',
                'data' => $ticket,
            ]);
        } catch (\Exception $e) {
            Log::error("Lỗi khi cập nhật vé: " . $e->getMessage());

            return response()->json([
                'message' => 'Lỗi hệ thống khi cập nhật vé',
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $ticket = $this->ticketRepository->find($id);

            if (!$ticket) {
                return response()->json([
                    'message' => 'Vé không tồn tại',
                ], 404);
            }

            $this->ticketRepository->delete($id);

            return response()->json([
                'message' => 'Xóa vé thành công',
            ], 200);
        } catch (\Exception $e) {
            Log::error("Lỗi khi xóa vé: " . $e->getMessage());

            return response()->json([
                'message' => 'Lỗi hệ thống khi xóa vé',
            ], 500);
        }
    }
}
