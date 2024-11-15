<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSpeakerRequest extends FormRequest
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
        $id = $this->route('speaker');

        return [
            'name' => 'required|string|max:50',
            'profile' => 'nullable|string|max:255',
            'email' => 'required|email|max:50|unique:speakers,email,' . $id,
            'phone' => 'required|string|max:20|unique:speakers,phone,' . $id,
            'image_url' => 'nullable|url|max:2048',
            'event_id' => 'nullable|exists:events,id',

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
            'event_id.exists' => 'Sự kiện không tồn tại.',
        ];
    }
}
