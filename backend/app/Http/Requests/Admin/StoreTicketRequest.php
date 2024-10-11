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
            'event_id' => 'required|exists:events,id',
            'ticket_type_id' => 'required|exists:ticket_types,id',
            'status_id' => 'required|exists:statuses,id',
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:1',
            'available_quantity' => 'nullable|integer|min:0|lte:quantity',
            'seat_location' => 'nullable|string|max:100',
            'sale_start' => 'required|date|before_or_equal:sale_end',
            'sale_end' => 'required|date|after_or_equal:sale_start',
            'description' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'event_id.required' => 'Sự kiện là bắt buộc.',
            'event_id.exists' => 'Sự kiện không hợp lệ.',
            'ticket_type_id.required' => 'Loại vé là bắt buộc.',
            'ticket_type_id.exists' => 'Loại vé không hợp lệ.',
            'status_id.required' => 'Trạng thái là bắt buộc.',
            'status_id.exists' => 'Trạng thái không hợp lệ.',
            'price.required' => 'Giá vé là bắt buộc.',
            'price.numeric' => 'Giá vé phải là một số.',
            'quantity.required' => 'Số lượng vé là bắt buộc.',
            'quantity.integer' => 'Số lượng vé phải là số nguyên.',
            'available_quantity.lte' => 'Số vé còn lại không được vượt quá tổng số vé.',
            'seat_location.max' => 'Vị trí ghế không được dài quá 100 ký tự.',
            'sale_start.required' => 'Ngày bắt đầu bán vé là bắt buộc.',
            'sale_end.required' => 'Ngày kết thúc bán vé là bắt buộc.',
        ];
    }
}
