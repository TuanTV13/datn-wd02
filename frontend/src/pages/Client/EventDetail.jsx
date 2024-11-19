import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import QrReader from 'react-qr-scanner'; // Import thư viện
const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [checkInPopup, setCheckInPopup] = useState(false); // Khởi tạo trạng thái của popup

  const [showPopup, setShowPopup] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [similarEvents, setSimilarEvents] = useState([]);
  const [checkInMode, setCheckInMode] = useState('code'); // 'code' hoặc 'qr'
  useEffect(() => {
    axios.get(`http://192.168.2.112:8000/api/v1/clients/events/${id}`)
      .then((response) => {
        setEvent(response.data.data);
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  }, [id]);
  const fetchSimilarEvents = (categoryId) => {
    axios
      .get(`http://192.168.2.112:8000/api/v1/clients/category/${categoryId}`)
      .then((response) => {
        setSimilarEvents(response.data.data.filter((e) => e.id !== id)); // Lọc bỏ sự kiện hiện tại
      })
      .catch((error) => {
        console.error("Lỗi khi lấy sự kiện tương tự:", error);
      });
  };
  const handleCheckInSubmit = () => {
    const ticketCode = document.getElementById("ticketCode").value; // Lấy mã vé người dùng nhập
    if (ticketCode) {
      axios.put(`http://192.168.2.112:8000/api/v1/clients/events/${event.id}/checkin`, { code: ticketCode })
        .then((response) => {
          console.log('Check-in thành công:', response.data);
          // Có thể hiển thị thông báo thành công hoặc làm gì đó sau khi check-in thành công
          setCheckInPopup(false); // Đóng popup sau khi check-in
        })
        .catch((error) => {
          console.error('Lỗi khi check-in:', error);
          // Có thể hiển thị thông báo lỗi
        });
    } else {
      // Hiển thị lỗi nếu mã vé không được nhập
      console.log('Vui lòng nhập mã vé');
    }
  };
  
  const handleCheckIn = () => {
    setCheckInPopup(true);
    setCheckInMode('code'); // Mặc định vào chế độ nhập mã vé
  };

  const handleCloseCheckInPopup = () => {
    setCheckInPopup(false);
  };

  const handleSwitchCheckInMode = (mode) => {
    setCheckInMode(mode);
  };
  const getStatusTextAndColor = (status) => {
    switch (status) {
      case "confirmed":
        return { text: "Đang chuẩn bị", color: "bg-yellow-500" };
      case "checkin":
        return { text: "Đang check-in", color: "bg-green-500" };
      case "ongoing":
        return { text: "Đang diễn ra", color: "bg-blue-500" };
      case "completed":
        return { text: "Đã kết thúc", color: "bg-gray-500" };
      default:
        return null;
    }
  };

  const handleBuyTicketClick = (ticket) => {
    setSelectedTicket(ticket);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedTicket(null);
  };

  const handleConfirmPurchase = () => {
    if (selectedTicket) {
      const totalPrice = selectedTicket.price;
      const ticketId = selectedTicket.id; // Lấy id vé
      window.location.href = `/checkout?ticketType=${selectedTicket.ticket_type}&totalPrice=${totalPrice}&ticketId=${ticketId}`; // Thêm id vé vào URL
    }
  };
  const handleQrCodeScan = (data) => {
    if (data) {
      setQrCodeData(data);
      console.log('Dữ liệu mã QR:', data);
      // Gửi dữ liệu mã QR để xử lý check-in
      axios.put(`http://192.168.2.112:8000/api/v1/clients/events/${event.id}/checkin`, { code: data })
        .then((response) => {
          console.log('Check-in thành công:', response.data);
          setCheckInPopup(false); // Đóng popup sau khi check-in
        })
        .catch((error) => {
          console.error('Lỗi khi check-in:', error);
        });
    }
  };

  const handleQrCodeError = (err) => {
    console.error('Lỗi quét mã QR:', err);
  };

  if (!event) {
    return <div>Đang tải sự kiện...</div>;
  }

  const statusInfo = getStatusTextAndColor(event.status);

  return (
    <div className="container pt-40">
      {/* Ảnh nền sự kiện */}
      <div
        className="relative w-full h-[500px] bg-gray-100 rounded-lg overflow-hidden"
        style={{ backgroundImage: `url('${event.thumbnail}')` }}
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>

        <div
          className="absolute inset-0 text-white p-8 flex flex-col items-center justify-center"
          style={{ left: "60%" }}
        >
          <h1
            style={{ fontFamily: "Dancing Script, cursive" }}
            className="text-5xl font-bold text-center"
          >
            {event.name}
          </h1>
          

         
          {checkInPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg w-[400px]">
                <h2 className="text-2xl font-bold mb-4">Check-in</h2>
                <div className="flex space-x-4 mb-4">
                  <button
                    className={`px-4 py-2 rounded ${checkInMode === 'code' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => handleSwitchCheckInMode('code')}
                  >
                    Nhập mã vé
                  </button>
                  <button
                    className={`px-4 py-2 rounded ${checkInMode === 'qr' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => handleSwitchCheckInMode('qr')}
                  >
                    Quét mã QR
                  </button>
                </div>

                {checkInMode === 'code' && (
                  <div>
                    <input
                      id="ticketCode"
                      type="text"
                      placeholder="Nhập mã vé"
                      className="w-full p-2 border rounded mb-4"
                    />
                    <button
                      onClick={handleCheckInSubmit}
                      className="w-full bg-blue-500 text-white py-2 rounded"
                    >
                      Xác nhận
                    </button>
                  </div>
                )}

                {checkInMode === 'qr' && (
                  <div>
                    <QrReader
                      delay={300}
                      style={{ width: '100%' }}
                      onError={handleQrCodeError}
                      onScan={handleQrCodeScan}
                    />
                    <button className="w-full bg-blue-500 text-white py-2 rounded">Xác nhận</button>
                  </div>
                )}

                <button
                  onClick={handleCloseCheckInPopup}
                  className="w-full bg-gray-500 text-white py-2 rounded mt-4"
                >
                  Đóng
                </button>
              </div>
            </div>
          )}
          {event.status !== 'completed' && (
            <>
              <p className="mt-4 text-lg">
                Thời gian bắt đầu: {new Date(event.start_time).toLocaleString()}
              </p>
              <p className="text-lg">
                Thời gian kết thúc: {new Date(event.end_time).toLocaleString()}
              </p>
              <br />
              <button
                onClick={() => setShowPopup(true)}
                className="w-[150px] h-[50px] bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
              >
                Mua vé
              </button>
            </>
          )}
          <div className="mt-4 text-center">
            <p className="text-lg">
              Địa điểm: {`${event.ward}, ${event.district}, ${event.province}`}
            </p>
          </div>
          {statusInfo && (
            <div
              className={`mt-4 px-4 py-2 rounded-full text-white ${statusInfo.color}`}
            >
              {statusInfo.text}
            </div>
          )}
          {event.status === 'checkin' && (
            <button
              onClick={handleCheckIn}
              className="w-[150px] h-[50px] bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md mt-4"
            >
              Check-in
            </button>
          )}
        </div>
      </div>

           {/* Diễn giả */}
           {event.speakers && event.speakers.length > 0 && (
  <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-4 text-center">Diễn giả</h2>
    <ul className="list-none">
      {event.speakers.map((speaker, index) => (
        <li key={index} className="flex flex-col items-center mb-8">
          {speaker.image_url && (
            <img
              src={speaker.image_url}
              alt={speaker.name}
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 shadow-md mb-4"
            />
          )}
          <p className="text-lg font-bold">{speaker.name}</p>
          <p className="text-gray-600">Email: {speaker.email}</p>
          <p className="text-gray-600">Số điện thoại: {speaker.phone}</p>
          {speaker.profile && (
            <p className="text-gray-500 text-sm italic mt-2">{speaker.profile}</p>
          )}
        </li>
      ))}
    </ul>
  </div>
)}

      {/* Mô tả sự kiện */}
      <div className="mt-8 p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Mô tả sự kiện</h2>
        <div
          className="mb-4 text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: event.description.replace(
              /<img/g,
              '<img class="max-w-[40%] h-auto mx-auto my-4 p-2 border border-gray-300 rounded-md shadow-sm"'
            ),
          }}
        ></div>
      </div>
      {/* Sự kiện tương tự */}
      <div className="mt-8 p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Sự kiện tương tự</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {similarEvents.map((event) => (
            <div key={event.id} className="border p-4 rounded-lg">
              <img
                src={event.thumbnail}
                alt={event.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-semibold text-center">
                {event.name}
              </h3>
              <button
                className="text-blue-500 hover:underline mt-2 block text-center"
                onClick={() =>
                  (window.location.href = `/event-detail/${event.id}`)
                }
              >
                Xem chi tiết
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Hiển thị Popup nếu showPopup là true */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h2 className="text-2xl font-bold mb-4">Chọn vé</h2>

            {event.tickets.map((ticket) => (
              <div
                key={ticket.id}
                className={`border p-4 rounded-lg mb-4 cursor-pointer hover:bg-gray-100 ${
                  selectedTicket?.id === ticket.id
                    ? "bg-blue-100 border-blue-500"
                    : ""
                }`}
                onClick={() => handleBuyTicketClick(ticket)}
              >
                <h3 className="text-lg font-semibold">{ticket.ticket_type}</h3>
                <p>Giá: {ticket.price} VND</p>
                <p>Số lượng còn lại: {ticket.available_quantity}</p>
                <p>Vị trí: {ticket.seat_location}</p>
              </div>
            ))}

            <div className="mt-4 flex justify-between">
              <button
                onClick={handleClosePopup}
                className="bg-gray-500 text-white py-2 px-4 rounded"
              >
                Đóng
              </button>
              <button
                onClick={handleConfirmPurchase}
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetail;

