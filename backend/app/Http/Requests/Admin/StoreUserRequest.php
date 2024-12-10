<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'      => ['required', 'string', 'max:100'],
            'email'     => ['required', 'string', 'email', 'max:100'   , 'unique:users,email'],
            'password'  => ['required', 'string', 'min:8', 'max:16'    , 'confirmed'],
            'phone'     => ['required', 'string', 'unique:users,phone'],
            'image'     => ['nullable', 'image' , 'mimes:jpg,jpeg,png' , 'max:2048'],
        ];
    }

    public function attributes(): array
    {
        return [
            'name'      => 'Tên người dùng',
            'email'     => 'Email',
            'password'  => 'Mật khẩu',
            'phone'     => 'Số điện thoại', 
            'image'     => 'Ảnh đại diện',
        ];
    }
}
