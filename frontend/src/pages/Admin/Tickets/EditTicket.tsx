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
  
  const getEventName = (eventId: number) => {
    const event = events.find((e) => e.id === eventId);
    return event ? event.name : "Không xác định";
  };
  const [ticketTypesList] = useState(Object.values(TicketType));
  
  useEffect(() => {
    (async () => {
      const data = await getTicketsId(`${id}`);
      if (data) {
        
        const formattedData = {
          ...data,
          price: data.price.map((item: any) => ({
            ...item,
            price: Number(item.price), 
          })),
          sale_start: dayjs(data.price[0].sale_start).format("YYYY-MM-DD"),
          sale_end: dayjs(data.price[0].sale_end).format("YYYY-MM-DD"),
        };
        setTicket(formattedData);
        reset(formattedData);
      }
    })();
  }, [id, reset]);

  
  const onSubmit = (data: Tickets) => {
    const seatId = ticket?.price[0]?.seat_zone_id;
    
    if (seatId) {
      const formattedPrice = data.price.map((item: any) => ({
        ...item,
        price: parseFloat(item.price) || 0, 
      }));
      const formattedData = {
        ...data,
        price: formattedPrice[0].price,
        quantity: formattedPrice[0].quantity,
        sale_start: new Date(data.sale_start)
          .toISOString()
          .slice(0, 19)
          .replace("T", " "),
        sale_end: new Date(data.sale_end)
          .toISOString()
          .slice(0, 19)
          .replace("T", " "),
        id,
      };
      onEdit(formattedData, seatId);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-md p-8">
        <div className="grid grid-cols-1 md:grid-cols-10 gap-8">
          <div className="md:col-span-3">
            <h1 className="text-2xl font-bold mb-4">Thông tin vé</h1>
            {ticket ? (
              <ul className="space-y-2 mt-5">
                <li className="flex items-star">
                  <span className="font-semibold text-gray-700 w-32">
                    Sự kiện:
                  </span>
                  <span>
                    {ticket
                      ? getEventName(ticket.price[0].event_id)
                      : "Đang tải..."}
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-gray-700 w-32">
                    Loại vé:
                  </span>
                  <span>{ticket.ticket_type}</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-gray-700 w-32">Giá:</span>
                  <span>
                    {ticket.price ? ticket.price[0].price : "Chưa xác định"} VND
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-gray-700 w-32">
                    Vị trí:
                  </span>
                  <span>{ticket.price[0].zone.name || "N/A"}</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-gray-700 w-32">
                    Số lượng:
                  </span>
                  <span>{ticket.price[0].quantity}</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-gray-700 w-32">
                    Ngày bắt đầu:
                  </span>{" "}
                  {dayjs(ticket.price[0].sale_start).format("DD/MM/YYYY")}
                  <span></span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-gray-700 w-32">
                    Ngày kết thúc:
                  </span>{" "}
                  <span>
                    {dayjs(ticket.price[0].sale_end).format("DD/MM/YYYY")}
                  </span>
                </li>
              </ul>
            ) : (
              <p className="text-gray-500">Đang tải thông tin vé...</p>
            )}
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="md:col-span-7">
            <h2 className="text-2xl font-bold text-center mb-4">Cập nhật vé</h2>
            <div className="grid grid-cols-1 gap-6">
              
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
                  {...register("price.0.price", {
                    required: true,
                    setValueAs: (value) => parseFloat(value) || 0,
                  })}
                />
                {errors.price && (
                  <span className="text-red-500">Giá không hợp lệ</span>
                )}
              </div>

              
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
                  {...register("price[0].quantity", { required: true, min: 1 })}
                />
                {errors.quantity && (
                  <span className="text-red-500">Số lượng không hợp lệ</span>
                )}
              </div>

              
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
                />
                {errors.sale_start && (
                  <span className="text-red-500">
                    Ngày bắt đầu không hợp lệ
                  </span>
                )}
              </div>

             
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
                  <span className="text-red-500">
                    Ngày kết thúc không hợp lệ
                  </span>
                )}
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
                Danh sách vé
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTicket;
