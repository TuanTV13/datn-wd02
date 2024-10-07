<?php

namespace App\Http\Requests\Admin;

use App\Repositories\Admin\UserRepository;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;


class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    protected $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    protected function prepareForValidation()
    {
        $id = $this->route('id');  // Lấy ID từ route

        // Kiểm tra người dùng có tồn tại không
        $user = $this->userRepository->find($id);

        if (!$user) {
            throw ValidationException::withMessages([
                'id' => 'Người dùng không tồn tại.',
            ]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $userId = $this->route('id');

        return [
            'name' => ['required', 'string', 'max:50'],
            'address' => ['nullable', 'string'],
            'phone' => ['required', 'string', 'unique:users,phone,' . $userId],
            'image' => ['nullable', 'file', 'mimes:jpg,jpeg,png', 'max:2048'],
            'province_id' => ['nullable', 'exists:provinces,id'],
            'district_id' => ['nullable', 'exists:districts,id'],
            'ward_id' => ['nullable', 'exists:wards,id'],
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array
     */
    public function attributes(): array
    {
        return [
            'name' => 'Tên người dùng',
            'address' => 'Địa chỉ',
            'phone' => 'Số điện thoại',
            'image' => 'Hình ảnh',
            'province_id' => 'Tỉnh',
            'district_id' => 'Huyện',
            'ward_id' => 'Xã',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Vui lòng nhập tên người dùng',
            'name.max' => 'Tên người dùng không được quá 50 kí tự',
            'phone.required' => 'Vui lòng nhập số điện thoại',
            'phone.unique' => 'Số điện thoại đã tồn tại.',
            'image.mimes' => 'Hình ảnh phải có định dạng jpg, jpeg hoặc png.',
            'image.max' => 'Hình ảnh không được vượt quá 2MB.',
            'province_id.exists' => 'Tỉnh không tồn tại.',
            'district_id.exists' => 'Huyện không tồn tại.',
            'ward_id.exists' => 'Xã không tồn tại.',
        ];
    }
}
