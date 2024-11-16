<?php

namespace App\Http\Requests\Admin;

use App\Models\Event;
use Carbon\Carbon;
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
            'creator_id'        => ['required', 'integer', 'exists:users,id'],       
            'event_id'          => ['required', 'integer', 'exists:events,id'],       
            'status'            => ['nullable', 'in:draft,pending,published'],     
            'code'              => ['required', 'string', 'max:100', 'unique:vouchers,code'],  
            'discount_type'     => ['required', 'in:percent,fixed'],                 
            'discount_value'    => ['required', 'numeric', 'gt:0'],                        
            'min_order_value'   => ['nullable', 'numeric', 'gt:0'],                        
            'max_order_value'   => ['nullable', 'numeric', 'gt:0'],       
            'issue_quantity'    => ['required', 'integer'],                    
            'start_time'        => ['required', 'date', 'after_or_equal:today'], 
            'end_time'          => ['required', 'date', 'after:start_time'],   
            'used_limit'        => ['required', 'min:0', 'integer'],                       
        ];    
    }
    
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($this->event_id) {
                $event = Event::find($this->event_id);
                if (!in_array($event->status, ['pending', 'confirmed'])) {
                    $validator->errors()->add('event_id', 'Sự kiện có trạng thái không hợp lệ.');
                }
            }

            if ($this->discount_type === 'percent' && $this->discount_value > 100 && is_numeric($this->discount_value) ) {
                $validator->errors()->add('discount_value', 'Giá trị giảm giá loại phần trăm không được lớn hơn 100.');
            }
        });     
        
        $validator->sometimes('issue_quantity', 'gt:0', function ($input) {
            return is_numeric($input->issue_quantity);
        }); 

        $validator->after(function ($validator) {
            if ($this->used_limit == '-0') {
                $validator->errors()->add('used_limit', 'Giới hạn sử dụng mã giảm giá phải lớn hơn hoặc bằng 0.');
            }
        });
       
    }

    public function messages()
    {
        return [
            'creator_id.required'        => 'Người tạo mã giảm giá là bắt buộc.',
            'creator_id.integer'         => 'Người tạo mã giảm giá phải là số nguyên.',
            'creator_id.exists'          => 'Người tạo mã giảm giá không tồn tại.',

            'event_id.required'          => 'Vui lòng chọn sự kiện.',
            'event_id.integer'           => 'Sự kiện phải là một số nguyên.',
            'event_id.exists'            => 'Sự kiện không tồn tại.',

            'status.required'            => 'Vui lòng chọn trạng thái mã giảm giá.',
            'status.in'                  => 'Trạng thái mã giảm giá không hợp lệ.',

            'code.required'              => 'Mã giảm giá là bắt buộc.',
            'code.string'                => 'Mã giảm giá phải là chuỗi.',
            'code.unique'                => 'Mã giảm giá đã tồn tại.',
            'code.max'                   => 'Mã giảm giá không được vượt quá :max ký tự.',

            'discount_type.required'     => 'Vui lòng chọn loại giảm giá.',
            'discount_type.in'           => 'Loại giảm giá không hợp lệ.',

            'discount_value.required'    => 'Giá trị giảm giá là bắt buộc.',
            'discount_value.numeric'     => 'Giá trị giảm giá phải là số.',
            'discount_value.gt'          => 'Giá trị giảm giá phải lớn hơn 0.',
            
            'min_order_value.numeric'    => 'Giá trị vé tối thiểu phải là số.',
            'min_order_value.gt'         => 'Giá trị vé tối thiểu phải lớn hơn 0.',
            
            'max_order_value.numeric'    => 'Giá trị vé tối đa phải là số.',
            'max_order_value.gt'         => 'Giá trị vé tối đa phải lớn hơn 0.',

            'issue_quantity.required'    => 'Số lượng mã giảm giá được phát hành là bắt buộc.',
            'issue_quantity.integer'     => 'Số lượng mã giảm giá được phát hành phải là số nguyên.',
            'issue_quantity.gt'          => 'Số lượng mã giảm giá được phát hành phải lớn hơn 0.',

            'start_time.after_or_equal'  => 'Thời gian bắt đầu phát hành mã giảm giá phải sau hoặc bằng thời gian hiện tại.',
            'start_time.required'        => 'Thời gian bắt đầu phát hành mã giảm giá là bắt buộc.',
            'start_time.date'            => 'Thời gian bắt đầu phát hành mã giảm giá không hợp lệ.',

            'end_time.required'          => 'Thời gian kết thúc phát hành mã giảm giá là bắt buộc.',
            'end_time.after'             => 'Thời gian kết thúc phát hành mã giảm giá phải sau thời gian bắt đầu.',
            'end_time.date'              => 'Thời gian kết thúc phát hành mã giảm giá không hợp lệ.',

            'used_limit.required'        => 'Giới hạn sử dụng mã giảm giá là bắt buộc.',
            'used_limit.integer'         => 'Giới hạn sử dụng mã giảm giá phải là số nguyên.',
            'used_limit.min'             => 'Giới hạn sử dụng mã giảm giá phải là số dương.',
        ];
    }
}
