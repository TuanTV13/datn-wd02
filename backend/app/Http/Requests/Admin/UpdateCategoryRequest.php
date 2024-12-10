<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCategoryRequest extends FormRequest
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
        $id = $this->route('id');

        return [
            'name' => 'required|string|max:50|unique:categories,name,' . $id,
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Tên danh mục sự kiện là bắt buộc.',
            'name.string' => 'Tên danh mục phải sự kiện là một chuỗi ký tự.',
            'name.max' => 'Tên danh mục sự kiện không được vượt quá 50 ký tự.',
            'name.unique' => 'Tên danh mục sự kiện này đã tồn tại.',
        ];
    }
}
