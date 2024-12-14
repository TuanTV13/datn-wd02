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
        return [

            'event' => 'required_array_keys:category_id,province,district,ward,name,description,start_time,end_time,location,event_type,thumbnail',

            'category_id' => 'required|integer|exists:categories,id',
            'province' => 'required|string',
            'district' => 'required|string',
            'ward' => 'required|string',
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string|max:255',
            'event_type' => 'required|in:online,offline',
            'link_online' => 'nullable|string|max:255',
            'max_attendess' => 'nullable',
            'thumbnail' => 'required|max:2048',
            'start_time' => [
                'required',
                'date',
                // 'after:' . now()->addDays(10)->toDateTimeString(),
            ],
            'end_time' => [
                'required',
                'date',
                function ($attribute, $value, $fail) {
                    $start_time = request('start_time');
                    if ($start_time) {
                        $start_time = \Carbon\Carbon::parse($start_time);
                        $end_time = \Carbon\Carbon::parse($value);

                        if ($end_time->lessThan($start_time->addHours(2))) {
                            $fail('Thời gian kết thúc phải sau ít nhất 2 giờ so với thời gian bắt đầu.');
                        }
                    }
                },
            ],

            'speakers' => 'nullable',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($this->input('event_type') === 'online' && !$this->input('link_online')) {
                $validator->errors()->add('link_online', 'Link online là bắt buộc đối với sự kiện trực tuyến.');
            }
        });
    }

    public function messages(): array
    {
        return [
            'required_array_keys' => 'Các trường thể loại sự kiện, Tỉnh, Huyện, Xã, Tên sự kiện, Mô tả sự kiện, Thời gian bắt đầu, Thời gian kết thúc, Đại điểm cụ thể, Loại sự kiện và Ảnh đại diện là bắt buộc.',

            'name.required' => 'Vui lòng nhập tên sự kiện',
            'name.max' => 'Tên sự kiện không được vượt quá :max ký tự.',

            'description.required' => 'Vui lòng nhập vào mô tả của sự kiện.',

            'location.required' => 'Hãy nhập địa điểm cụ thể của sự kiện',
            'location.max' => 'Địa điểm không được vượt quá :max ký tự.',

            'event_type.required' => 'Vui lòng chọn loại sự kiện',

            'thumbnail.required' => 'Hãy tải lên hình ảnh đại diện cho sự kiện',
            'thumbnail.max' => 'Ảnh quá dung lượng cho phép',

            'start_time.required' => 'Hãy nhập thời gian bắt đầu sự kiện',
            'start_time.date' => 'Thời gian bắt đầu không phải là một ngày hợp lệ.',
            'start_time.after' => 'Thời gian bắt đầu phải cách hiện tại ít nhất 10 ngày.',

            'end_time.required' => 'Hãy nhập thời gian kết thúc',
            'end_time.date' => 'Thời gian kết thúc không phải là một ngày hợp lệ.',
            'end_time.after' => 'Thời gian kết thúc phải sau thời gian bắt đầu.',
            'end_time.custom' => 'Thời gian kết thúc phải sau ít nhất 2 giờ so với thời gian bắt đầu.',
        ];
    }
}
