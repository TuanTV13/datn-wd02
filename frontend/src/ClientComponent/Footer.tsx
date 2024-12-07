import React from "react";

const Footer = () => {
  return (
    <div>
      <footer className="bg-gray-800 text-white py-12">
        <div className="mx-auto w-[90%]">
          <div className="flex flex-col md:flex-row justify-between border-b-2 border-gray-600 pb-8">
            {/* Support Information Section */}
            <div className="flex-grow p-4 max-w-xs md:max-w-sm">
              <div className="flex items-center">
                <img
                  src="../../public/images/logo.webp"
                  alt="Logo"
                  className="w-16 h-16 rounded-full mr-3"
                />
                <h3 className="text-lg font-semibold">Thông tin hỗ trợ</h3>
              </div>
              <p className="mt-4 text-sm">
                Hệ thống quản lý và phân phối vé sự kiện hàng đầu Việt Nam
                TicketBox Co. Ltd. © 2016
              </p>
            </div>

            {/* General Introduction Section */}
            <div className="flex-grow p-4 text-sm">
              <h3 className="text-lg font-semibold">Giới thiệu chung</h3>
              <p>Công ty TNHH</p>
              <p>Đại diện theo pháp luật:</p>
              <p>Địa chỉ: Hà Nội</p>
              <p>Hotline: 10003904329</p>
              <p>Giấy chứng nhận đăng ký doanh nghiệp số:</p>
            </div>

            {/* Payment Methods Section */}
            <div className="flex-grow p-4">
              <h3 className="text-lg font-semibold">Phương thức thanh toán</h3>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mt-4">
                <img
                  src="../../public/images/logo_paypal.png"
                  alt="Thanh toán 1"
                  className="h-auto w-10 mx-auto"
                />
                <img
                  src="../../public/images/vnpay-logo.jpg"
                  alt="Thanh toán 2"
                  className="h-auto w-12 mx-auto"
                />
              </div>
            </div>

            {/* Partners Section */}
            <div className="flex-grow p-4 text-sm flex flex-col items-center">
              <h3 className="text-lg font-semibold text-center">Đối tác</h3>
              <div className="flex justify-center mt-4">
                <img
                  className="mx-3 h-auto w-10"
                  src="../../public/images/doitac/Frame.png"
                  alt="Đối tác 1"
                />
                <img
                  className="mx-3 h-auto w-10"
                  src="../../public/images/doitac/Frame1.png"
                  alt="Đối tác 2"
                />
                <img
                  className="mx-3 h-auto w-10"
                  src="../../public/images/doitac/Frame2.png"
                  alt="Đối tác 3"
                />
              </div>
            </div>
          </div>

          <div className="text-center mt-8 text-sm">
            <p>&copy; 2016 TicketBox Co. Ltd. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
