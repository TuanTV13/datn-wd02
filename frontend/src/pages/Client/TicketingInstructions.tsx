import React from "react";
import { Link } from "react-router-dom";

const TicketingInstructions = () => {
  return (
    <div className="mt-36">
      <div className="bg-green-100 py-4">
       <div className="bg-gradient-to-r from-[#b9faa9] to-[#007BFF] h-[100px]">
               <div className="flex items-center p-4">
                 <span className="text-black"><Link to={`/`}>Trang chủ</Link> </span>
                 <span className="mx-2 text-gray-500">/</span>
                 <span className="text-gray-500">Hướng dẫn đặt vé</span>
               </div>
             </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Quy trình mua bán vé sự kiện trực tuyến
        </h1>
        <p className="mb-4 text-xl">
          Nếu bạn chưa biết cách đặt mua bán vé sự kiện trực tuyến tại Sàn Sự
          Kiện thì có thể tham khảo quy trình sau đây, chắc chắn bạn sẽ nhanh
          chóng có được những tấm vé sự kiện như ý:
        </p>
        <h2 className="text-xl font-bold mb-4">
          Quy trình mua vé sự kiện tại Eventify.com :
        </h2>
        <p className="mb-4 text-xl">
          Để mua vé sự kiện, khách hàng tiến hành đăng ký tài khoản tại
          Eventify.com hoặc đăng nhập nếu đã có tài khoản trước đó và khách
          hàng có thể mua vé khi chưa đăng nhập.
        </p>
        <p className="mb-4 text-lg">
        <span className="font-bold">Bước 1: </span>
          Khách hàng chọn sự kiện cần xem trên trang chủ Eventify.com hoặc tiến
          hành tìm kiếm sự kiện tại ô tìm kiếm -
          <span className="font-bold">Search</span>
          -&gt;
          <span className="font-bold">Tất cả sự kiện</span>
        </p>
        <div className="mb-4 mx-16">
          <img
            alt="Screenshot of the Eventify.com homepage with highlighted steps for finding events"
            className="w-full center"
            height="200"
            src="../../../public/images/1.png"
            width="800"
          />
        </div>
        <p className="mb-4 text-lg">
        <span className="font-bold">Bước 2: </span>
          Sau khi tìm kiếm được sự kiện ấn vào xem chi tiết sự kiện, tại trang sự kiện chi tiết hiển
          thị nút -
          <span className="font-bold">Mua vé</span>
          hoặc bạn có thể mua vé luôn ở trang chủ
          như hình sau đây:
        </p>
        <div className="mb-4 mx-16">
          <img
            alt="Screenshot of the event detail page with the 'Mua vé' button highlighted"
            className="w-full"
            height="200"
            src="../../../public/images/2.png"
            width="800"
          />
        </div>

        <p className="mb-4 text-lg">
        <span className="font-bold">Bước 3: </span>
          Sau khi bấm nút Mua vé thì sẽ hiển thị ra 1 Popup để cho khách hàng chọn vé và khu vực
          với chọn số lượng vé
          như hình sau đây:
        </p>
        <div className="mb-4 mx-16">
          <img
            alt="Screenshot of the event detail page with the 'Mua vé' button highlighted"
            className="w-full"
            height="200"
            src="../../../public/images/3.png"
            width="800"
          />
        </div>

        <p className="mb-4 text-lg">
        <span className="font-bold">Bước 4: </span>
          Sau khi bấm xác nhận Mua vé thì sẽ sẽ chuyển đến trang thanh toán để khách hàng điền thông tin và chọn phương thức thanh toán nếu chưa đăng nhập
          còn nếu khách hàng đã đăng nhập thì thông tin tự động điền vào
          như hình sau đây:
        </p>
        <div className="mb-4 mx-16">
          <img
            alt="Screenshot of the event detail page with the 'Mua vé' button highlighted"
            className="w-full"
            height="200"
            src="../../../public/images/4.png"
            width="800"
          />
        </div>

        <p className="mb-4 text-lg">
        <span className="font-bold">Bước 5: </span>
          Sau khi bấm thanh toán thì sẽ sẽ chuyển đến trang để thực hiện thanh toán để khách hàng điền thông tin 
          thanh toán 
          như hình sau đây:
        </p>
        <div className="mb-4 mx-16">
          <img
            alt="Screenshot of the event detail page with the 'Mua vé' button highlighted"
            className="w-full"
            height="200"
            src="../../../public/images/5.png"
            width="800"
          />
        </div>

        <p className="mb-4 text-lg">
        <span className="font-bold">Bước 6: </span>
          Sau điền đủ thông tin thanh toán thì bấm tiếp tục để nhập mã OTP
          như hình sau đây:
        </p>
        <div className="mb-4 mx-16">
          <img
            alt="Screenshot of the event detail page with the 'Mua vé' button highlighted"
            className="w-full"
            height="200"
            src="../../../public/images/6.png"
            width="800"
          />
        </div>

        <p className="mb-4 text-lg">
        <span className="font-bold">Bước 7: </span>
          Sau thanh toán thành công thì sẽ chuyển về trang hóa đơn giao dịch và hiển thị thông tin người mua vé
          thông tin vé và mã Qr của vé và trạng thái đã hoàn thành. Sau đó có thể chuyển về trang chủ hoặc trang lịch sử giao dịch
          và cũng có thể mua thêm vé của sự kiện đó. Qr code có thể tải bằng cách ấn vào mã Qr để tải về dạng PDF
          như hình sau đây:
        </p>
        <div className="mb-4 mx-16">
          <img
            alt="Screenshot of the event detail page with the 'Mua vé' button highlighted"
            className="w-full"
            height="200"
            src="../../../public/images/7.png"
            width="800"
          />
        </div>

        <p className="mb-4 text-lg">
        <span className="font-bold">Bước 8: </span>
          Bạn hãy kiểm tra gmail để xem thông tin giao dịch và thông tin vé mà chúng tôi đã gửi cho bạn. 
          Đội ngũ Eventify cảm ơn bạn đã tham gia sự kiện và sử dụng dịch vụ của chúng tôi!
        </p>
      </div>
    </div>
  );
};

export default TicketingInstructions;
