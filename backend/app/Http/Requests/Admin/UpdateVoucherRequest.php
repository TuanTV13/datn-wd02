<?php

namespace App\Http\Requests\Admin;

use App\Models\Event;
use App\Models\Ticket;
use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class UpdateVoucherRequest extends FormRequest
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
            'user_id'           => ['required', 'integer', 'exists:users,id'],       
            'event_id'          => ['required', 'integer', 'exists:events,id'],       
            'ticket_id'         => ['required', 'integer'],      
            'status_id'         => ['required', 'integer', 'exists:statuses,id'],     
            'code'              => ['required', 'string', 'max:100', 'unique:vouchers,code,' . $this->route('id')],  
            'discount_type'     => ['required', 'in:percent,fixed'],                 
            'discount_value'    => ['required', 'min:0', 'gt:0'],                        
            'min_ticket_value'  => ['nullable', 'min:0', 'gt:0'],                        
            'max_ticket_value'  => ['nullable', 'min:0', 'gt:0'],       
            'issue_quantity'    => ['required', 'min:0', 'gt:0', 'integer'],                    
            'start_time'        => ['required', 'date', 'after_or_equal:today'], 
            'end_time'          => ['required', 'date', 'after:start_time'],   
            'used_limit'        => ['required', 'min:0', 'gt:0', 'integer'],                       
        ];    
    }
    
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($this->event_id) {
                $event = Event::find($this->event_id);
                if (!in_array($event->status->key_name, ['draft', 'pending', 'published'])) {
                    $validator->errors()->add('event_id', 'Sự kiện có trạng thái không hợp lệ.');
                }
            }
            if ($this->ticket_id) {
                $ticket = Ticket::find($this->ticket_id);
                if (is_null($ticket)) {
                    $validator->errors()->add('ticket_id', 'Vé sự kiện không tồn tại.');
                } else if ($this->discount_type === 'fixed' && $this->discount_value > $ticket->price) {
                    $validator->errors()->add('discount_value', 'Giá trị giảm giá không được lớn hơn giá vé.');
                }
                if (!in_array($ticket->status->key_name, ['draft', 'release', 'comming_soon', 'available'])) {
                    $validator->errors()->add('ticket_id', 'Vé sự kiện có trạng thái không hợp lệ.');
                }
            }

            $this->checkNumericFields($validator, [
                'discount_value'   => 'Giá trị giảm giá phải là số.',
                'used_limit'       => 'Giá trị giới hạn sử dụng phải là số.',
                'issue_quantity'   => 'Gia trị số lượng mã giảm giá phải là số.',
                'min_ticket_value' => 'Giá trị vé tối thiểu phải là số.',
                'max_ticket_value' => 'Giá trị vé tối đa phải là số.',
            ]);

            if ($this->discount_type === 'percent' && $this->discount_value > 100) {
                $validator->errors()->add('discount_value', 'Giá trị giảm giá loại phần trăm không được lớn hơn 100.');
            }

            if (Carbon::parse($this->end_time)->isPast()) {
                $validator->errors()->add('end_time', 'Thời gian kết thúc phát hành mã giảm giá phải sau thời gian hiện tại.');
            }
        });        
    }

    protected function checkNumericFields($validator, array $fields)
    {
        foreach ($fields as $field => $message) {
            if ($this->input($field) !== null && !is_numeric($this->input($field))) {
                $validator->errors()->add($field, $message);
            }
        }
    }

    public function messages()
    {
        return [
            'user_id.required'           => 'Người tạo mã giảm giá là bắt buộc.',
            'user_id.integer'            => 'Người tạo mã giảm giá phải là số nguyên.',
            'user_id.exists'             => 'Người tạo mã giảm giá không tồn tại.',

            'event_id.required'          => 'Vui lòng chọn sự kiện.',
            'event_id.integer'           => 'Sự kiện phải là một số nguyên.',
            'event_id.exists'            => 'Sự kiện không tồn tại.',

            'ticket_id.required'         => 'Vui lòng chọn vé sự kiện.',
            'ticket_id.integer'          => 'Vé sự kiện phải là một số nguyên.',

            'status_id.required'         => 'Vui lòng chọn trạng thái mã giảm giá.',
            'status_id.integer'          => 'Trạng thái mã giảm giá phải là một số nguyên.',
            'status_id.exists'           => 'Trạng thái mã giảm giá không tồn tại.',

            'code.required'              => 'Mã giảm giá là bắt buộc.',
            'code.string'                => 'Mã giảm giá phải là chuỗi.',
            'code.max'                   => 'Mã giảm giá không được vượt quá :max ký tự.',
            'code.unique'                => 'Mã giảm giá đã tồn tại.',

            'discount_type.required'     => 'Vui lòng chọn loại giảm giá.',
            'discount_type.in'           => 'Loại giảm giá không hợp lệ.',

            'discount_value.required'    => 'Giá trị giảm giá là bắt buộc.',
            'discount_value.min'         => 'Giá trị giảm giá phải là số dương.',
            'discount_value.gt'          => 'Giá trị giảm giá phải lớn hơn 0.',
            
            'min_ticket_value.min'       => 'Giá trị vé tối thiểu phải là số dương.',
            'min_ticket_value.gt'        => 'Giá trị vé tối thiểu phải lớn hơn 0.',
            
            'max_ticket_value.min'       => 'Giá trị vé tối đa phải là số dương.',
            'max_ticket_value.gt'        => 'Giá trị vé tối đa phải lớn hơn 0.',

            'issue_quantity.required'    => 'Số lượng mã giảm giá được phát hành là bắt buộc.',
            'issue_quantity.integer'     => 'Số lượng mã giảm giá được phát hành phải là số nguyên.',
            'issue_quantity.min'         => 'Số lượng mã giảm giá được phát hành phải là số dương.',
            'issue_quantity.gt'          => 'Số lượng mã giảm giá được phát hành phải lớn hơn 0.',

            'start_time.required'        => 'Thời gian bắt đầu phát hành mã giảm giá là bắt buộc.',
            'start_time.date'            => 'Thời gian bắt đầu phát hành mã giảm giá không hợp lệ.',
            'start_time.after_or_equal'  => 'Thời gian bắt đầu phát hành mã giảm giá phải sau hoặc bằng thời gian hiện tại.',

            'end_time.required'          => 'Thời gian kết thúc phát hành mã giảm giá là bắt buộc.',
            'end_time.date'              => 'Thời gian kết thúc phát hành mã giảm giá không hợp lệ.',
            'end_time.after'             => 'Thời gian kết thúc phát hành mã giảm giá phải sau thời gian bắt đầu.',

            'used_limit.required'        => 'Giới hạn sử dụng mã giảm giá là bắt buộc.',
            'used_limit.integer'         => 'Giới hạn sử dụng mã giảm giá phải là số nguyên.',
            'used_limit.min'             => 'Giới hạn sử dụng mã giảm giá phải là số dương.',
            'used_limit.gt'              => 'Giới hạn sử dụng mã giảm giá phải lớn hơn 0.',
        ];
    }
}
