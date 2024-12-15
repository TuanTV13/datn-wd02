import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TicketsCT } from "../../../Contexts/TicketContext";
import { useForm } from "react-hook-form";
import { StatusType, Tickets, TicketType } from "../../../interfaces/Ticket";

const AddTicket = (props: any) => {
  const { onAdd, events } = useContext(TicketsCT);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Tickets>();

  const [ticketTypesList] = useState(Object.values(TicketType));

  const onSubmit = (data: Tickets) => {
    const eventId = props.eventId || data.event_id;
    if (!eventId) {
      navigate("/admin/ticket-list");
    }
    onAdd({ ...data, event_id: eventId }); // Xử lý khi người dùng gửi form
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w mx-auto p-6 bg-white shadow-md rounded-lg"
      >
        <h2 className="text-2xl font-bold text-center mb-5">Thêm mới vé</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Trường sự kiện */}
          {!props.eventId && (
            <div>
              <label
                htmlFor="event"
                className="block text-sm font-medium text-gray-700"
              >
                Sự kiện
              </label>
              <select
                id="event_id"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                {...register("event_id", { required: true })}
              >
                <option value="">Chọn sự kiện</option>
                {events?.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name}
                  </option>
                ))}
              </select>
              {errors.event_id && (
                <span className="text-red-500">Vui lòng chọn sự kiện</span>
              )}
            </div>
          )}

          {/* Trường loại vé */}
          <div>
            <label
              htmlFor="ticket_type"
              className="block text-sm font-medium text-gray-700"
            >
              Loại vé
            </label>
            <select
              id="ticket_type"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              {...register("ticket_type", { required: true })}
            >
              <option value="">Chọn loại vé</option>
              {ticketTypesList.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.ticket_type && (
              <span className="text-red-500">Vui lòng chọn loại vé</span>
            )}
          </div>

          {/* Trường giá vé */}
          <div>
            <label
              htmlFor="ticket-price"
              className="block text-sm font-medium text-gray-700"
            >
              Giá vé
            </label>
            <input
              type="number"
              id="price"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              {...register("price", { required: true, min: 0 })}
            />
            {errors.price && (
              <span className="text-red-500">Giá không hợp lệ</span>
            )}
          </div>

          {/* Trường vị trí */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Vị trí
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              {...register("name", { required: true })}
            />
            {errors.name && (
              <span className="text-red-500">Vị trí không hợp lệ</span>
            )}
          </div>

          {/* Trường số lượng vé */}
          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700"
            >
              Số lượng vé
            </label>
            <input
              type="number"
              id="quantity"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              {...register("quantity", { required: true, min: 1 })}
            />
            {errors.quantity && (
              <span className="text-red-500">Số lượng không hợp lệ</span>
            )}
          </div>

          {/* Trường ngày bắt đầu */}
          <div>
            <label
              htmlFor="sale_start"
              className="block text-sm font-medium text-gray-700"
            >
              Ngày bắt đầu
            </label>
            <input
              type="date"
              id="sale_start"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              {...register("sale_start", { required: true })}
            />
            {errors.sale_start && (
              <span className="text-red-500">Ngày bắt đầu không hợp lệ</span>
            )}
          </div>

          {/* Trường ngày kết thúc */}
          <div>
            <label
              htmlFor="sale_end"
              className="block text-sm font-medium text-gray-700"
            >
              Ngày kết thúc
            </label>
            <input
              type="date"
              id="sale_end"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              {...register("sale_end", { required: true })}
            />
            {errors.sale_end && (
              <span className="text-red-500">Ngày kết thúc không hợp lệ</span>
            )}
          </div>

          <div>
            <label
              htmlFor="purchase_limit"
              className="block text-sm font-medium text-gray-700"
            >
              Giới hạn lượt mua của mỗi người
            </label>
            <input
              type="number"
              id="purchase_limit"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              {...register("purchase_limit", { required: true, min: 0 })}
            />
            {errors.purchase_limit && (
              <span className="text-red-500">Giới hạn không hợp lệ</span>
            )}
          </div>
        </div>

        {/* Các nút thao tác */}
        <div className="mt-6 flex justify-start space-x-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Thêm mới
          </button>
          {!props.eventId && (
            <Link
              to="/admin/ticket-list"
              className="px-6 py-2 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Danh sách vé
            </Link>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddTicket;
