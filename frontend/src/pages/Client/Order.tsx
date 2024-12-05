import React from "react";
import { Link } from "react-router-dom";

const Order = () => {
  return (
    <div className="mt-36">
      {/* <!--router page --> */}
      {/* <div className="w-full lg:py-7 mb:py-[18px] bg-[#F4F4F4] grid place-items-center -mt-[1px]">
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
            <span className="hidden lg:block">Thanh toán thành công</span>
          </div>
        </div>
      </div> */}

      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mt-8">
          <p className="text-gray-500 mb-1">
          Thanh toán đơn hàng thành công!
          </p>
          <p className="text-gray-500 mb-4">
             Cảm ơn bạn đã trải nghiệm dịch vụ của chùng tôi!
          </p>
          <Link
            to={`/`}
            className="bg-[#007BFF] text-white px-6 py-2 rounded-full"
          >
            Trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Order;
