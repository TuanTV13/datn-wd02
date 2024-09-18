<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'address' => ['nullable', 'string'],
            'province_id' => ['required', 'exists:provinces,id'],   // Kiểm tra tỉnh có tồn tại
            'district_id' => ['required', 'exists:districts,id'],   // Kiểm tra huyện có tồn tại
            'ward_id' => ['required', 'exists:wards,id'],
        ];
    }

    public function attributes()
    {
        return [
            'name' => 'Tên người dùng',
            'email' => 'Địa chỉ email',
            'password' => 'Mật khẩu',
            'province_id' => 'Tỉnh',
            'district_id' => 'Huyện',
            'ward_id' => 'Xã/Phường',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Vui lòng nhập tên người dùng.',
            'name.string' => 'Tên người dùng phải là chuỗi ký tự.',
            'name.max' => 'Tên người dùng không được vượt quá 255 ký tự.',
            
            'email.required' => 'Vui lòng nhập địa chỉ email.',
            'email.email' => 'Địa chỉ email không hợp lệ.',
            'email.max' => 'Email không được vượt quá 255 ký tự.',
            'email.unique' => 'Email này đã được sử dụng.',
    
            'password.required' => 'Vui lòng nhập mật khẩu.',
            'password.min' => 'Mật khẩu phải có ít nhất 8 ký tự.',
            'password.confirmed' => 'Mật khẩu xác nhận không khớp.',
    
            'province_id.required' => 'Vui lòng chọn tỉnh.',
            'province_id.exists' => 'Tỉnh không hợp lệ.',
    
            'district_id.required' => 'Vui lòng chọn huyện.',
            'district_id.exists' => 'Huyện không hợp lệ.',
    
            'ward_id.required' => 'Vui lòng chọn xã/phường.',
            'ward_id.exists' => 'Xã/Phường không hợp lệ.',
        ];
    }
}
