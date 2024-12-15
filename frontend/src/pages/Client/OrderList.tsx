import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../../axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "antd";
import { jsPDF } from "jspdf";
import api from "../../api_service/api";
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
const OrderList = () => {
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
  const [transaction, setTransaction] = useState(null); // Trạng thái lưu dữ liệu giao dịch
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [error, setError] = useState(null); // Trạng thái lỗi
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // Gọi API khi component được render
  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await axiosInstance.get(`transactions/${id}/detail`);
        console.log(response.data);
        setTransaction(response.data); // Lưu dữ liệu vào state
        setLoading(false); // Tắt trạng thái tải
      } catch (err) {
        setError(err.message); // Lưu thông báo lỗi
        setLoading(false);
      }
    };

    fetchTransaction();
  }, []);

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

  if (loading) {
    return <p>Đang tải dữ liệu...</p>;
  }

  if (error) {
    return <p>Có lỗi xảy ra: {error}</p>;
  }

  // Hàm tạo URL QR Code
  const generateQRCodeUrl = (ticketCode) => {
    const size = "150x150";
    const color = "000000";
    return `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
      ticketCode
    )}&size=${size}&color=${color}`;
  };

  const printQRCode = async (ticketCode) => {
    const doc = new jsPDF(); // Tạo instance jsPDF
    const qrCodeUrl = generateQRCodeUrl(ticketCode);

    // Thêm hình ảnh QR code vào PDF
    const img = new Image();
    img.src = qrCodeUrl;
    img.onload = () => {
      doc.text("QR Code for Ticket", 20, 20);
      doc.addImage(img, "PNG", 20, 30, 150, 150); // Vị trí và kích thước ảnh
      doc.save(`ticket_${ticketCode}.pdf`); // Lưu file PDF
    };
  };

  const getStatusColor = (statusId: any) => {
    switch (statusId) {
      case "completed":
        return { text: "Đã hoàn thành", color: "text-green-500" };
      case "pending":
        return { text: "Đang chờ xác nhận", color: "text-gray-400" };
      case "failed":
        return { text: "Thanh toán thất bại", color: "text-red-500" };
      default:
        return { text: "Trạng thái không xác định", color: "text-gray-400" };
    }
  };

  // Hàm khi nhấn vào nút "Mua vé"
  const handleShowPopup = (eventId: any) => {
    setSelectedEventId(eventId);
    setShowPopup(true); // Hiển thị popup
  };

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
  // Nếu dữ liệu tồn tại, hiển thị giao diện
  return (
    <div className="max-w-4xl mt-36 mb-10 mx-auto p-8 bg-gray-50 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-blue-600">
        Xác Nhận Giao Dịch: <span>{transaction.transaction_code}</span>
      </h1>
      <p className="mt-2 text-lg">Chào {transaction.user.name}</p>
      <div className="flex items-center space-x-2">
        <span>Giao dịch của bạn đang ở trạng thái: </span>
        <p
          className={`font-semibold ${
            getStatusColor(transaction.status).color
          }`}
        >
          {getStatusColor(transaction.status).text}
        </p>
      </div>

      {/* Thông tin giao dịch */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Thông tin giao dịch:</h2>
        <p className="mt-2">
          <strong className="text-gray-700">Mã giao dịch:</strong>{" "}
          {transaction.transaction_code}
        </p>
        <p>
          <strong className="text-gray-700">Phương thức thanh toán:</strong>{" "}
          <span className="text-blue-600">{transaction.payment_method}</span>
        </p>
      </div>

      {/* Thông tin sự kiện */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Thông tin sự kiện:</h2>
        <p>
          <strong className="text-gray-700">Tên sự kiện:</strong>{" "}
          {transaction.event.name}
        </p>
        <p>
          <strong className="text-gray-700">Thời gian:</strong>{" "}
          {transaction.event.start_time}
        </p>
        <p>
          <strong className="text-gray-700">Địa điểm:</strong>{" "}
          {transaction.event.location}
        </p>
      </div>

      {/* Thông tin vé */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Thông tin vé:</h2>
        <table className="w-full border-collapse border border-gray-300 mt-4">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="border border-gray-300 px-4 py-2">STT</th>
              {["pending", "completed"].includes(transaction.status) && (
                <th className="border border-gray-300 px-4 py-2">Mã vé</th>
              )}
              <th className="border border-gray-300 px-4 py-2">Loại vé</th>
              <th className="border border-gray-300 px-4 py-2">Vị trí</th>
              <th className="border border-gray-300 px-4 py-2">Giá tiền</th>
              {["pending", "completed"].includes(transaction.status) && (
                <th className="border border-gray-300 px-4 py-2">QR Code</th>
              )}
            </tr>
          </thead>
          <tbody>
            {transaction.tickets.map((ticket, index) => (
              <tr key={index} className="text-center">
                {/* Nếu trạng thái là "pending" hoặc "completed", hiển thị đầy đủ thông tin vé */}
                {["pending", "completed"].includes(transaction.status) ? (
                  <>
                    <td className="border border-gray-300 px-4 py-2">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {ticket.ticket_code}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {ticket.ticket_type}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {ticket.seat_zone}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(ticket.original_price)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <img
                        src={generateQRCodeUrl(ticket.ticket_code)}
                        alt={`QR Code for ${ticket.ticket_code}`}
                        className="w-20 h-20 cursor-pointer"
                        onClick={() => printQRCode(ticket.ticket_code)}
                      />
                    </td>
                  </>
                ) : (
                  // Nếu trạng thái là "failed", hiển thị các thông tin cơ bản
                  <>
                    <td className="border border-gray-300 px-4 py-2">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {ticket.ticket_type}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {ticket.seat_zone}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(ticket.original_price)}
                    </td>
                    {/* Cột QR Code không hiển thị nếu trạng thái là "failed" */}
                  </>
                )}
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr className="font-bold">
              {["pending", "completed"].includes(transaction.status) && (
                <td
                  colSpan={5}
                  className="border border-gray-300 px-4 py-2 text-right"
                >
                  Tổng tiền:
                </td>
              )}
              {["failed"].includes(transaction.status) && (
                <td
                  colSpan={3}
                  className="border border-gray-300 px-4 py-2 text-right"
                >
                  Tổng tiền:
                </td>
              )}

              <td className="border border-gray-300 px-4 py-2">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(transaction.total_amount)}{" "}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {["pending", "completed"].includes(transaction.status) && (
        <p className="mt-4 text-center text-gray-600">
          Cảm ơn bạn đã tham gia đăng ký sự kiện!
        </p>
      )}

      <div className="flex justify-center mt-3 gap-24">
        {" "}
        {localStorage.getItem("access_token") && (
          <Button
            onClick={() => {
              navigate("/payment-history");
            }}
            type="text"
          >
            Lịch sử giao dịch
          </Button>
        )}{" "}
        <Button
          onClick={() => {
            navigate("/");
          }}
          type="primary"
        >
          Trang chủ{" "}
        </Button>
        <Button
          onClick={() => handleShowPopup(transaction.event.id)}
          type="primary"
        >
          Mua vé
        </Button>{" "}
      </div>
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

export default OrderList;
