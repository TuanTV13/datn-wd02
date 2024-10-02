<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEventRequest extends FormRequest
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
            'description'       => 'nullable|string|max:5000',
            'start_time'        => 'required|date|after:' . now()->addDays(7),
            'end_time'          => 'required|date|after:start_time', 
            'location'          => 'nullable|string|max:255',
            'max_attendees'     => 'nullable|integer|min:1',

            'new_speakers'      => 'nullable|array',
            'new_speakers.*'    => 'string|max:255',
        ];
    }

    public function attributes(): array
    {
        return [
            'description'       => 'Mô tả sự kiện',
            'start_time'        => 'Thời gian bắt đầu',
            'end_time'          => 'Thời gian kết thúc',
            'location'          => 'Địa điểm',
            'max_attendees'     => 'Số lượng người tham gia',
            'new_speakers'      => 'Diễn giả mới',
        ];
    }
}
