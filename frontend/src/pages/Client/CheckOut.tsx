

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CheckOut = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const ticketType = searchParams.get("ticketType");
  const totalPrice = parseFloat(searchParams.get("totalPrice") || "0");
  const ticketId = searchParams.get("ticketId");

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("paypal"); // Default is PayPal

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the data to send to backend
    const paymentData = {
      ticket_id: ticketId,
      payment_method: paymentMethod,  // Payment method (paypal)
      name: userInfo.name,
      email: userInfo.email,
      phone: userInfo.phone,
      address: userInfo.address,
      discount_code: "",  // Add logic to get voucher code if needed
    };

    try {
      const response = await fetch("http://192.168.2.112:8000/api/v1/clients/payment/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to PayPal payment URL
        window.location.href = data.payment_url;
      } else {
        alert(data.message || "Thanh toán không thành công.");
      }
    } catch (error) {
      console.error("Error during payment process:", error);
      alert("Có lỗi xảy ra trong quá trình thanh toán.");
    }
  };

  return (
    <div className="mt-36 mx-4">
      {/* <!--router page --> */}
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

      {/* <!-- main --> */}
      <form onSubmit={handleSubmit}  className="mx-auto lg:w-[1170px] mb:w-[342px] grid lg:grid-cols-[686px_420px] grid-cols-[100%] lg:gap-x-16 lg:mt-8 mt-6 gap-y-10">
        {/* <!-- left --> */}
        <div>
          <section className="flex justify-between border-b lg:pb-6 pb-6">
            <strong className="font-medium text-xl text-[#060709] tracking-[-0.3px]">
              Thông tin thanh toán
            </strong>
            <span className="text-[#9D9EA2]">(3)</span>
          </section>

          {/* <!-- form --> */}
          <div className="lg:mt-[33px] mt-[22px] w-full flex flex-col lg:gap-y-[23px] gap-y-[18px]">
            {/* <!-- name --> */}
            <div className="flex flex-col gap-y-2 *:rounded-lg border-b pb-4">
              <span className="text-xs uppercase text-[#46494F] tracking-[0.9px]">
                Họ và tên *
              </span>
              <input
                type="text"
                name="name"
                className="h-12 border px-4 text-sm"
                placeholder="Vui lòng nhập họ và tên"
                value={userInfo.name}
                onChange={handleInputChange}
              />
            </div>

            {/* <!-- phone --> */}
            <div className="lg:flex items-center grid grid-cols-[47%_47%] gap-x-5 *:w-full lg:-mt-0.5">
              {/* <!-- phone --> */}
              <div className="flex flex-col gap-y-2">
                <label
                  htmlFor="phone"
                  className="uppercase text-[#46494F] text-xs tracking-[0.9px]"
                >
                  Số điện thoại
                </label>
                <input
                  id="phone"
                  type="text"
                  className="h-12 rounded-lg border px-4 text-sm"
                  placeholder="+84"
                  name="phone"
                  value={userInfo.phone}
                  onChange={handleInputChange}
                />
              </div>
              {/* <!-- email --> */}
              <div className="flex flex-col gap-y-2">
                <label
                  htmlFor="email"
                  className="text-xs uppercase text-[#46494F] tracking-[0.9px]"
                >
                  Địa chỉ email *
                </label>
                <input
                  id="email"
                  type="text"
                  className="h-12 border rounded-lg px-4 text-sm"
                  placeholder="abc@gmail.com"
                  name="email"
                  value={userInfo.email}
                  onChange={handleInputChange}

                />
              </div>
            </div>

            {/* < address --> */}
            <div className="flex flex-col gap-y-2 *:rounded-lg border-b pb-4">
              <span className="text-xs uppercase text-[#46494F] tracking-[0.9px]">
                Địa chỉ
              </span>
              <input
                type="text"
                className="h-12 border px-4 text-sm"
                placeholder="Vui lòng nhập địa chỉ"
                name="address"
                value={userInfo.address}
                onChange={handleInputChange}
              />
            </div>

            {/* Phương thức thanh toán */}
            <div className="mb-2">
              <h2 className="mb-2">Chọn phương thức thanh toán</h2>
              <div className="border border-gray-300 rounded p-2">
                <div className="flex items-center">
                  <input className="mr-2" type="radio" name="paymentMethod" value="paypal" 
                    checked={paymentMethod === 'paypal'}
                    onChange={handlePaymentMethodChange}   />
                  <img
                    alt="MoMo logo"
                    className="mr-2"
                    height="40"
                    src="../../../public/images/logo_paypal.png"
                    width="40"
                  />
                  <label>Thanh toán bằng paypal</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- right --> */}
        <div>
          <div className="border rounded-2xl flex flex-col gap-y-5 lg:p-6 px-5 py-[22px]">
            <div className="flex flex-col gap-y-[17px] border-b pb-5">
              <section className="flex justify-between text-sm">
                <span className="text-[#9D9EA2]">Tổng cộng</span>
                <p>{totalPrice} VDN</p>
              </section>
              <section className="flex justify-between text-sm">
                <span className="text-[#9D9EA2]">Tên đơn hàng </span>
                <p>Vé {ticketType}</p>
              </section>
            </div>
            {/* <!-- voucher --> */}
            <div className="border-b flex flex-col gap-y-3">
              <label className="text-sm text-[#9D9EA2]">Áp dụng voucher</label>
              <div className="lg:flex items-center grid grid-cols-[50%_45%] justify-between gap-x-3 *:h-12">
                <input
                  type="text "
                  placeholder="Coupon code"
                  className="pl-[22px] py-2 rounded-lg border"
                />
                <button className="text-[#007BFF] font-medium bg-[#F3FBF4] border text-sm rounded-[100px] px-3 py-2">
                  Áp dụng
                </button>
              </div>
            </div>

            <button className="bg-[#007BFF] px-10 h-14 rounded-[100px] text-white flex gap-x-4 place-items-center justify-center">
              <span>Đặt vé</span>|<span>{totalPrice} VDN</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckOut;