import React from "react";
import { Link } from "react-router-dom";

const Cart = () => {
  return (
    <div className="mt-36">
      {/* Header Cart and Checkout */}
      <div className="w-full lg:py-7 py-4 bg-[#F4F4F4] grid place-items-center -mt-[1px]">
        <div className="flex items-center gap-x-4 text-sm lg:text-base">
          <div className="flex items-center gap-x-2">
            <img
              className="w-[30px] h-[30px] p-2 text-white bg-[#05422C] rounded-full"
              src="../../../public/images/cart_icon.png"
              alt="Cart Icon"
            />
            <span>Shopping Cart</span>
          </div>
          <div className="lg:w-[74.5px] w-[40px] h-[1px] bg-[#C3D2CC]"></div>
          <div className="flex items-center gap-x-2">
            <img
              className="w-[30px] h-[30px] p-2 text-white bg-white rounded-full"
              src="../../../public/images/checkout.png"
              alt="Checkout Icon"
            />
            <span className="hidden lg:block">Checkout</span>
          </div>
        </div>
      </div>

      {/* Main content with products and checkout */}
      <main className="lg:w-[1170px] w-[90%] lg:mt-8 mt-6 mx-auto grid lg:grid-cols-[686px_420px] grid-cols-1 gap-4 justify-between pb-72">
        {/* Product section on mobile and desktop */}
        <div className="w-full">
          <span className="text-xl flex items-center justify-between pb-6 border-b">
            Your Cart <p className="text-[#9D9EA2] lg:text-base text-sm">2</p>
          </span>

          {/* List items */}
          <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white shadow-md rounded-lg p-4">
              <div className="flex items-center justify-between border-b pb-4 mb-4">
                <div className="flex items-center">
                  <img
                    alt="Product image"
                    className="w-12 h-12 rounded-md mr-4"
                    height="70"
                    src="https://storage.googleapis.com/a1aa/image/jDFkP0XoMfXcGCURqzl33s4g8qkpnkK6Rz2HXeglQyLiiqpTA.jpg"
                    width="70"
                  />
                  <div>
                    <div className="text-gray-500">Sự kiện</div>
                  </div>
                </div>
                <div className="text-gray-800">$100</div>
                <div className="flex items-center">
                  <button className="w-6 h-6 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-minus text-xs"
                    >
                      <path d="M5 12h14" />
                    </svg>
                  </button>
                  <div className="bg-[#F4F4F4] text-sm rounded px-2 py-1 mx-1">
                    2
                  </div>
                  <button className="w-6 h-6 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-plus text-xs"
                    >
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                  </button>
                </div>
                <div className="text-gray-800">$100</div>
                <button className="text-gray-500 px-2">x</button>
              </div>
              <div className="flex justify-between text-gray-800">
                <div>Subtotal</div>
                <div>$1000</div>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout section: on mobile, move this below products */}
        <div className="w-full lg:block">
          <div className="w-full p-6 border rounded-2xl flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-4">
              <section className="flex justify-between text-sm">
                <span className="text-[#9D9EA2]">Subtotal </span>
                <p>$1000</p>
              </section>
              <section className="flex justify-between text-sm">
                <span className="text-[#9D9EA2]">Shipping Costs </span>
                <p>$50.00</p>
              </section>
            </div>

            {/* Voucher */}
            <div className="flex items-center justify-between gap-x-3 py-4">
              <input
                type="text"
                placeholder="Coupon code"
                className="px-3 py-2 rounded-lg border"
              />
              <button className="text-[#007BFF] font-medium bg-[#e0d8d8] text-sm rounded-[100px] px-5 py-2">
                Apply Coupon
              </button>
            </div>

            <Link
              to={``}
              className="font-semibold text-sm underline cursor-pointer tracking-[-0.1px]"
            >
              Home
            </Link>

            <Link
              to={`/checkout`}
              className="bg-[#007BFF] px-10 h-14 rounded-[100px] text-white flex my-4 gap-x-4 place-items-center justify-center"
            >
              <span>Checkout</span>|<span>$1000</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;
