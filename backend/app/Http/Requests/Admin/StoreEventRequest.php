<?php

namespace App\Http\Requests\Admin;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class StoreEventRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules(): array
    {
        return [];
    }
}
