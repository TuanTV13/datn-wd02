<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'event' => 'required_array_keys:category_id,province_id,district_id,ward_id,name,description,start_time,end_time,location,event_type,max_attendees',

            'event.category_id'                     => 'required|exists:categories,id',
            // 'event.status_id'                       => 'required|exists:statuses,id',
            'event.province_id'                     => 'required|exists:provinces,id',
            'event.ward_id'                         => 'required|exists:wards,id',
            'event.district_id'                     => 'required|exists:districts,id',
            'event.name'                            => 'required|string|max:255',
            'event.description'                     => 'required|string',
            'event.start_time'                      => 'required|date|after:' . now()->addDays(7),
            'event.end_time'                        => 'required|date|after:event.start_time',
            'event.location'                        => 'required|string|max:100',
            'event.event_type'                      => 'required|in:online,offline',
            'event.max_attendees'                   => 'required|integer',

            // Diễn giả
            'speakers'                              => 'nullable|array',
            'speakers.*.name'                       => 'required|string|max:255',
            'speakers.*.email'                      => 'required|email|unique:speakers,email',
            'speakers.*.phone'                      => 'required|string|unique:speakers,phone',
            'speakers.*.profile'                    => 'nullable|string',
            'speakers.*.image_url'                  => 'nullable|string',

            // Ảnh sự kiện
            'event_images'                          => 'nullable|array',
            'event_images.*'                        => 'image|mimes:jpeg,png,jpg,gif|max:2048',

            // Vé
            'tickets'                               => 'nullable|array',
            'tickets.*.ticket_type_id'              => 'required|integer|exists:ticket_types,id',
            'tickets.*.status_id'                   => 'required|integer|exists:statuses,id',
            'tickets.*.price'                       => 'required|numeric',
            'tickets.*.quantity'                    => 'required|integer|min:1',
            'tickets.*.available_quantity'          => 'nullable|integer',
            'tickets.*.seat_location'               => 'required|string',
            'tickets.*.sale_start'                  => 'required|date',
            'tickets.*.sale_end'                    => 'required|date|after_or_equal:tickets.*.sale_start',
            'tickets.*.description'                 => 'nullable|string',

        ];
    }

    public function attributes()
    {
        return [
            'event.category_id'             => 'Danh mục sự kiện',
            'event.status_id'               => 'Trạng thái sự kiện',
            'event.province_id'             => 'Tỉnh/Thành phố',
            'event.district_id'             => 'Quận/Huyện',
            'event.ward_id'                 => 'Phường/Xã',
            'event.name'                    => 'Tên sự kiện',
            'event.description'             => 'Mô tả sự kiện',
            'event.start_time'              => 'Thời gian bắt đầu',
            'event.end_time'                => 'Thời gian kết thúc',
            'event.location'                => 'Địa điểm tổ chức',
            'event.event_type'              => 'Loại sự kiện',
            'event.max_attendees'           => 'Số lượng người tham dự tối đa',
            'speakers.*.name'               => 'Tên diễn giả',
            'speakers.*.email'              => 'Email diễn giả',
            'speakers.*.phone'              => 'Số điện thoại diễn giả',
            'speakers.*.profile'            => 'Hồ sơ diễn giả',
            'speakers.*.image_url'          => 'Đường dẫn ảnh diễn giả',
            'event_images.*'                => 'Ảnh sự kiện',
            'tickets.*.ticket_type_id'      => 'Loại vé',
            'tickets.*.price'               => 'Giá vé',
            'tickets.*.quantity'            => 'Số lượng vé',
            'tickets.*.available_quantity'  => 'Số lượng vé có sẵn',
            'tickets.*.seat_location'       => 'Vị trí ghế',
            'tickets.*.sale_start'          => 'Thời gian bắt đầu bán vé',
            'tickets.*.sale_end'            => 'Thời gian kết thúc bán vé',
            'tickets.*.description'         => 'Mô tả vé',
        ];
    }

    public function messages()
    {
        return [
            'event.category_id.required'    => 'Vui lòng chọn danh mục sự kiện.',
            'event.status_id.required'      => 'Trạng thái sự kiện là bắt buộc.',
            'event.province_id.required'    => 'Vui lòng chọn tỉnh/thành phố.',
            'event.district_id.required'    => 'Vui lòng chọn quận/huyện.',
            'event.ward_id.required'        => 'Vui lòng chọn phường/xã.',
            'event.name.required'           => 'Tên sự kiện là bắt buộc.',
            'event.description.required'    => 'Vui lòng nhập mô tả cho sự kiện.',
            'event.start_time.required'     => 'Vui lòng nhập thời gian bắt đầu sự kiện.',
            'event.start_time.after'        => 'Thời gian bắt đầu sự kiện phải sau thời gian hiện tại ít nhất 7 ngày.',
            'event.end_time.required'       => 'Vui lòng nhập thời gian kết thúc sự kiện.',
            'event.end_time.after'          => 'Thời gian kết thúc phải sau thời gian bắt đầu.',
            'event.location.required'       => 'Địa điểm tổ chức là bắt buộc.',
            'event.event_type.required'     => 'Loại sự kiện là bắt buộc.',
            'event.max_attendees.required'  => 'Số lượng người tham dự là bắt buộc.',
            'event.max_attendees.integer'   => 'Số lượng người tham dự phải là số nguyên.',
            'speakers.*.name.required'      => 'Tên diễn giả là bắt buộc.',
            'speakers.*.email.required'     => 'Email diễn giả là bắt buộc.',
            'speakers.*.email.unique'       => 'Email diễn giả đã tồn tại.',
            'tickets.*.price.required'      => 'Giá vé là bắt buộc.',
            'tickets.*.quantity.required'   => 'Số lượng vé là bắt buộc.',
        ];
    }
}
