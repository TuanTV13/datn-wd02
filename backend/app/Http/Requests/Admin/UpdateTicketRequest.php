<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTicketRequest extends FormRequest
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
            'price' => 'sometimes|numeric|min:1',
            'quantity' => 'sometimes|integer|min:1',
            'available_quantity' => 'nullable|integer',
            'seat_location' => 'sometimes|string|max:100',
            // 'sale_start' => 'sometimes|date|after_or_equal:today',
            'sale_end' => 'sometimes|date|after:sale_start|after_or_equal:today',
            'description' => 'nullable|string'
        ];
    }
}
