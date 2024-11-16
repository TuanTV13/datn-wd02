
import React from "react";

const CheckOut = () => {
  return (
    <div className="mt-36 mx-4">
      {/* <!--router page --> */}
      <div className="w-full lg:py-7 mb:py-[18px] bg-[#F4F4F4] grid place-items-center -mt-[1px]">
        <div className="flex -translate-x-[1px] items-center gap-x-4 text-sm">
          <div className="flex items-center gap-x-2">
            <div className="w-[30px] h-[30px] p-2 text-white bg-[#C3D2CC] rounded-[50%] flex place-items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke=" #05422C"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="lucide lucide-check"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <span className="hidden lg:block">Giỏ hàng</span>
          </div>
          <div className="lg:w-[74.5px] mb:min-w-[39.5px] h-[1px] bg-[#05422C]"></div>
          <div className="flex items-center gap-x-2">
            <div className="w-[30px] h-[30px] p-2 text-white bg-[#05422C] invert rounded-[50%] flex place-items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke=" #ffffff"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="lucide lucide-credit-card"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" x2="22" y1="10" y2="10" />
              </svg>
            </div>
            <span>Thanh toán</span>
          </div>
        </div>
      </div>

      {/* <!-- main --> */}
      <form className="mx-auto lg:w-[1170px] mb:w-[342px] grid lg:grid-cols-[686px_420px] grid-cols-[100%] lg:gap-x-16 lg:mt-8 mt-6 gap-y-10">
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
                className="h-12 border px-4 text-sm"
                placeholder="Vui lòng nhập họ và tên"
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
              />
            </div>

            {/* Phương thức thanh toán */}
            <div className="mb-2">
              <h2 className="mb-2">Chọn phương thức thanh toán</h2>
              <div className="border border-gray-300 rounded p-2">
                <div className="flex items-center mb-2">
                  <input className="mr-2" type="radio" name="paymentMethod" />
                  <label>Thanh toán bằng tiền mặt</label>
                </div>
                <div className="flex items-center">
                  <input className="mr-2" type="radio" name="paymentMethod" />
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

            {/* <div className="flex items-center lg:mt-[30px] mb:mt-6 mb-1.5 lg:gap-x-3 gap-x-2.5">
              <input
                id="check_ship"
                type="checkbox"
                className="w-[22px] h-[22px]"
              />
              <label htmlFor="check_ship" className="text-[#060709] text-base">
                Ship to a different Address?
              </label>
            </div> */}
          </div>
        </div>

        {/* <!-- right --> */}
        <div>
          <div className="border rounded-2xl flex flex-col gap-y-5 lg:p-6 px-5 py-[22px]">
            <div className="flex flex-col gap-y-[17px] border-b pb-5">
              <section className="flex justify-between text-sm">
                <span className="text-[#9D9EA2]">Tổng cộng</span>
                <p>$497.00</p>
              </section>
              <section className="flex justify-between text-sm">
                <span className="text-[#9D9EA2]">Tên đơn hàng </span>
                <p>$50</p>
              </section>
              <section className="flex justify-between text-sm">
                <span className="text-[#9D9EA2]">Phí ship </span>
                <p>$50.00</p>
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
              <span>Đặt vé</span>|<span>$547.00</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckOut;