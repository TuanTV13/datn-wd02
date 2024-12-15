import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../../axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "antd";
import { jsPDF } from "jspdf";

const OrderList = () => {
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
        console.log(response.data)
        setTransaction(response.data); // Lưu dữ liệu vào state
        setLoading(false); // Tắt trạng thái tải
      } catch (err) {
        setError(err.message); // Lưu thông báo lỗi
        setLoading(false);
      }
    };

    fetchTransaction();
  }, []);

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
        return { text: "Đã hoàn thành", color: "text-gray-500" };
      case "pending":
        return { text: "Đang chờ xác nhận", color: "text-gray-300" };
      case "failed":
        return { text: "Thanh toán thất bại", color: "text-red-500" };
      default:
        return { text: "Trạng thái không xác định", color: "text-gray-300" };
    }
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
              <th className="border border-gray-300 px-4 py-2">Mã vé</th>
              <th className="border border-gray-300 px-4 py-2">Loại vé</th>
              <th className="border border-gray-300 px-4 py-2">Vị trí</th>
              <th className="border border-gray-300 px-4 py-2">Giá tiền</th>
              <th className="border border-gray-300 px-4 py-2">QR Code</th>{" "}
              {/* Cột QR Code */}
            </tr>
          </thead>
          <tbody>
            {transaction.tickets.map((ticket, index) => (
              <tr key={index} className="text-center">
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
                  }).format(ticket.original_price)}{" "}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {/* Hiển thị QR code */}
                  <img
                    src={generateQRCodeUrl(ticket.ticket_code)}
                    alt={`QR Code for ${ticket.ticket_code}`}
                    className="w-20 h-20 cursor-pointer"
                    onClick={() => printQRCode(ticket.ticket_code)} // Thêm onClick
                  />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-bold">
              <td
                colSpan="4"
                className="border border-gray-300 px-4 py-2 text-right"
              >
                Tổng tiền:
              </td>
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

      <p className="mt-4 text-center text-gray-600">
        Cảm ơn bạn đã tham gia đăng ký sự kiện!
      </p>
      <div className="flex justify-center mt-3 gap-24">
        {" "}
        {localStorage.getItem("access_token") && (
          <Button
            onClick={() => {
              navigate("/");
            }}
            type="primary"
          >
            Trang chủ{" "}
          </Button>
        )}{" "}
        <Button
          onClick={() => {
            navigate("/payment-history");
          }}
          type="text"
        >
          Lịch sử giao dịch
        </Button>{" "}
      </div>
    </div>
  );
};

export default OrderList;
