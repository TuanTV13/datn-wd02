import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { notification } from "antd";

const CheckOut = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ticketData = location.state;

  const searchParams = new URLSearchParams(location.search);
  const ticketType = searchParams.get("ticketType");
  const ticketId = searchParams.get("ticketId");
  const seatZoneId = Number(searchParams.get("seatZoneId") || 1);
  const quantity = searchParams.get("quantity");
  const initialTotalPrice = parseFloat(searchParams.get("price") || "0");

  const zoneName = searchParams.get("zoneName");
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("vnpay");
  const [voucherCode, setVoucherCode] = useState("");
  const [totalPrice, setTotalPrice] = useState(
    initialTotalPrice * Number(quantity)
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Kiểm tra đăng nhập

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setIsLoggedIn(true); // Đánh dấu người dùng đã đăng nhập
      axios
        .get("http://127.0.0.1:8000/api/v1/user", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          const userData = response.data.user;
          setUserInfo({
            name: userData.name || "",
            email: userData.email || "",
            phone: userData.phone || "",
          });
        })
        .catch((error) => {
          if (error.status === 401) {
            localStorage.clear();
            window.location = "/auth";
          }
          if (error?.response?.status === 401) navigate("/auth");
        });
    }
  }, []);
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const [isProcessing, setIsProcessing] = useState(false);

  const handleVoucherApply = async () => {
    const token = localStorage.getItem("access_token");
    const userID = localStorage.getItem("user_id");
    if (!voucherCode) {
      notification.success({ message: "Vui lòng nhập mã voucher!" });
      return;
    }

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/v1/vouchers/apply/${totalPrice}`,
        {
          event_id: ticketId,
          user_id: userID,
          code: voucherCode,
          totalAmount: totalPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setTotalPrice(response.data.data.total_price);
        notification.success({ message: "Mã giảm giá áp dụng thành công!" });
      } else {
        notification.error({
          message: response.data.message || "Mã giảm giá không hợp lệ.",
        });
      }
    } catch (error) {
      if (error.status === 401) {
        localStorage.clear();
        window.location = "/auth";
      }
      console.error("Error applying voucher:", error);
      notification.error({ message: "Có lỗi xảy ra khi áp dụng mã giảm giá." });
    }
  };

  const handlePaymentMethodChange = (e: any) => {
    setPaymentMethod(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true); // Start processing

    const token = localStorage.getItem("access_token");

    // Lấy thông tin nhiều ticketId từ ticketData.tickets
    const tickets = ticketData.tickets.map((ticket) => ({
      ticket_id: ticket.ticket_id,
      ticket_type: ticket.ticket_type,
      quantity: ticket.quantity,
      seat_zone_id: ticket.seat_zone_id,
      seat_zone: ticket.seat_zone,
      original_price: parseFloat(ticket.original_price).toFixed(2),
    }));

    const paymentData = {
      tickets: tickets, // Mảng các vé
      payment_method: paymentMethod,
      name: userInfo.name,
      email: userInfo.email,
      phone: userInfo.phone,
      discount_code: voucherCode || null,
      amount: parseFloat(ticketData.totalPrice).toFixed(2),
    };
    try {
      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await axios.post(
        "http://127.0.0.1:8000/api/v1/clients/payment/process",
        paymentData,
        { headers }
      );
      if (response.data.status === "success") {
        window.location.href = response.data.payment_url;
      } else {
        notification.error({
          message: response.data.message || "Thanh toán không thành công.",
        });
      }
    } catch (error) {
      console.error("Error during payment process:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Có lỗi xảy ra trong quá trình thanh toán.";
      notification.error({ message: errorMessage });
    } finally {
      setIsProcessing(false); // End processing
    }

  };
  return (
    <div className="mt-36 mx-4">
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-medium">
              Đang chuyển hướng đến trang thanh toán, vui lòng chờ...
            </p>
            <div className="mt-4 loader"></div>
          </div>
        </div>
      )}
      <div className="w-full lg:py-7 py-4 bg-[#F4F4F4] grid place-items-center -mt-[1px]">
        <div className="flex items-center gap-x-4 text-sm lg:text-base">
          <div className="flex items-center gap-x-2">
            <img
              className="w-[30px] h-[30px] p-2 text-white bg-[#9db3dd] rounded-full"
              src="../../../public/images/checkout.png"
              alt="Check Out"
            />
            <span>Thanh Toán</span>
          </div>
          <div className="lg:w-[74.5px] w-[40px] h-[1px] bg-[#C3D2CC]"></div>
          <div className="flex items-center gap-x-2">
            <img
              className="w-[30px] h-[30px] p-2 text-white bg-white rounded-full"
              src="../../../public/images/order.png"
              alt="Order Icon"
            />
            <span className="hidden lg:block">Hóa đơn</span>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mx-auto lg:w-[1170px] mb:w-[342px] grid lg:grid-cols-[686px_420px] grid-cols-[100%] lg:gap-x-16 lg:mt-8 mt-6 gap-y-10"
      >
        {/* Left Section */}
        <div>
          <section className="flex justify-between border-b lg:pb-6 pb-6">
            <strong className="font-medium text-xl text-[#060709] tracking-[-0.3px]">
              Thông tin thanh toán
            </strong>
            <span className="text-[#9D9EA2]">(3)</span>
          </section>

          <div className="lg:mt-[33px] mt-[22px] w-full flex flex-col lg:gap-y-[23px] gap-y-[18px]">
            {/* Name */}
            <div className="flex flex-col gap-y-2 *:rounded-lg border-b pb-4">
              <span className="text-xs uppercase text-[#46494F] tracking-[0.9px]">
                Họ và tên *
              </span>
              <input
                type="text"
                required
                name="name"
                className="h-12 border px-4 text-sm"
                placeholder="Vui lòng nhập họ và tên"
                value={userInfo.name}
                onChange={handleInputChange}
              />
            </div>

            {/* Phone and Email */}
            <div className="lg:flex items-center grid grid-cols-[47%_47%] gap-x-5 *:w-full lg:-mt-0.5">
              <div className="flex flex-col gap-y-2">
                <label
                  htmlFor="phone"
                  className="uppercase text-[#46494F] text-xs tracking-[0.9px]"
                >
                  Số điện thoại *
                </label>
                <input
                  id="phone"
                  type="text"
                  required
                  className="h-12 rounded-lg border px-4 text-sm"
                  placeholder="+84"
                  name="phone"
                  value={userInfo.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <label
                  htmlFor="email"
                  className="text-xs uppercase text-[#46494F] tracking-[0.9px]"
                >
                  Địa chỉ email *
                </label>
                <input
                  id="email"
                  required
                  type="text"
                  className="h-12 border rounded-lg px-4 text-sm"
                  placeholder="abc@gmail.com"
                  name="email"
                  value={userInfo.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-2">
              <h2 className="mb-2">Chọn phương thức thanh toán</h2>
              <div className="border border-gray-300 rounded p-2">
                {/* PayPal Payment Option */}
                <label className="flex items-center cursor-pointer">
                  <input
                    className="mr-2"
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={handlePaymentMethodChange}
                  />
                  <img
                    alt="PayPal logo"
                    className="mr-2"
                    height="40"
                    src="../../../public/images/logo_paypal.png"
                    width="40"
                  />
                  <span>Thanh toán bằng PayPal</span>
                </label>

                {/* VNPay Payment Option */}
                <label className="flex items-center mt-3 cursor-pointer">
                  <input
                    className="mr-2"
                    type="radio"
                    name="paymentMethod"
                    defaultChecked
                    aria-checked
                    value="vnpay"
                    checked={paymentMethod === "vnpay"}
                    onChange={handlePaymentMethodChange}
                  />
                  <img
                    alt="vnpay logo"
                    className="mr-2"
                    height="50"
                    src="../../../public/images/vnpay-logo.jpg"
                    width="50"
                  />
                  <span>Thanh toán bằng VNPay</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="shadow-lg hover:shadow-xl transition-transform duration-300 transform hover:scale-105">
          <div className="border rounded-2xl flex flex-col gap-y-5 lg:p-6 px-5 py-[22px]">
            <div className="flex flex-col gap-y-[17px] border-b pb-5">
              <section className="flex justify-between text-sm">
                <span className="text-[#9D9EA2]">Giao dịch</span>
                <p>Mua vé</p>
              </section>
              <section className="flex justify-between text-sm">
                <span className="text-[#9D9EA2]">Tổng cộng</span>
                <p>{ticketData.totalPrice} VND</p>
              </section>
            </div>

            <div className="border-b flex flex-col gap-y-3">
              <label className="text-sm text-[#9D9EA2]">Áp dụng voucher</label>
              <div className="lg:flex items-center gap-x-3">
                <input
                  type="text"
                  placeholder="Coupon code"
                  className="pl-[22px] py-2 rounded-lg border"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleVoucherApply}
                  className="text-[#007BFF] font-medium bg-[#F3FBF4] border text-sm rounded-[100px] px-3 py-2"
                >
                  Áp dụng
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="bg-[#007BFF] px-10 h-14 rounded-[100px] text-white flex gap-x-4 place-items-center justify-center"
            >
              <span>Đặt vé</span>|<span>{ticketData.totalPrice} VND</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckOut;
