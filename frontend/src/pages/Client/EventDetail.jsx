import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import QrReader from 'react-qr-scanner'; // Import thư viện
import { toast } from 'react-toastify';
const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [checkInPopup, setCheckInPopup] = useState(false); // Khởi tạo trạng thái của popup

  const [showPopup, setShowPopup] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [similarEvents, setSimilarEvents] = useState([]);
  const [checkInMode, setCheckInMode] = useState('code'); // 'code' hoặc 'qr'
  const [selectedZones, setSelectedZones] = useState({}); 

  // Hàm để cập nhật zone đã chọn
  const handleZoneChange = (ticket, zoneId) => {
    // Tìm zone được chọn trong ticket.price
    const selectedZones = ticket.price.find((priceItem) => priceItem.zone.id === zoneId);
  
    if (selectedZones) {
      setSelectedZones((prevState) => ({
        ...prevState,
        [ticket.id]: selectedZones
      }));
    }
  };
  
  
  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/v1/clients/events/${id}`)
      .then((response) => {
        setEvent(response.data.data);
        console.log("giang",response);
        
      })
      
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  }, [id]);
  
  const handleCheckInSubmit = () => {
    const ticketCode = document.getElementById("ticket_code").value; // Lấy mã vé người dùng nhập

    if (!ticketCode) {
      // Hiển thị thông báo lỗi nếu mã vé không được nhập
      alert('Vui lòng nhập mã vé');
      return; // Dừng lại và không gửi yêu cầu API
    }

    // Tạo đối tượng dữ liệu để gửi lên API
    const requestData = {
      ticket_code: ticketCode
    };

    axios.put(`http://127.0.0.1:8000/api/v1/clients/events/${event.id}/checkin`, requestData)
      .then((response) => {
        console.log('Check-in thành công:', response.data);
        alert('Check-in thành công');
        setCheckInPopup(false); // Đóng popup sau khi check-in thành công
      })
      .catch((error) => {
        console.error('Lỗi khi check-in:', error);
        if (error.response && error.response.data) {
          alert(`Lỗi: ${error.response.data.message || 'Không thể thực hiện check-in'}`);
        } else {
          alert('Có lỗi xảy ra. Vui lòng thử lại.');
        }
      });
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
    if (selectedTicket && selectedZones) {
      console.log("Selected Zones:", selectedZones); // Kiểm tra giá trị của selectedZones
      const ticketId = selectedTicket.id;
      const ticketType = selectedTicket.ticket_type;
  
      // Lấy thông tin zone được chọn
      const zoneInfo = selectedZones[selectedTicket.id]?.zone;
  
      if (!zoneInfo) {
        toast.error("Khu vực chưa được chọn hoặc không hợp lệ.");
        return;
      }
  
      const { id: seatZoneId, name: zoneName } = zoneInfo;
  
      // Kiểm tra giá trị price có tồn tại không
      const price = selectedZones[selectedTicket.id]?.price;
  
      if (price === undefined) {
        alert("Giá chưa được chọn hoặc không hợp lệ.");
        return;
      }
  
      // Tạo URL với các tham số bổ sung
      const checkoutUrl = `/checkout?ticketId=${encodeURIComponent(ticketId)}&ticketType=${encodeURIComponent(ticketType)}&price=${encodeURIComponent(price)}&seatZoneId=${encodeURIComponent(seatZoneId)}&zoneName=${encodeURIComponent(zoneName)}`;
  
      // Chuyển hướng đến trang checkout
      window.location.href = checkoutUrl;
    } else {
      alert("Vui lòng chọn loại vé và khu vực trước khi xác nhận.");
    }
  };
  
  
  const handleQrCodeScan = (data) => {
    if (data) {
      setQrCodeData(data);
      console.log('Dữ liệu mã QR:', data);
      // Gửi dữ liệu mã QR để xử lý check-in
      axios.put(`http://127.0.0.1:8000/api/v1/clients/events/${event.id}/checkin`, { code: data })
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
                      id="ticket_code"
                      type="text"
                      placeholder="Nhập mã vé"
                      className="w-full p-2 border rounded mb-4 text-black"
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
        {event.status !== 'completed' && event.status !== 'ongoing' && (
  <>
    <p className="mt-4 text-lg">
      Thời gian bắt đầu: {new Date(event.start_time).toLocaleString()}
    </p>
    <p className="text-lg">
      Thời gian kết thúc: {new Date(event.end_time).toLocaleString()}
    </p>
    <br />
    {event.status !== 'checkin' && (
      <button
        onClick={() => setShowPopup(true)}
        className="w-[150px] h-[50px] bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
      >
        Mua vé
      </button>
    )}
    
    {event.status === 'checkin' && (
      <button
        onClick={handleCheckIn}
        className="w-[150px] h-[50px] bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md mt-4"
      >
        Check-in
      </button>
    )}
  </>
)}

          <div className="mt-4 text-center">
            <p className="text-lg">
              Địa điểm: {`${event.location}, ${event.ward}, ${event.district}, ${event.province}`}
            </p>
          </div>
          {statusInfo && (
            <div
              className={`mt-4 px-4 py-2 rounded-full text-white ${statusInfo.color}`}
            >
              {statusInfo.text}
            </div>
          )}

        </div>
      </div>

      <div className="mt-8 p-10 bg-gradient-to-r from-indigo-50 via-white to-indigo-100 rounded-xl shadow-lg border-l-4 border-indigo-400">
  {event.speakers && event.speakers.length > 0 && (
    <div className="mt-6">
      <h2 className="text-3xl font-bold text-center text-indigo-600 mb-8 uppercase tracking-wide">
        Diễn Giả
      </h2>
      <div className="flex flex-wrap justify-center gap-10">
        {event.speakers.map((speaker, index) => (
          <div
            key={index}
            className="relative flex flex-col items-center w-72 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transform transition-all hover:scale-105 border-t-4 border-indigo-400"
          >
            <img
              src={speaker.image_url}
              alt={speaker.name}
              className="w-48 h-48 object-cover rounded-full border-4 border-indigo-500 shadow-md"
            />
            <div className="absolute top-2 left-2 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full shadow">
              #{index + 1}
            </div>
            <p className="mt-6 text-xl font-bold text-indigo-700">{speaker.name}</p>
            <p className="text-gray-800 mt-2">
              <span className="font-medium">Email:</span> {speaker.email}
            </p>
            <p className="text-gray-800 mt-2">
              <span className="font-medium">Số điện thoại:</span> {speaker.phone}
            </p>
            {speaker.profile && (
              <p className="text-gray-600 text-sm italic mt-3 text-center">
                "{speaker.profile}"
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )}
</div>

<div className="mt-10 p-10 bg-gradient-to-r from-indigo-50 via-white to-indigo-100 rounded-xl shadow-lg border-l-4 border-indigo-400">
  <h2 className="text-3xl font-bold text-indigo-600 mb-6 text-center uppercase tracking-wide">
    Mô tả sự kiện
  </h2>
  <div
    className="mb-6 text-gray-800 leading-loose text-lg"
    dangerouslySetInnerHTML={{
      __html: event.description.replace(
        /<img/g,
        '<img class="max-w-[50%] h-auto mx-auto my-6 p-3 border-2 border-indigo-400 rounded-lg shadow-md hover:shadow-lg transition-all"'
      ),
    }}
  ></div>
</div>


      {/* Sự kiện tương tự */}
    

      {/* Hiển thị Popup nếu showPopup là true */}
      {showPopup && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg w-[700px]">
      <h2 className="text-2xl font-bold mb-4">Chọn vé</h2>
      {event.tickets.length > 0 ? (
        event.tickets.map((ticket) => (
          <div
            key={ticket.id}
            className={`border p-4 rounded-lg mb-4 cursor-pointer hover:shadow-2xl transition-transform transform ${
              selectedTicket?.id === ticket.id
                ? "bg-blue-200 border-blue-600 shadow-2xl"
                : "hover:bg-gray-100 hover:border-gray-300"
            }`}
            onClick={() => handleBuyTicketClick(ticket)}
          >
            <h3 className="text-xl font-bold text-indigo-700 mb-3">Loại vé: {ticket.ticket_type}</h3>

            {/* Dropdown chọn zone */}
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Chọn khu vực:</label>
              <select
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-indigo-500 transition duration-300 ease-in-out"
                onChange={(e) => handleZoneChange(ticket, parseInt(e.target.value))}
                value={selectedZones[ticket.id]?.zone?.id || ""}
              >
                <option value="" disabled>Chọn Khu vực</option>
                {ticket.price.map((priceItem) => (
                  <option key={priceItem.zone.id} value={priceItem.zone.id}>
                    {priceItem.zone.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Hiển thị thông tin giá và số lượng nếu zone đã chọn */}
            {selectedZones[ticket.id] && selectedZones[ticket.id].zone ? (
              <div className="mt-4 p-4 border-t border-gray-300 bg-blue-50 rounded-md shadow-sm">
                <p className="text-sm text-gray-800 font-medium">
                  Giá: <span className="font-bold text-green-600">{selectedZones[ticket.id].price} VND</span>
                </p>
                <p className="text-sm text-gray-800 font-medium">
                  Số lượng còn lại: <span className="font-bold text-red-600">{selectedZones[ticket.id].sold_quantity}</span>
                </p>
              </div>
            ) : (
              <p className="mt-4 text-sm text-gray-500">Chọn zone để xem thông tin giá và số lượng</p>
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-700 mt-4">Hiện tại không có vé nào để mua.</p>
      )}

      <div className="mt-4 flex justify-between">
        <button
          onClick={handleClosePopup}
          className="bg-gray-500 text-white py-2 px-4 rounded"
        >
          Đóng
        </button>
        {event.tickets.length > 0 && (
          <button
            onClick={handleConfirmPurchase}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Xác nhận
          </button>
        )}
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default EventDetail;

