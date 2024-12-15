import React from "react";
import { Link } from "react-router-dom";

const Contact = () => {
  return (
    <div className="mt-36">
      <div className="bg-gradient-to-r from-[#007BFF] to-[#F5F5F5] h-[100px]">
        <div className="flex items-center p-4">
          <span className="text-black"><Link to={`/`}>Trang chủ</Link> </span>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-500">Liên hệ</span>
        </div>
      </div>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-4">
          Liên hệ Eventify
        </h1>
        <p className="text-center mb-2">
          Bạn không chỉ có một mình đâu. Để biết thông tin về các dịch vụ và
          phương thức hợp tác, vui lòng liên hệ
        </p>
        <p className="text-center mb-8">
          Lưu ý, chúng tôi chỉ là đơn vị truyền thông, không phải đơn vị tổ chức
          sự kiện, vui lòng tham khảo các dịch vụ trước khi liên hệ:
        </p>
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center w-full md:w-1/3">
            <img
              alt="Icon representing event advertising"
              className="mx-auto mb-4"
              height="100"
              src="https://storage.googleapis.com/a1aa/image/kWimAGx7LZ56ExDfU7mTLz7KheaZFOYDWTIQF6w91rU5nL7TA.jpg"
              width="100"
            />
            <h2 className="text-xl font-semibold mb-2">Quảng cáo sự kiện</h2>
            <button className="bg-[#007BFF] text-white px-4 py-2 rounded">
              Tìm hiểu thêm
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center w-full md:w-1/3">
            <img
              alt="Icon representing event ticket sales"
              className="mx-auto mb-4"
              height="100"
              src="https://storage.googleapis.com/a1aa/image/eHw5wgku6QztOqdSCqTEHFv4KlfUCL3vT3DPG0ZSCdy3nL7TA.jpg"
              width="100"
            />
            <h2 className="text-xl font-semibold mb-2">Bán vé sự kiện</h2>
            <button className="bg-[#007BFF] text-white px-4 py-2 rounded">
              Xem bảng giá
            </button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="bg-gradient-to-r from-[#007BFF] to-[#6C757D] text-white p-6 rounded-lg w-full md:w-1/3">
            <h2 className="text-2xl font-semibold mb-4">Thông tin liên hệ</h2>
            <p className="mb-4">Chúng tôi trân trọng mọi ý kiến của bạn!</p>
            <p className="mb-2">
              <i className="fas fa-building mr-1"></i>
              Công ty TNHH MTV Eventify
            </p>
            <p className="mb-2">
              <i className="fas fa-map-marker-alt mr-1"></i>
              Hà Nội
            </p>
            <p className="mb-2">
              <i className="fas fa-phone mr-1"></i>
              10003904329
            </p>
            <p className="mb-2">
              <i className="fas fa-envelope mr-1"></i>
              hotro@Eventify.com
            </p>
            <p className="mb-2">
              <i className="fas fa-info-circle mr-1"></i>
              Trung tâm trợ giúp
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-2/3">
            <form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-2" htmlFor="name">
                    Họ tên *
                  </label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded"
                    id="name"
                    placeholder="Full name"
                    type="text"
                  />
                </div>
                <div>
                  <label className="block mb-2" htmlFor="phone">
                    Điện thoại liên hệ *
                  </label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded"
                    id="phone"
                    placeholder="Phone number"
                    type="text"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block mb-2" htmlFor="email">
                  Email *
                </label>
                <input
                  className="w-full p-2 border border-gray-300 rounded"
                  id="email"
                  placeholder="Email address"
                  type="email"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2" htmlFor="message">
                  Lời nhắn *
                </label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded"
                  id="message"
                  placeholder="Your message"
                  rows={4}
                ></textarea>
              </div>
              <button
                className="bg-[#007BFF] text-white px-4 py-2 rounded w-full"
                type="submit"
              >
                Submit Form
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
