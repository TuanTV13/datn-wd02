import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { TicketsCT } from '../../../Contexts/TicketContext';
import { useForm } from 'react-hook-form';
import { Tickets } from '../../../interfaces/Ticket';
import { getEvents } from '../../../api_service/event';
import { getTicketsId } from '../../../api_service/ServiceTicket';

const EditTicket = () => {
  const { onEdit} = useContext(TicketsCT); 
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<Tickets>();
  const { id } = useParams();
  const [ticket, setTicket] = useState<Tickets | null>(null);
  const onSubmit = (data: Tickets) => {
    onEdit({...data, id}); 
  };
  useEffect(() => {
    (async () => {
      const data = await getTicketsId(`${id}`);
      setTicket(data);
      reset(data)
    })();
  },[])

  const [list, setList] = useState<{ id: number; name: string }[]>([]); // Danh sách sự kiện

  // Gọi API để lấy danh sách sự kiện từ backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getEvents();
        // Kiểm tra xem dữ liệu có trường 'data' và là mảng không
        if (response && Array.isArray(response.data)) {
          setList(response.data); // Cập nhật danh sách sự kiện từ API
        } else {
          console.error('Dữ liệu trả về không phải là mảng:', response);
          setList([]); // Đặt list về mảng rỗng nếu không phải mảng
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu sự kiện:', error);
      }
    };
    fetchEvents();
  }, []);
  return (
<div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w mx-auto p-6 bg-white shadow-md rounded-lg"
      >
        <h2 className="text-2xl font-bold text-center mb-5">Cập nhật vé</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="ticket-code" className="block text-sm font-medium text-gray-700">
              Mã vé
            </label>
            <input
              type="text"
              id="ticket-code"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              {...register("id", { required: true })}
            />
            {errors.id && (
              <span className="text-red-500">Mã vé không được bỏ trống</span>
            )}
          </div>

          <div>
            <label htmlFor="ticket-price" className="block text-sm font-medium text-gray-700">
              Giá vé
            </label>
            <input
              type="number"
              id="price"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              {...register("price", { required: true, min: 0 })}
            />
            {errors.price && <span className="text-red-500">Giá không hợp lệ</span>}
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
              Số lượng vé
            </label>
            <input
              type="number"
              id="quantity"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              {...register("quantity", { required: true, min: 1 })}
            />
            {errors.quantity && <span className="text-red-500">Số lượng không hợp lệ</span>}
          </div>

          <div>
            <label htmlFor="available_quantity" className="block text-sm font-medium text-gray-700">
              Số lượng vé có sẵn
            </label>
            <input
              type="number"
              id="available_quantity"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              {...register("available_quantity", { required: true, min: 1 })}
            />
            {errors.available_quantity && (
              <span className="text-red-500">Số lượng có sẵn không hợp lệ</span>
            )}
          </div>

          <div>
            <label htmlFor="event" className="block text-sm font-medium text-gray-700">
              Sự kiện
            </label>
            <select
              id="event"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              {...register("event_id", { required: true })}
            >
              <option value="">Chọn sự kiện</option>
              {list.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.name}
                </option>
              ))}
            </select>
            {errors.event_id && <span className="text-red-500">Vui lòng chọn sự kiện</span>}
          </div>

          <div>
            <label htmlFor="ticket-type" className="block text-sm font-medium text-gray-700">
              Loại vé
            </label>
            <select
              id="ticket_type"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              {...register("ticket_type", { required: true })}
            >
              <option value="VIP">VIP</option>
              <option value="Standard">Standard</option>
              <option value="Economy">Economy</option>
            </select>
            {errors.ticket_type && <span className="text-red-500">Vui lòng chọn loại vé</span>}
          </div>

          <div>
            <label htmlFor="sale_start" className="block text-sm font-medium text-gray-700">
              Ngày bắt đầu
            </label>
            <input
              type="date"
              id="sale_start"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              {...register("sale_start", { required: true })}
            />
            {errors.sale_start && <span className="text-red-500">Ngày bắt đầu không hợp lệ</span>}
          </div>

          <div>
            <label htmlFor="sale_end" className="block text-sm font-medium text-gray-700">
              Ngày kết thúc
            </label>
            <input
              type="date"
              id="sale_end"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              {...register("sale_end", { required: true })}
            />
            {errors.sale_end && <span className="text-red-500">Ngày kết thúc không hợp lệ</span>}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Mô tả
            </label>
            <textarea
              id="description"
              rows={3}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              {...register("description")}
              placeholder="Mô tả của bạn ....."
            ></textarea>
          </div>
        </div>

        <div className="mt-6 flex justify-start space-x-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Lưu
          </button>
          <Link
            to="/admin/ticket-list"
            className="px-6 py-2 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Quay lại
          </Link>
        </div>
      </form>
    </div>
  )
}

export default EditTicket
