import React from 'react'

const Footer = () => {
  return (
    <div>
        <footer>
            <div className="mx-auto mt-16 w-[90%]">
                <div className="flex justify-center border-b-2">

                <div className="flex-grow p-4 text-xs max-w-96">
                    <div className="flex items-center">
                    <img src="./../public/logo.png" alt="Logo" className="w-12 h-12 rounded-full mr-2" />
                    </div>
                    <div>
                        <h3 className="text-lg mt-1">Thông tin hỗ trợ</h3>
                    </div>
                    <p>Hệ thống quản lý và phân phối vé sự kiện hàng đầu Việt Nam TicketBox Co. Ltd. © 2016</p>
                </div>

                <div className="flex-grow p-4 text-xs">
                    <h3 className="text-lg">Giới thiệu chung</h3>
                    <p>Công ty TNHH </p>
                    <p>Đại diện theo pháp luật:</p>
                    <p>Địa chỉ: Hà Nội</p>
                    <p>Hotline: 10003904329</p>
                    <p>Giấy chứng nhận đăng ký doanh nghiệp số:</p>
                </div>

                <div className="flex-grow p-4 text-xs">
                    <h3 className="text-lg">Phương thức thanh toán</h3>
                    <p className="grid grid-cols-5">
                    <img src="../../public/images/Frame1.png" alt="Thanh toán 1"></img>
                    <img src="../../public/images/Frame4.png" alt="Thanh toán 2"></img>
                    <img src="../../public/images/Frame5.png" alt="Thanh toán 3"></img>
                    </p>
                </div>

                <div className="flex-grow p-4 text-xs w-40 flex flex-col items-center">
                    <h3 className="text-lg text-center">Đối tác</h3>
                    <div className="flex justify-center items-center mt-2">
                        <img className="ml-2" src="../../public/images/doitac/Frame.png" alt="Đối tác 1" />
                        <img className="ml-2" src="../../public/images/doitac/Frame1.png" alt="Đối tác 2" />
                        <img className="ml-2" src="../../public/images/doitac/Frame2.png" alt="Đối tác 3" />
                    </div>

                    {/* Language Selection */}
                    <div className="flex flex-col items-center mt-4">
                        <p className="text-lg">Ngôn ngữ</p>
                        <img src="../../public/images/doitac/language.jpg" alt="Language Icon" className="w-8 h-8 mt-1" />
                    </div>
                </div>
                </div>
            </div>
        </footer>

    </div>
  )
}

export default Footer
