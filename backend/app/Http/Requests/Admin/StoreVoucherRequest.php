<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreVoucherRequest extends FormRequest
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
            'ticket_type_id' => 'required|exists:ticket_types,id',
            'event_id' => 'required|exists:events,id',
            'code' => 'required|string|max:100|unique:vouchers,code',
            'discount_amount' => 'required|numeric',
            'expiration_date' => 'required|date|after:' . now()->addDays(10),
            'used_limit' => 'required|integer'
        ];
    }

    public function messages()
    {
        return [
            ''
        ];
    }
}
