<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreTicketRequest extends FormRequest
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
            'event_id' => 'required',
            'ticket_type' => 'required',
            'price' => 'required|numeric|min:1',
            'quantity' => 'required|integer|min:1',
            'sold_quantity' => 'nullable|integer',
            'name' => 'required|string|max:100',
            'purchase_limit' => 'nullable|integer|min:0|lte:quantity',
            'sale_start' => 'required|date|after_or_equal:today',
            'sale_end' => 'required|date|after:sale_start',
            'purchase_limit' => 'integer|required|min:0',
            // 'description' => 'nullable|string'
        ];
    }
}
