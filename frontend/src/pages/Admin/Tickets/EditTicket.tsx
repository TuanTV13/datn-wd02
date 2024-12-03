import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { TicketsCT } from "../../../Contexts/TicketContext";
import { useForm } from "react-hook-form";
import { Tickets, TicketType } from "../../../interfaces/Ticket";
import { getTicketsId } from "../../../api_service/ServiceTicket";
import { EventCT } from "../../../Contexts/ClientEventContext";
import dayjs from "dayjs";
const EditTicket = () => {
  const { onEdit, tickets } = useContext(TicketsCT);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Tickets>();
  const { id } = useParams();
  const [ticket, setTicket] = useState<Tickets | null>(null);

  useEffect(() => {
    (async () => {
      const data = await getTicketsId(`${id}`);
      setTicket(data);
      reset(data);
    })();
  }, []);

  const { events } = useContext(EventCT);
  // Lấy tên sự kiện từ danh sách sự kiện
  const getEventName = (eventId: number) => {
    const event = events.find((e) => e.id === eventId);
    return event ? event.name : "Không xác định";
  };
  const [ticketTypesList] = useState(Object.values(TicketType));
  // Lấy thông tin ticket khi component được render
  useEffect(() => {
    (async () => {
      const data = await getTicketsId(`${id}`);
      if (data) {
        // Định dạng ngày trước khi gán vào form
        const formattedData = {
          ...data,
          sale_start: dayjs(data.sale_start).format("YYYY-MM-DD"),
          sale_end: dayjs(data.sale_end).format("YYYY-MM-DD"),
        };
        setTicket(formattedData);
        reset(formattedData);
      }
    })();
  }, [id, reset]);

  // Xử lý cập nhật ticket
  const onSubmit = (data: Tickets) => {
    // Định dạng lại ngày giờ cho MySQL
    const formattedSaleStart = new Date(data.sale_start)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const formattedSaleEnd = new Date(data.sale_end)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    // Gọi onEdit với ngày giờ đã định dạng
    onEdit({
      ...data,
      sale_end: formattedSaleEnd,
      id,
    });
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
      <div className="bg-white p-6 shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Thông tin vé</h1>
        {ticket ? (
          <ul className="mt-4 list-disc list-inside text-gray-700">
            <li className="mb-3">
              <strong>Sự kiện:</strong> {ticket ? getEventName(ticket.event_id) : "Đang tải..."}
            </li>
            <li className="mb-3">
              <strong>Loại vé:</strong> {ticket.ticket_type}
            </li>
            <li className="mb-3">
              <strong>Giá:</strong> {ticket.price} VND
            </li>
            <li className="mb-3">
              <strong>Vị trí:</strong> {ticket.seat_location || "N/A"}
            </li>
            <li className="mb-3">
              <strong>Số lượng:</strong> {ticket.quantity}
            </li>
            <li className="mb-3">
              <strong>Ngày bắt đầu:</strong>{" "}
              {dayjs(ticket.sale_start).format("DD/MM/YYYY")}
            </li>
            <li className="mb-3">
              <strong>Ngày kết thúc:</strong>{" "}
              {dayjs(ticket.sale_end).format("DD/MM/YYYY")}
            </li>
            <li className="mb-3">
              <strong>Mô tả:</strong> {ticket.description || "Không có mô tả"}
            </li>
          </ul>
        ) : (
          <p className="text-gray-500">Đang tải thông tin vé...</p>
        )}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w mx-auto p-6 bg-white shadow-md rounded-lg"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Cập nhật vé</h2>
        <div className="grid-cols-1 sm:grid-cols-2 gap-6 ">
          {/* Trường sự kiện */}
          <div className="mb-3">
            <label
              htmlFor="event"
              className="block text-sm font-medium text-gray-700"
            >
              Sự kiện
            </label>
            <select
              id="event"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              {...register("event_id", { required: true })}
              disabled
            >
              <option value="">Chọn sự kiện</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.name}
                </option>
              ))}
            </select>
            {errors.event_id && (
              <span className="text-red-500">Vui lòng chọn sự kiện</span>
            )}
          </div>

          {/* Trường loại vé */}
          <div className="mb-3">
            <label
              htmlFor="ticket-type"
              className="block text-sm font-medium text-gray-700"
            >
              Loại vé
            </label>
            <select
              id="ticket-type"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              {...register("ticket_type", { required: true })}
              disabled
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
          <div className="mb-3">
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
          <div className="mb-3">
            <label
              htmlFor="seat_location"
              className="block text-sm font-medium text-gray-700"
            >
              Vị trí
            </label>
            <input
              type="text"
              id="seat_location"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              {...register("seat_location", { required: true })}
              readOnly
            />
            {errors.seat_location && (
              <span className="text-red-500">Vị trí không hợp lệ</span>
            )}
          </div>

          {/* Trường số lượng vé */}
          <div className="mb-3">
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
          <div className="mb-3">
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
              readOnly
            />
            {errors.sale_start && (
              <span className="text-red-500">Ngày bắt đầu không hợp lệ</span>
            )}
          </div>

          {/* Trường ngày kết thúc */}
          <div className="mb-3">
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

          {/* Trường mô tả */}
          <div className="sm:col-span-2 mb-3">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
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
  );
};

export default EditTicket;
