<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->user()->id;

        return [
            'name'      => ['required', 'string', 'max:100'],
            'email'     => ['required', 'string', 'email', 'max:100', Rule::unique('users', 'email')->ignore($userId)],
            'password'  => ['nullable', 'string', 'min:8', 'max:16', 'confirmed'],
            'phone'     => ['required', 'string', Rule::unique('users', 'phone')->ignore($userId)],
            'address'   => ['nullable', 'string', 'max:255'],
            'image'     => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048']
        ];
    }

    public function attributes(): array
    {
        return [
            'name'      => 'Tên người dùng',
            'email'     => 'Email',
            'password'  => 'Mật khẩu',
            'phone'     => 'Số điện thoại',
            'address'   => 'Địa chỉ',
            'image'     => 'Ảnh đại diện',
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique'   => 'Email đã được sử dụng bởi tài khoản khác.',
            'phone.unique'   => 'Số điện thoại đã được sử dụng bởi tài khoản khác.',
            'password.confirmed' => 'Mật khẩu xác nhận không khớp.',
        ];
    }
}
