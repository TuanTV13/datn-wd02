import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
import QrReader from "react-qr-scanner"; // Import thư viện
import { Modal, notification } from "antd";
import { toast } from "react-toastify";
const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [errorPopup, setErrorPopup] = useState(""); // State để lưu thông báo lỗi

  const [selectedVIPTicket, setSelectedVIPTicket] = useState(null);
  const [vipTicketQuantity, setVIPTicketQuantity] = useState(1);
  const [selectedRegularTicket, setSelectedRegularTicket] = useState(null);
  const [regularTicketQuantity, setRegularTicketQuantity] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [similarEvents, setSimilarEvents] = useState([]);
const [reload, setReload] = useState(false);
  const [selectedZones, setSelectedZones] = useState({});
  const [quantity, setQuantity] = useState(1);
 
  // Hàm để cập nhật zone đã chọn
  const handleZoneChange = (ticket, zoneId) => {
    // Tìm zone được chọn trong ticket.price
    const selectedZones = ticket.zone;

    if (selectedZones) {
      setSelectedZones((prevState) => ({
        ...prevState,
        [ticket.ticket.id]: selectedZones,
      }));
    }
  };
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/v1/clients/events/${id}`)
      .then((response) => {
        setEvent(response.data.data);
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  }, [id]);

  const handleCheckInSubmit = () => {
    const ticketCode = document.getElementById("ticket_code").value; // Lấy mã vé người dùng nhập

    if (!ticketCode) {
      // Hiển thị thông báo lỗi nếu mã vé không được nhập
      notification.error({ message: "Vui lòng nhập mã vé" });
      return; // Dừng lại và không gửi yêu cầu API
    }

    // Tạo đối tượng dữ liệu để gửi lên API
    const requestData = {
      ticket_code: ticketCode,
    };

    axios
      .put(
        `http://127.0.0.1:8000/api/v1/clients/events/${event.id}/checkin`,
        requestData
      )
      .then((response) => {
        notification.error({ message: "Check-in thành công" });
        setCheckInPopup(false); // Đóng popup sau khi check-in thành công
      })
      .catch((error) => {
        console.error("Lỗi khi check-in:", error);
        if (error.response && error.response.data) {
          notification.error({
            message: `Lỗi: ${
              error.response.data.error || "Không thể thực hiện check-in"
            }`,
          });
        } else {
          notification.error({ message: "Có lỗi xảy ra. Vui lòng thử lại." });
        }
      });
  };

  const handleCheckIn = () => {
    setCheckInPopup(true);
    setCheckInMode("code"); // Mặc định vào chế độ nhập mã vé
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
        return { text: "Đang chuẩn bị", color: "text-yellow-500" };
      case "checkin":
        return { text: "Đang check-in", color: "text-green-500" };
      case "ongoing":
        return { text: "Đang diễn ra", color: "text-blue-500" };
      case "completed":
        return { text: "Đã kết thúc", color: "text-gray-500" };
      default:
        return null;
    }
  };

  const navigate = useNavigate();

  const handleBuyTicketClick = () => {
    // Khởi tạo mảng tickets
    const tickets = [];
    let totalAmount = 0;
    let ticketQuantity = 0;

    // Kiểm tra nếu có vé VIP được chọn và số lượng hợp lệ
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

    // Kiểm tra nếu có vé Thường được chọn và số lượng hợp lệ
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
    // Kiểm tra nếu có ít nhất một vé đã được chọn
    if (tickets.length > 0) {
      // Tạo dữ liệu để gửi sang trang checkout
      const ticketData = {
        eventId: id,
        tickets: tickets,
        totalPrice: totalAmount,
      };

      // Điều hướng sang trang checkout và truyền dữ liệu
      navigate("/checkout", { state: ticketData });
    } else {
      alert("Vui lòng chọn ít nhất một loại vé.");
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedTicket(null);

    setQuantity(1);
  };

  const handleConfirmPurchase = () => {
    if (selectedTicket && selectedZones) {
      const ticketId = selectedTicket.ticket.id;
      const ticketType = selectedTicket.ticket.ticket_type;
      // Lấy thông tin zone được chọn
      const zoneInfo = selectedZones[selectedTicket.ticket.id];
      if (!zoneInfo) {
        toast.error("Khu vực chưa được chọn hoặc không hợp lệ.");
        return;
      }

      const { id: seatZoneId, name: zoneName } = zoneInfo;

      // Kiểm tra giá trị price có tồn tại không
      const price = selectedTicket?.price;

      if (price === undefined) {
        alert("Giá chưa được chọn hoặc không hợp lệ.");
        return;
      }

      // Tạo URL với các tham số bổ sung
      const checkoutUrl = `/checkout?ticketId=${encodeURIComponent(
        ticketId
      )}&ticketType=${encodeURIComponent(
        ticketType
      )}&price=${encodeURIComponent(price)}&seatZoneId=${encodeURIComponent(
        seatZoneId
      )}&zoneName=${encodeURIComponent(zoneName)}&quantity=${encodeURIComponent(
        quantity
      )}`;

      // Chuyển hướng đến trang checkout
      window.location.href = checkoutUrl;
    } else {
      alert("Vui lòng chọn loại vé và khu vực trước khi xác nhận.");
    }
  };

  const handleQrCodeScan = (data) => {
    if (data && data.text) {
      // Kiểm tra nếu dữ liệu có trường text
      console.log("Dữ liệu quét được:", data); // In ra dữ liệu quét để kiểm tra

      const ticket_code = data.text; // Lấy mã vé từ trường text

      setQrCodeData(ticket_code); // Cập nhật ticketCode vào state

      // Gửi dữ liệu mã QR (ticketCode) để xử lý check-in
      axios
        .put(
          `http://127.0.0.1:8000/api/v1/clients/events/${event.id}/checkin`,
          { ticket_code: ticket_code } // Gửi ticketCode lên API
        )
        .then((response) => {
          setCheckInPopup(false); // Đóng popup sau khi check-in thành công
          toast.success("Check-in thành công!"); // Thông báo check-in thành công
          console.log("Check-in thành công:", response);
        })
        .catch((error) => {
          toast.error(error);
          console.error("Lỗi khi check-in:", error); // Xử lý lỗi nếu có
        });
    } else {
      console.log("Không nhận được dữ liệu từ mã QR."); // Trường hợp không nhận được dữ liệu
    }
  };

  const handleQrCodeError = (err) => {
    console.error("Lỗi quét mã QR:", err);
  };

  if (!event) {
    return <div>Đang tải sự kiện...</div>;
  }

  const statusInfo = getStatusTextAndColor(event.status);

  return (
    <div className="container pt-40">
      {/* Ảnh nền sự kiện */}
      <div
        className="relative w-full h-[500px] bg-gray-100 rounded-lg overflow-hidden "
        style={{ backgroundImage: `url('${event.thumbnail}')` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>

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

          {event.status !== "completed" && event.status !== "ongoing" && (
            <>
              <p className="mt-4 text-lg">
                Thời gian bắt đầu: {new Date(event.start_time).toLocaleString()}
              </p>
              <p className="text-lg">
                Thời gian kết thúc: {new Date(event.end_time).toLocaleString()}
              </p>
              <br />
              {event.status !== "checkin" && (
                <button
                  onClick={() => setShowPopup(true)}
                  className="w-[150px] h-[50px] bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
                >
                  Mua vé
                </button>
              )}
             
            </>
          )}
          <div className="mt-4 text-center">
            <p className="text-lg">
              Địa điểm: {`${event.location}`},{" "}
              {`${event.ward}, ${event.district}, ${event.province}`}
            </p>
          </div>
          {statusInfo && (
           <div className="mt-4 flex items-center text-lg">
           <span className="mr-2">Trạng thái:</span>
           <div className={`px-1 py-px rounded-md  font-bold ${statusInfo.color} shadow-sm`}>
             {statusInfo.text}
           </div>
         </div>
          
          )}
        </div>
      </div>
      <br />
      {event.speakers && event.speakers.length > 0 && (
      <div className="mt-8 p-8 bg-white rounded-lg shadow-md">
        
          <div className="flex flex-wrap justify-center mt-8 gap-6">
            {event.speakers.map((speaker, index) => (
              <div key={index} className="flex flex-col items-center w-48">
                <img
                  src={speaker.image_url}
                  alt={speaker.name}
                  className="w-40 h-40 object-cover rounded-full border-4 border-gray-300"
                />
                <p className="mt-4 text-center font-semibold text-lg">
                  {speaker.name}
                </p>
                <p className="text-gray-600">Email: {speaker.email}</p>
                <p className="text-gray-600">Số điện thoại: {speaker.phone}</p>
                {speaker.profile && (
                  <p className="text-gray-500 text-sm italic mt-2">
                    {speaker.profile}
                  </p>
                )}
              </div>
            ))}
          </div>
        
      </div>)}
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
      <br />
      <br />
      {/* Sự kiện tương tự */}
      {/* <div className="mt-8 p-8 bg-white rounded-lg shadow-md">
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
      </div> */}

      {/* Hiển thị Popup nếu showPopup là true */}
      {showPopup && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg w-[700px]">
      <h2 className="text-2xl font-bold mb-4">Chọn vé</h2>

      {/* Nhóm vé VIP */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-indigo-700 mb-4">Vé VIP</h3>
        <select
          value={selectedVIPTicket?.id || ""}
          onChange={(e) => {
            const selected = event.tickets.find(
              (ticket) => ticket.id === parseInt(e.target.value)
            );
            setSelectedVIPTicket(selected);
            setVIPTicketQuantity(1);
          }}
          className="border p-2 rounded w-full"
        >
          <option value="">Chọn khu vực</option>
          {event.tickets
            .filter((ticket) => ticket?.ticket?.ticket_type === "VIP")
            .map((ticket) => (
              <option key={ticket.id} value={ticket.id}>
                Khu vực: {ticket?.zone?.name} - Giá: {ticket.price} VND - Số
                lượng còn lại: {ticket.sold_quantity}
              </option>
            ))}
        </select>

        {/* Hiển thị input số lượng khi vé VIP được chọn */}
        {selectedVIPTicket && (
          <div className="mt-4">
            <label className="block text-sm font-bold mb-2">Số lượng</label>
            <input
              type="number"
              min="1"
              max="6"
              value={vipTicketQuantity || 1}
              onChange={(e) => {
                const quantity = parseInt(e.target.value, 10);
                if (quantity > 5) {
                  setErrorPopup("Số lượng vé VIP trong 1 giao dịch tối đa là 5.");
                } else {
                  setVIPTicketQuantity(quantity);
                  setErrorPopup(null);
                }
              }}
              className="border p-2 rounded w-full"
            />
          </div>
        )}
      </div>

      {/* Nhóm vé Thường */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-indigo-700 mb-4">Vé Thường</h3>
        <select
          value={selectedRegularTicket?.id || ""}
          onChange={(e) => {
            const selected = event.tickets.find(
              (ticket) => ticket.id === parseInt(e.target.value)
            );
            setSelectedRegularTicket(selected);
            setRegularTicketQuantity(1);
          }}
          className="border p-2 rounded w-full"
        >
          <option value="">Chọn khu vực</option>
          {event.tickets
            .filter((ticket) => ticket?.ticket?.ticket_type === "Thường")
            .map((ticket) => (
              <option key={ticket.id} value={ticket.id}>
                Khu vực: {ticket?.zone?.name} - Giá: {ticket.price} VND - Số
                lượng còn lại: {ticket.sold_quantity}
              </option>
            ))}
        </select>

        {/* Hiển thị input số lượng khi vé Thường được chọn */}
        {selectedRegularTicket && (
          <div className="mt-4">
            <label className="block text-sm font-bold mb-2">Số lượng</label>
            <input
              type="number"
              min="1"
              max="11"
              value={regularTicketQuantity || 1}
              onChange={(e) => {
                const quantity = parseInt(e.target.value, 10);
                if (quantity > 10) {
                  setErrorPopup("Số lượng vé Thường trong 1 giao dịch tối đa là 10.");
                } else {
                  setRegularTicketQuantity(quantity);
                  setErrorPopup(null);
                }
              }}
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

{/* Popup hiển thị lỗi */}
{errorPopup && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-4 rounded-lg shadow-lg w-[400px] text-center">
      <p className="text-red-500 font-bold mb-4">{errorPopup}</p>
      <button
        onClick={() => setErrorPopup(null)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Đóng
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default EventDetail;
