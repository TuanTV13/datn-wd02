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
        $startTime = $this->input('event.start_time');
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
            'event.location'                        => 'required|string|max:255',
            'event.event_type'                      => 'required|in:online,offline',
            'event.link_online'                     => 'nullable|url|active_url',
            'event.max_attendees'                   => 'required|integer|min:0',

            // Diễn giả
            'speakers'                              => 'nullable|array',
            'speakers.*.name'                       => 'required|string|max:255',
            'speakers.*.email'                      => 'required|email|unique:speakers,email',
            'speakers.*.phone'                      => 'required|string',
            'speakers.*.profile'                    => 'nullable|string',
            'speakers.*.image_url'                  => 'nullable|string',
            'event_images'                          => 'nullable|array',
            'event_images.*'                        => 'image|mimes:jpeg,png,jpg,gif|max:2048',

            // Vé
            'tickets'                               => 'nullable|array',
            'tickets.*.ticket_type_id'              => 'required|integer',
            'tickets.*.price'                       => 'required|numeric',
            'tickets.*.quantity'                    => 'required|integer|min:1',
            'tickets.*.available_quantity'          => 'nullable|integer',
            'tickets.*.seat_location'               => 'required|string',
            'tickets.*.sale_start'                  => 'required|date|before_or_equal:event.start_time',
            'tickets.*.sale_end'                    => 'required|date|after_or_equal:tickets.*.sale_start|before_or_equal:event.start_time',
            'tickets.*.description'                 => 'nullable|string',

        ];
    }

    public function messages ()
    {
        return [
            'event.max_attendees.min' => 'Số lượng người tham gia tối đa phải lớn hơn 0.',
        ];
    }
    
    public function attributes()
    {
        return [
            'event.category_id'                     => 'Danh mục sự kiện',
            'event.status_id'                       => 'Trạng thái',
            'event.province_id'                     => 'Tỉnh',
            'event.district_id'                     => 'Huyện',
            'event.ward_id'                         => 'Phường',
            'event.name'                            => 'Tên sự kiện',
            'event.description'                     => 'Mô tả sự kiện',
            'event.start_time'                      => 'Thời gian bắt đầu',
            'event.end_time'                        => 'Thời gian kết thúc',
            'event.location'                        => 'Địa điểm',
            'event.event_type'                      => 'Loại sự kiện',
            'event.max_attendees'                   => 'Số lượng người tham gia tối đa',

            'speakers.*.name'                       => 'Tên diễn giả',
            'speakers.*.email'                      => 'Email diễn giả',
            'speakers.*.phone'                      => 'Điện thoại diễn giả',
            'speakers.*.profile'                    => 'Hồ sơ diễn giả',
            'speakers.*.image_url'                  => 'Ảnh diễn giả',

            'event_images.*'                        => 'Hình ảnh sự kiện',

            'tickets.*.ticket_type_id'              => 'Loại vé',
            'tickets.*.price'                       => 'Giá vé',
            'tickets.*.quantity'                    => 'Số lượng vé',
            'tickets.*.available_quantity'          => 'Số lượng vé có sẵn',
            'tickets.*.seat_location'               => 'Vị trí ghế',
            'tickets.*.sale_start'                  => 'Thời gian bắt đầu bán vé',
            'tickets.*.sale_end'                    => 'Thời gian kết thúc bán vé',
            'tickets.*.description'                 => 'Mô tả vé',

            'tickets.*.vouchers.*.code'             => 'Mã voucher',
            'tickets.*.vouchers.*.discount_amount'  => 'Số tiền giảm giá',
            'tickets.*.vouchers.*.expiration_date'  => 'Ngày hết hạn voucher',
        ];
    }
}
