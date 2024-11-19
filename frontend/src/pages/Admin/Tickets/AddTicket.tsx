import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TicketsCT } from "../../../Contexts/TicketContext";
import { useForm } from "react-hook-form";
import { Tickets, TicketType } from "../../../interfaces/Ticket";
import { EventCT } from "../../../Contexts/ClientEventContext";
import { getTicketData } from "../../../api_service/ServiceTicket";

const AddTicket = () => {
  const { onAdd } = useContext(TicketsCT);
  const { events } = useContext(EventCT);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<Tickets>();

  const [ticketTypesList] = useState(Object.values(TicketType));
  const [ticketData, setTicketData] = useState<any>(null);

  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [selectedTicketType, setSelectedTicketType] = useState<string | null>(
    null
  );

  // Hàm gọi API để lấy dữ liệu vé
  const fetchTicketData = async (eventId: number, ticketType: string) => {
    try {
      const data = await getTicketData(eventId, ticketType);
      setTicketData(data); // Lưu dữ liệu từ API

      // Nếu có dữ liệu trả về, điền các giá trị vào form
      if (data) {
        setValue("price", data.price || ""); // Điền giá vé vào form
        setValue("quantity", data.quantity || 1); // Điền số lượng vào form
        setValue("sale_start", formatDate(data.sale_start)); // Điền ngày bắt đầu
        setValue("sale_end", formatDate(data.sale_end)); // Điền ngày kết thúc
        setValue("seat_location", data.seat_location || "");
      } else {
        // Nếu không có dữ liệu trả về, reset form
        reset();
      }
    } catch (error) {
      console.log("Error fetching ticket data:", error);
      reset(); // Nếu có lỗi trong việc gọi API, reset form
    }
  };

  // Hàm chuyển đổi định dạng ngày
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // Trả về định dạng yyyy-mm-dd
  };

  // Gọi API khi sự kiện và loại vé thay đổi
  useEffect(() => {
    if (selectedEventId && selectedTicketType) {
      fetchTicketData(selectedEventId, selectedTicketType);
    }
  }, [selectedEventId, selectedTicketType]); // Chỉ gọi lại khi thay đổi sự kiện hoặc loại vé

  const onSubmit = (data: Tickets) => {
    onAdd(data); // Xử lý khi người dùng gửi form
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
          <div>
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
              onChange={(e) => setSelectedEventId(Number(e.target.value))} // Cập nhật sự kiện đã chọn
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
          <div>
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
              onChange={(e) => setSelectedTicketType(e.target.value)} // Cập nhật loại vé đã chọn
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
            />
            {errors.seat_location && (
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

          {/* Trường mô tả */}
          <div className="sm:col-span-2">
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

        {/* Các nút thao tác */}
        <div className="mt-6 flex justify-start space-x-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Thêm mới
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

export default AddTicket;
