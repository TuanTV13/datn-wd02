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
            // 'ward' => 'required|string',
            'location' => 'required|string|max:255',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'display_header' => 'boolean',

        ];
    }

    public function messages(): array
    {
        return [

            'location.required' => 'Hãy nhập địa điểm cụ thể của sự kiện.',
            'location.max' => 'Địa điểm không được vượt quá :max ký tự.',

            'start_time.required' => 'Hãy nhập thời gian bắt đầu sự kiện.',
            'start_time.date' => 'Thời gian bắt đầu không phải là một ngày hợp lệ.',

            'end_time.required' => 'Hãy nhập thời gian kết thúc.',
            'end_time.date' => 'Thời gian kết thúc không phải là một ngày hợp lệ.',
            'end_time.after' => 'Thời gian kết thúc phải sau thời gian bắt đầu.',

            'display_header.boolean' => 'Trường hiển thị trên sự kiện ở đầu trang phải mang giá trị 0 hoặc 1.',
        ];
    }
}
