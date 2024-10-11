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
        $event = $this->route('event');

        return [
            'ward_id' => 'required|integer|exists:wards,id',
            'location' => 'required|string|max:255',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
        ];
    }

    public function messages(): array
    {
        return [
            'ward_id.required' => 'Vui lòng chọn xã.',
            'ward_id.exists' => 'Xã không tồn tại trong danh sách.',

            'location.required' => 'Hãy nhập địa điểm cụ thể của sự kiện.',
            'location.max' => 'Địa điểm không được vượt quá :max ký tự.',

            'start_time.required' => 'Hãy nhập thời gian bắt đầu sự kiện.',
            'start_time.date' => 'Thời gian bắt đầu không phải là một ngày hợp lệ.',

            'end_time.required' => 'Hãy nhập thời gian kết thúc.',
            'end_time.date' => 'Thời gian kết thúc không phải là một ngày hợp lệ.',
            'end_time.after' => 'Thời gian kết thúc phải sau thời gian bắt đầu.',
        ];
    }
}
