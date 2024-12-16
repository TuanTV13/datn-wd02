import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HomeCT } from "../../Contexts/HomeContext";
import api from "../../api_service/api";
import { toast } from "react-toastify";

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
const ItemEven = () => {
  const [filter, setFilter] = useState("Mới nhất");
  const [showUpcoming, setShowUpcoming] = useState(false);
  const [showFeatured, setShowFeatured] = useState(false);
  const [showRatedEvents, setShowRatedEvents] = useState(false);
  const { upcomingEvents, featuredEvents, topRatedEvents } = useContext(HomeCT);

  // Lấy danh sách các thành phố duy nhất từ trường location của sự kiện
  const cities = [
    "Mới nhất",
    ...new Set(upcomingEvents.map((event) => event.province)),
  ];
  const displayedCities = cities.slice(0, 4);
  const filteredEvents = upcomingEvents.filter((event) => {
    const normalizedProvince = event.province.toLowerCase();
    const normalizedFilter = filter.toLowerCase();

    if (normalizedFilter === "mới nhất") return true;
    return normalizedProvince === normalizedFilter;
  });
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
          setEvent(response.data.data); // Lưu chi tiết sự kiện vào state
        })
        .catch((error) => {
          console.error("Error fetching event details", error);
        });
    }
  }, [selectedEventId]);
  const navigate = useNavigate();

  const handleBuyTicketClick = () => {
    if (event?.status === "checkin") {
      toast.error("Sự kiện đang check-in nên không mua được vé");
    } else {
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
        const ticketData = { eventId: event?.id,tickets: tickets, totalPrice: totalAmount };
        console.log(ticketData);
        navigate("/checkout", { state: ticketData });
      } else {
        alert("Vui lòng chọn ít nhất một loại vé.");
      }
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };
  return (
    <div>
      {/* 1 */}
      <div className="lg:w-[1400px] mx-auto sm:w-[95vw] mb:w-[342px] flex flex-col lg:mt-10 lg:pt-12 mb:pt-10">
        <strong className="lg:text-3xl mb:text-4xl lg:leading-10 mb:leading-12 ml-2 font-semibold text-gray-800">
          SỰ KIỆN SẮP DIỄN RA
        </strong>

        <div className="flex lg:mt-8">
          <div className="overflow-x-auto w-full">
            <ul className="flex space-x-6 w-max px-4 mb-4 mt-6">
              {displayedCities.map((city) => (
                <li
                  key={city}
                  className={`px-6 py-3 text-sm font-medium ${
                    filter === city
                      ? "bg-[#E1F5FE] text-[#007BFF] border-[#007BFF]"
                      : "hover:bg-[#F2F6F9] hover:text-[#6C757D] border-[#ddd]"
                  } rounded-full border cursor-pointer transition-all duration-200`}
                  onClick={() => setFilter(city)}
                >
                  <Link to="#">{city}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid lg:pt-8 lg:pb-12 mb:pb-16 lg:grid-cols-4 gap-8 mx-12 mt-6">
          {upcomingEvents && upcomingEvents?.length > 0 ? (
            filteredEvents
              .slice(0, showUpcoming ? filteredEvents.length : 4)
              .map((event) => (
                <div
                  key={event.id}
                  className="w-full mb-6 lg:w-[300px] lg:h-[540px] border border-transparent hover:border-[#007BFF] rounded-xl p-6 bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:bg-gradient-to-r hover:from-[#c6e1fe] hover:to-[#F5F5F5] flex flex-col"
                >
                  <Link
                    to={`/event-detail/${event.id}`}
                    className="mb-4 overflow-hidden"
                  >
                    <img
                      src={event.thumbnail || ""}
                      alt={event.name}
                      className="h-[180px] w-full rounded-xl object-cover transition-all duration-300 hover:rounded-none hover:scale-105"
                    />
                  </Link>
                  <div className="text-sm text-gray-700 flex-1">
                    <p className="line-clamp-1">{event.location}</p>
                    <p className="mt-2 text-lg font-semibold line-clamp-1">
                      <Link
                        to={`/event-detail/${event.id}`}
                        className="text-[#007BFF] hover:underline"
                      >
                        {event.name}
                      </Link>
                    </p>
                    <p className="mt-3 text-gray-500 text-sm">
                      Thành phố tổ chức: {event.province}
                    </p>
                    <p className="mt-2 text-gray-500 text-sm line-clamp-1">
                      Diễn giả:{" "}
                      {event.speakers &&
                      JSON.parse(event.speakers).length > 0 ? (
                        JSON.parse(event.speakers).map((speaker, index) => (
                          <span key={index} className="inline-block mr-2">
                            {speaker.name}
                            {index < JSON.parse(event.speakers).length - 1 &&
                              ","}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500">Không có diễn giả</span>
                      )}
                    </p>
                    <p className="mt-3 text-gray-500 text-sm">
                      Sự kiện diễn ra : {event.event_type}
                    </p>
                  </div>

                  <div className="text-xs mb-2">
                    <button
                      onClick={() => handleShowPopup(event.id)}
                      className="mt-2 w-[100px] h-[30px] bg-blue-400 hover:bg-blue-700 text-white font-semibold rounded-md mx-auto block"
                    >
                      Mua vé
                    </button>
                  </div>

                  <div className="flex justify-between items-center text-xs text-gray-600 border-t pt-3 mt-4">
                    <div className="flex items-center space-x-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 4h10M5 7v14h14V7M5 11h14"
                        />
                      </svg>
                      <span>{event.start_time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0="
                        />
                      </svg>
                      <span>{event.max_attendees}</span>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center w-full text-gray-500 py-8">
              Không có sự kiện nào sắp diễn ra
            </div>
          )}
        </div>

        <div className="flex justify-center mt-4">
          <button
            onClick={() => setShowUpcoming(!showUpcoming)}
            className="p-2 text-white bg-[#007BFF] rounded-lg w-40 hover:bg-[#0f00b3] border"
          >
            {showUpcoming ? "Ẩn bớt sự kiện" : "Xem tất cả sự kiện"}
          </button>
        </div>
      </div>

      {/* 2 */}
      <div className="lg:w-[1400px] mx-auto sm:w-full mb:w-full flex flex-col lg:mt-[10px] lg:pt-12 mb:pt-[39px] mt-4 mb-4">
        <strong className="lg:text-[30px] mb:text-[32px] lg:leading-[30px] mb:leading-[40px] xm:mt-5 ml-2">
          SỰ KIỆN NỔI BẬT
        </strong>

        <div className="grid lg:pt-16 lg:pb-[50px] mb:pb-[61px] lg:grid-cols-[250px_250px_250px_250px_250px] gap-4 gap-y-8 mb:gap-y-4 mx-12 md:grid-cols-2 mt-4">
          {featuredEvents && featuredEvents.length > 0 ? (
            featuredEvents
              .slice(0, showFeatured ? featuredEvents.length : 5)
              .map((event) => (
                <div
                  key={event.id}
                  className="w-full h-auto mb-4 lg:w-[250px] lg:h-[320px] border border-gray-300 rounded-[12px] p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:bg-gradient-to-r hover:from-[#c6e1fe] hover:to-[#F5F5F5]"
                >
                  <div className="w-full h-[140px] mb-3">
                    <Link to={"/event-detail/" + event.id}>
                      <img
                        src={event.thumbnail || ""}
                        alt={event.name}
                        className="h-full w-full rounded-[12px] object-cover transition-all duration-300 hover:rounded-none hover:scale-105"
                      />
                    </Link>
                  </div>
                  <div className="text-xs text-gray-700 mb-4 h-24">
                    <p className="pt-2 line-clamp-1">{event.location}</p>
                    <p className="mt-1 line-clamp-1">
                      <Link
                        to={"/event-detail/" + event.id}
                        className="text-sm font-semibold hover:text-[#007BFF]"
                      >
                        {event.name}
                      </Link>
                    </p>
                    <p className="mt-2 line-clamp-1">
                      Thành phố tổ chức: {event.province}
                    </p>
                    <p className="mt-2 line-clamp-1">
                      Diễn giả:{" "}
                      {event.speakers &&
                      JSON.parse(event.speakers).length > 0 ? (
                        JSON.parse(event.speakers).map((speaker, index) => (
                          <span key={index} className="inline-block mr-2">
                            {speaker.name}
                            {index < JSON.parse(event.speakers).length - 1 &&
                              ","}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500">Không có diễn giả</span>
                      )}
                    </p>
                    <p className="mt-2 line-clamp-1">
                      Sự kiện diễn ra: {event.event_type}
                    </p>
                  </div>
                  <div className="text-xs mb-2 mt-5">
                    <button
                      onClick={() => handleShowPopup(event.id)}
                      className="mt-2 w-[100px] h-[30px] bg-blue-400 hover:bg-blue-700 text-white font-semibold rounded-md mx-auto block"
                    >
                      Mua vé
                    </button>
                  </div>

                  <div className="flex justify-between items-center text-xs text-gray-600 border-t pt-2">
                    <div className="flex items-center space-x-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 4h10M5 7v14h14V7M5 11h14"
                        />
                      </svg>
                      <span>{event.start_time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                        />
                      </svg>
                      <span>{event.max_attendees}</span>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <p className="text-center text-gray-500 mt-4">
              Không tìm thấy sự kiện nào nổi bật.
            </p>
          )}
        </div>
        <div className="flex justify-center mt-2">
          <button
            onClick={() => setShowFeatured(!showFeatured)}
            className="p-2 text-white bg-[#007BFF] rounded-lg w-40 hover:bg-[#0f00b3] border"
          >
            {showFeatured ? "Ẩn bớt sự kiện" : "Xem tất cả sự kiện"}
          </button>
        </div>
      </div>

      {/* 3 */}
      <div className="lg:w-[1400px] mx-auto sm:w-full mb:w-full flex flex-col lg:mt-[10px] lg:pt-12 mb:pt-[39px] mt-4 mb-4">
        <strong className="lg:text-[36px] mb:text-[40px] lg:leading-[36px] mb:leading-[48px] xm:mt-5 ml-2">
          SỰ KIỆN ĐƯỢC ĐÁNH GIÁ CAO
        </strong>

        <div className="grid lg:pt-16 lg:pb-[50px] mb:pb-[61px] lg:grid-cols-4 gap-y-8 mb:gap-y-4 mx-12 mt-4">
          {topRatedEvents?.length > 0 ? (
            topRatedEvents
            .slice(0, showRatedEvents ? topRatedEvents.length : 4)
            .map((event) => (
              <div
                key={event.id}
                className="w-full h-auto mb-4 lg:w-[300px] lg:h-[350px] border border-gray-300 rounded-[16px] p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:bg-gradient-to-r hover:from-[#c6e1fe] hover:to-[#F5F5F5]"
              >
                <div className="w-full h-[180px] mb-4">
                  <Link to={"/event-detail/" + event.id}>
                    <img
                      src={event.thumbnail || ""}
                      alt={event.name}
                      className="w-full h-full rounded-[16px] object-cover transition-all duration-300 hover:rounded-none hover:scale-105"
                    />
                  </Link>
                </div>
                <div className="text-sm text-gray-700 mb-4 h-32">
                  <p className="pt-2 line-clamp-1">{event.location}</p>
                  <p className="mt-1 line-clamp-1">
                    <Link
                      to={"/event-detail/" + event.id}
                      className="text-lg font-semibold hover:text-[#007BFF]"
                    >
                      {event.name}
                    </Link>
                  </p>
                  <p className="mt-2 line-clamp-1">Thành phố tổ chức: {event.province}</p>
                  <p className="mt-2 line-clamp-1">
                    Diễn giả:{" "}
                    {event.speakers && JSON.parse(event.speakers).length > 0 ? (
                      JSON.parse(event.speakers).map((speaker, index) => (
                        <span key={index} className="inline-block mr-2">
                          {speaker.name}
                          {index < JSON.parse(event.speakers).length - 1 && ","}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">Không có diễn giả</span>
                    )}
                  </p>
                  <p className="mt-2">Sự kiện diễn ra: {event.event_type}</p>
                </div>
                <div className="text-xs mb-2 mt-2">
                  <button
                    onClick={() => handleShowPopup(event.id)}
                    className="mt-2 w-[100px] h-[30px] bg-blue-400 hover:bg-blue-700 text-white font-semibold rounded-md mx-auto block"
                  >
                    Mua vé
                  </button>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600 border-t pt-4">
                  <div className="flex items-center space-x-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 4h10M5 7v14h14V7M5 11h14"
                      />
                    </svg>
                    <span>{event.start_time}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                      />
                    </svg>
                    <span>{event.max_attendees}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 mt-4">
              Không tìm thấy sự kiện nào phù hợp.
            </p>
          )}
        </div>
        <div className="flex justify-center mt-2">
          <button
            onClick={() => setShowRatedEvents(!showRatedEvents)}
            className="p-2 text-white bg-[#007BFF] rounded-lg w-40 hover:bg-[#0f00b3] border"
          >
            {showRatedEvents ? "Ẩn bớt sự kiện" : "Xem tất cả sự kiện"}
          </button>
        </div>
      </div>
      {/* Hiển thị Popup nếu showPopup là true */}
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
                      Khu vực: {ticket?.zone?.name || "N/A"} - Giá:{" "}
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

export default ItemEven;
