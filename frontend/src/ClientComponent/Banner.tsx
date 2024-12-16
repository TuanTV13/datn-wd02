import React, { useContext, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { HomeCT } from "../Contexts/HomeContext";
import { Events } from "../interfaces/Event";
import { Link, useNavigate } from "react-router-dom";
import api from "../api_service/api";

interface SlideType {
  type: "image" | "text";
  src?: string;
  alt?: string;
  content?: JSX.Element;
}

interface Tickets {
  id: number;
  ticket_type: string;
  price: number;
  sold_quantity: number;
  quantity: number;
  zone: Zone[];
  ticket: Ticket;
}
interface Event {
  id: number;
  name: string;
  description: string;
  tickets: Tickets[];
  status: string;
}
interface Zone {
  id: number;
  name: string;
}
interface Ticket {
  id: number;
  status: string;
  ticket_type: string;
}

const Banner = () => {
  const { headerEvents } = useContext(HomeCT);
  const [event, setEvent] = useState<Event | null>(null);
  const [selectedVIPTicket, setSelectedVIPTicket] = useState<Tickets | null>(
    null
  );
  const [vipTicketQuantity, setVIPTicketQuantity] = useState(1);
  const [selectedRegularTicket, setSelectedRegularTicket] =
    useState<Tickets | null>(null);
  const [regularTicketQuantity, setRegularTicketQuantity] = useState(1);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

  // Hàm khi nhấn vào nút "Mua vé"
  const handleShowPopup = (eventId: any) => {
    setSelectedEventId(eventId);
    setShowPopup(true); // Hiển thị popup
  };
  useEffect(() => {
    if (selectedEventId) {
      // Gọi API lấy chi tiết sự kiện
      api
        .get(`/clients/events/${selectedEventId}`)
        .then((response) => {
          console.log(response.data.data);
          setEvent(response.data.data); // Lưu chi tiết sự kiện vào state
        })
        .catch((error) => {
          console.error("Error fetching event details", error);
        });
    }
  }, [selectedEventId]);
  const navigate = useNavigate();

  const handleBuyTicketClick = () => {
    const tickets = [];
    let totalAmount = 0;

    if (selectedVIPTicket && vipTicketQuantity > 0) {
      const vipTicketTotalPrice = selectedVIPTicket.price * vipTicketQuantity;
      tickets.push({
        ticket_id: selectedVIPTicket.ticket.id,
        ticket_type: "VIP",
        quantity: vipTicketQuantity,
        seat_zone_id: selectedVIPTicket?.zone?.id,
        seat_zone: selectedVIPTicket?.zone?.name,
        original_price: selectedVIPTicket?.price,
      });
      totalAmount += vipTicketTotalPrice;
    }

    if (selectedRegularTicket && regularTicketQuantity > 0) {
      const regularTicketTotalPrice =
        selectedRegularTicket.price * regularTicketQuantity;
      tickets.push({
        ticket_id: selectedRegularTicket.ticket.id,
        ticket_type: "Thường",
        quantity: regularTicketQuantity,
        seat_zone_id: selectedRegularTicket?.zone?.id,
        seat_zone: selectedRegularTicket?.zone?.name,
        original_price: selectedRegularTicket?.price,
      });
      totalAmount += regularTicketTotalPrice;
    }

    if (tickets.length > 0) {
      const ticketData = { tickets: tickets, totalPrice: totalAmount };
      console.log(ticketData);
      navigate("/checkout", { state: ticketData });
    } else {
      alert("Vui lòng chọn ít nhất một loại vé.");
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };
  const slides: SlideType[] = headerEvents?.map((event: Events) => ({
    type: "text",
    content: (
      <div
        className="lg:h-[600px] h-[300px] pl-16 flex flex-col md:flex-row items-center bg-gradient-to-r from-[#007BFF] to-[#F5F5F5] px-4 py-16 relative"
        style={{
          backgroundImage: `url(${event.thumbnail})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Lớp phủ nền mờ */}
        <div className="absolute inset-0 bg-black/40 z-0"></div>

        <div className="md:w-1/2 lg:ml-10 relative z-10">
          <h1 className="lg:text-[40px] md:text-5xl font-medium mb-4 text-white transition-all duration-500 ease-in-out transform hover:scale-105">
            {event.name}
          </h1>
          <div className="flex justify-center md:justify-start lg:ml-5">
            <Link
              to={`/event-detail/${event.id}`}
              className="bg-gradient-to-r from-[#6ea2f0] to-[#8542f1] text-white py-2 px-6 rounded-full hover:bg-gradient-to-r hover:from-[#6610F2] hover:to-[#0DCAF0] shadow-lg transition-all duration-300 transform hover:scale-105 opacity-80"
            >
              Chi tiết sự kiện
            </Link>
            <button
              onClick={() => handleShowPopup(event.id)}
              className="ml-4 bg-gradient-to-r from-[#00c6ff] to-[#0072ff] text-white py-2 px-8 rounded-full hover:bg-gradient-to-r hover:from-[#0072ff] hover:to-[#00c6ff] shadow-xl transition-all duration-300 transform hover:scale-110 border-2 border-white"
            >
              Mua vé
            </button>
          </div>
        </div>
      </div>
    ),
  }));

  return (
    <div className="w-full mt-36 mb-4">
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, pauseOnMouseEnter: false }}
        loop={true}
        allowTouchMove={true}
        className="lg:h-[600px] h-[300px]"
      >
        {slides?.map((slide, index) => (
          <SwiperSlide key={index}>
            {slide.type === "text" ? (
              slide.content
            ) : (
              <img
                src={slide.src}
                alt={slide.alt}
                className="w-full h-[300px] lg:h-[600px] max-h-full object-cover"
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[700px]">
            <h2 className="text-2xl font-bold mb-4">Chọn vé</h2>
            <h2 className="text-2xl font-bold mb-4 text-blue-500">
              Sự kiện: {event?.name}
            </h2>

            {/* Nhóm vé VIP */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-indigo-700 mb-4">Vé VIP</h3>
              <select
                value={selectedVIPTicket?.id || ""}
                onChange={(e) => {
                  const selected =
                    event?.tickets.find(
                      (ticket) => ticket.id === parseInt(e.target.value)
                    ) || null;
                  setSelectedVIPTicket(selected);
                  setVIPTicketQuantity(1); // Đặt lại số lượng vé VIP khi chọn vé mới
                }}
                className="border p-2 rounded w-full"
              >
                <option value="">Chọn khu vực</option>
                {event?.tickets
                  .filter((ticket) => ticket.ticket.ticket_type === "VIP")
                  .map((ticket) => (
                    <option key={ticket.id} value={ticket.id}>
                      Khu vực: {ticket.zone.name || "N/A"} - Giá:{" "}
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(ticket.price)}
                      - Số lượng còn lại: {ticket.sold_quantity}
                    </option>
                  ))}
              </select>

              {selectedVIPTicket && (
                <div className="mt-4">
                  <label className="block text-sm font-bold mb-2">
                    Số lượng
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={Math.min(
                      10,
                      (selectedVIPTicket.quantity || 0) -
                        (selectedVIPTicket.sold_quantity || 0)
                    )}
                    value={vipTicketQuantity}
                    onChange={(e) =>
                      setVIPTicketQuantity(Number(e.target.value))
                    }
                    className="border p-2 rounded w-full"
                  />
                </div>
              )}
            </div>

            {/* Nhóm vé Thường */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-indigo-700 mb-4">
                Vé Thường
              </h3>
              <select
                value={selectedRegularTicket?.id || ""}
                onChange={(e) => {
                  const selected =
                    event?.tickets.find(
                      (ticket) => ticket.id === parseInt(e.target.value)
                    ) || null;
                  setSelectedRegularTicket(selected);
                  setRegularTicketQuantity(1); // Đặt lại số lượng vé Thường khi chọn vé mới
                }}
                className="border p-2 rounded w-full"
              >
                <option value="">Chọn khu vực</option>
                {event?.tickets
                  .filter((ticket) => ticket.ticket.ticket_type === "Thường")
                  .map((ticket) => (
                    <option key={ticket.id} value={ticket.id}>
                      Khu vực: {ticket.zone.name || "N/A"} - Giá:{" "}
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(ticket.price)}
                      - Số lượng còn lại: {ticket.sold_quantity}
                    </option>
                  ))}
              </select>

              {selectedRegularTicket && (
                <div className="mt-4">
                  <label className="block text-sm font-bold mb-2">
                    Số lượng
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={Math.min(
                      10,
                      selectedRegularTicket.quantity -
                        selectedRegularTicket.sold_quantity
                    )}
                    value={regularTicketQuantity}
                    onChange={(e) =>
                      setRegularTicketQuantity(Number(e.target.value))
                    }
                    className="border p-2 rounded w-full"
                  />
                </div>
              )}
            </div>

            {/* Nút Mua vé và Đóng */}
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={handleClosePopup}
                className="bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-600"
              >
                Đóng
              </button>

              <button
                onClick={handleBuyTicketClick}
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
                disabled={
                  (!selectedVIPTicket && !selectedRegularTicket) ||
                  (selectedVIPTicket && vipTicketQuantity < 1) ||
                  (selectedRegularTicket && regularTicketQuantity < 1)
                }
              >
                Mua vé
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banner;
