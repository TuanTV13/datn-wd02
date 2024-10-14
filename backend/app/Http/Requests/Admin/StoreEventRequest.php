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

            'event' => 'required_array_keys:category_id,province_id,district_id,ward_id,name,description,start_time,end_time,location,event_type,thumbnail',

            'event.category_id' => 'required|integer|exists:categories,id',
            'event.province_id' => 'required|integer|exists:provinces,id',
            'event.district_id' => 'required|integer|exists:districts,id',
            'event.ward_id' => 'required|integer|exists:wards,id',
            'event.name' => 'required|string|max:255',
            'event.description' => 'required|string',
            'event.location' => 'required|string|max:255',
            'event.event_type' => 'required|in:online,offline',
            'event.link_online' => 'nullable|string|255',
            'event.max_attendess' => 'nullable',
            'event.thumbnail' => 'required|string|max:255',
            'event.start_time' => [
                'required',
                'date',
                'after:' . now()->addDays(10)->toDateTimeString(),
            ],
            'event.end_time' => [
                'required',
                'date',
                function ($attribute, $value, $fail) {
                    $start_time = request('event.start_time');
                    if ($start_time) {
                        $start_time = \Carbon\Carbon::parse($start_time);
                        $end_time = \Carbon\Carbon::parse($value);

                        if ($end_time->lessThan($start_time->addHours(2))) {
                            $fail('Thời gian kết thúc phải sau ít nhất 2 giờ so với thời gian bắt đầu.');
                        }
                    }
                },
            ],

            'speakers' => 'nullable|array',
            'speakers.*.name' => 'required|string|max:50',
            'speakers.*.profile' => 'nullable|string|max:255',
            'speakers.*.email' => 'required|string|max:50|unique:speakers,email',
            'speakers.*.phone' => 'required|string|max:20|unique:speakers,phone',
            'speakers.*.image_url' => 'nullable|string|max:255',

        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($this->input('event.event_type') === 'online' && !$this->input('event.link_online')) {
                $validator->errors()->add('event.link_online', 'Link online là bắt buộc đối với sự kiện trực tuyến.');
            }
        });
    }

    public function messages(): array
    {
        return [
            'event.required_array_keys' => 'Các trường thể loại sự kiện, Tỉnh, Huyện, Xã, Tên sự kiện, Mô tả sự kiện, Thời gian bắt đầu, Thời gian kết thúc, Đại điểm cụ thể, Loại sự kiện và Ảnh đại diện là bắt buộc.',

            'event.category_id.required' => 'Vui lòng chọn thể loại sự kiện.',
            'event.category_id.integer' => 'Thể loại sự kiện phải là một số nguyên.',
            'event.category_id.exists' => 'Thể loại sự kiện không tồn tại trong danh sách danh mục.',

            'event.province_id.required' => 'Vui lòng chọn tỉnh',
            'event.province_id.integer' => 'Tỉnh phải là một số nguyên.',
            'event.province_id.exists' => 'Tỉnh không tồn tại trong danh sách tỉnh.',

            'event.district_id.required' => 'Vui lòng chọn huyện',
            'event.district_id.integer' => 'Huyện phải là một số nguyên.',
            'event.district_id.exists' => 'Huyện không tồn tại trong danh sách',

            'event.ward_id.required' => 'Vui lòng chọn xã.',
            'event.ward_id.integer' => 'Xã phải là một số nguyên.',
            'event.ward_id.exists' => 'Xã không tồn tại trong danh sách.',

            'event.name.required' => 'Vui lòng nhập tên sự kiện',
            'event.name.max' => 'Tên sự kiện không được vượt quá :max ký tự.',

            'event.description.required' => 'Vui lòng nhập vào mô tả của sự kiện.',

            'event.location.required' => 'Hãy nhập địa điểm cụ thể của sự kiện',
            'event.location.max' => 'Địa điểm không được vượt quá :max ký tự.',

            'event.event_type.required' => 'Vui lòng chọn loại sự kiện',

            'event.thumbnail.required' => 'Hãy tải lên hình ảnh đại diện cho sự kiện',
            'event.thumbnail.max' => 'Ảnh quá dung lượng cho phép',

            'event.start_time.required' => 'Hãy nhập thời gian bắt đầu sự kiện',
            'event.start_time.date' => 'Thời gian bắt đầu không phải là một ngày hợp lệ.',
            'event.start_time.after' => 'Thời gian bắt đầu phải cách hiện tại ít nhất 10 ngày.',

            'event.end_time.required' => 'Hãy nhập thời gian kết thúc',
            'event.end_time.date' => 'Thời gian kết thúc không phải là một ngày hợp lệ.',
            'event.end_time.after' => 'Thời gian kết thúc phải sau thời gian bắt đầu.',
            'event.end_time.custom' => 'Thời gian kết thúc phải sau ít nhất 2 giờ so với thời gian bắt đầu.',


            'speakers.*.name.required' => 'Tên diễn giả là bắt buộc.',
            'speakers.*.name.max' => 'Tên diễn giả không được vượt quá :max ký tự.',

            'speakers.*.profile.string' => 'Hồ sơ diễn giả phải là một chuỗi.',
            'speakers.*.profile.max' => 'Hồ sơ diễn giả không được vượt quá :max ký tự.',

            'speakers.*.email.required' => 'Email diễn giả là bắt buộc.',
            'speakers.*.email.max' => 'Email diễn giả không được vượt quá :max ký tự.',
            'speakers.*.email.unique' => 'Email này đã được sử dụng cho một diễn giả khác.',

            'speakers.*.phone.required' => 'Số điện thoại diễn giả là bắt buộc.',
            'speakers.*.phone.max' => 'Số điện thoại diễn giả không được vượt quá :max ký tự.',
            'speakers.*.phone.unique' => 'Số điện thoại này đã được sử dụng cho một diễn giả khác.',

            'speakers.*.image_url.max' => 'URL hình ảnh diễn giả không được vượt quá :max ký tự.',
        ];
    }
}
