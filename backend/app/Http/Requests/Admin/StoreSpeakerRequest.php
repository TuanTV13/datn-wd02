<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreSpeakerRequest extends FormRequest
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
            'name' => 'required|string|max:50',
            'profile' => 'nullable|string|max:255',
            'email' => 'required|email|unique:speakers,email|max:50',
            'phone' => 'required|string|unique:speakers,phone|max:20',
            'image_url' => 'nullable|url|max:2048',
            'event_id' => 'required|exists:events,id',
            'start_time' => 'required|date_format:Y-m-d H:i:s',
            'end_time' => 'required|date_format:Y-m-d H:i:s|after:start_time',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Tên diễn giả là bắt buộc.',
            'name.string' => 'Tên diễn giả phải là chuỗi.',
            'name.max' => 'Tên diễn giả không được vượt quá :max ký tự.',
            'profile.string' => 'Hồ sơ phải là chuỗi.',
            'profile.max' => 'Hồ sơ không được vượt quá :max ký tự.',
            'email.required' => 'Email là bắt buộc.',
            'email.email' => 'Email không hợp lệ.',
            'email.unique' => 'Email đã tồn tại.',
            'email.max' => 'Email không được vượt quá :max ký tự.',
            'phone.required' => 'Số điện thoại là bắt buộc.',
            'phone.string' => 'Số điện thoại phải là chuỗi.',
            'phone.unique' => 'Số điện thoại đã tồn tại.',
            'phone.max' => 'Số điện thoại không được vượt quá :max ký tự.',
            'image_url.url' => 'URL hình ảnh không hợp lệ.',
            'image_url.max' => 'URL hình ảnh không được vượt quá :max ký tự.',
            'event_id.required' => 'ID sự kiện là bắt buộc.',
            'event_id.exists' => 'ID sự kiện không hợp lệ. Vui lòng chọn một sự kiện tồn tại.',
            'start_time.required' => 'Thời gian bắt đầu là bắt buộc.',
            'start_time.date_format' => 'Thời gian bắt đầu phải theo định dạng Y-m-d H:i:s.',
            'end_time.required' => 'Thời gian kết thúc là bắt buộc.',
            'end_time.date_format' => 'Thời gian kết thúc phải theo định dạng Y-m-d H:i:s.',
            'end_time.after' => 'Thời gian kết thúc phải sau thời gian bắt đầu.',
        ];
    }
}
