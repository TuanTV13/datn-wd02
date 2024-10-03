<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreTicketRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'event_id'                      => 'required|exists:events,id',
            'ticket_type_id'                => 'required|exists:ticket_types,id',
            'price'                         => 'required|numeric|min:0',
            'quantity'                      => 'required|integer|min:1',
            'available_quantity'            => 'nullable|integer|min:0',
            'seat_location'                 => 'required',


            'seatLocations'                 => 'nullable|array',
            'seatLocations.*.row'           => 'required|string|max:10',
            'seatLocations.*.number'        => 'required|integer|min:1',

            'vouchers'                      => 'nullable|array',
            'vouchers.*.code'               => 'required|string|max:20',
            'vouchers.*.discount_amount'    => 'required|numeric|min:0',
            'vouchers.*.expiration_date'    => 'required|date',
            'vouchers.*.used_limit'         => 'required|integer|min:1',
            'sale_start'                    => 'required|date',
            'sale_end'                      => 'required|date|after_or_equal:sale_start',
            'description'                   => 'nullable|string'
        ];
    }


    /**
     * Custom attribute names for error messages.
     */
    public function attributes()
    {
        return [
            'event_id'                      => 'Sự kiện',
            'ticket_type_id'                => 'Koại vé',
            'price'                         => 'Giá vé',
            'quantity'                      => 'Số lượng vé',
            'available_quantity'            => 'Số vé khả dụng',
            'sale_start'                    => 'Ngày bắt đầu bán',
            'sale_end'                      => 'Ngày kết thúc bán',
            'description'                   => 'Mô tả',

            'seatLocations'                 => 'Chỗ ngồi',
            'seatLocations.*.row'           => 'Hàng ghế',
            'seatLocations.*.number'        => 'Số ghế',

            'vouchers'                      => 'Vouchers',
            'vouchers.*.code'               => 'Mã voucher',
            'vouchers.*.discount_amount'    => 'Giảm giá',
            'vouchers.*.expiration_date'    => 'Ngày hết hạn giảm giá',
            'vouchers.*.used_limit'         => 'Giới hạn người sử dụng',
        ];
    }
}
