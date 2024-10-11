<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTicketRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function rules(): array
    {
        return [
            'event_id' => 'nullable|exists:events,id',
            'ticket_type_id' => 'nullable|exists:ticket_types,id',
            'status_id' => 'nullable|exists:statuses,id',
            'price' => 'nullable|numeric|min:0',
            'quantity' => 'nullable|integer|min:1',
            'available_quantity' => 'nullable|integer|min:0|lte:quantity',
            'seat_location' => 'nullable|string|max:100',
            'sale_start' => 'nullable|date|before_or_equal:sale_end',
            'sale_end' => 'nullable|date|after_or_equal:sale_start',
            'description' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'event_id.exists' => 'Sự kiện không hợp lệ.',
            'ticket_type_id.exists' => 'Loại vé không hợp lệ.',
            'status_id.exists' => 'Trạng thái không hợp lệ.',
            'price.numeric' => 'Giá vé phải là một số.',
            'price.min' => 'Giá vé phải lớn hơn hoặc bằng 0.',
            'quantity.integer' => 'Số lượng vé phải là số nguyên.',
            'quantity.min' => 'Số lượng vé phải lớn hơn hoặc bằng 1.',
            'available_quantity.lte' => 'Số vé còn lại không được vượt quá tổng số vé.',
            'seat_location.max' => 'Vị trí ghế không được dài quá 100 ký tự.',
            'sale_start.date' => 'Ngày bắt đầu bán vé phải là một ngày hợp lệ.',
            'sale_start.before_or_equal' => 'Ngày bắt đầu bán vé phải trước hoặc bằng ngày kết thúc.',
            'sale_end.date' => 'Ngày kết thúc bán vé phải là một ngày hợp lệ.',
            'sale_end.after_or_equal' => 'Ngày kết thúc bán vé phải sau hoặc bằng ngày bắt đầu.',
        ];
    }
}
