import React, { useState } from "react"
import { Link } from "react-router-dom"

const Header = () => {
  const [openMenu, setOpenMenu] = useState(null)
  const handleMenuToggle = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu)
  }
  const closeMenu = () => {
    setOpenMenu(null)
  }
  return (
    <div>
      <header>
        {/* <!-- logo, search and cart --> */}
        <div className="w-full flex justify-center items-center border-b bg-[#007BFF]">
          <div className="container mx-auto px-4 lg:h-[76px] h-[56px] flex justify-between items-center">
            {/* <!-- icon menu --> */}
            <div className="lg:hidden block">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-menu"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </div>
            <img
              className=" w-12 h-12 rounded-full"
              src="../../public/images/logo.webp"
              alt="Logo"
            />

            {/* <!-- form --> */}
            <div className="hidden lg:block h-[40px]">
              <form className="w-[456px] flex h-[40px] justify-between">
                <input
                  type="text"
                  className="border rounded-full w-[400px] px-6"
                  placeholder="Search"
                />
                <button className="rounded-full bg-[#6C757D] w-[40px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6 text-white mx-auto"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                </button>
              </form>
            </div>

            <div className="flex gap-x-4 items-center">
              <Link to={""}>
                <span className="text-sm">Your Account</span>
              </Link>
            </div>
          </div>
        </div>

        {/* <!-- menu --> */}
        <div className="w-full hidden lg:flex justify-center items-center">
          <div>
            <ul className="flex gap-x-8 h-[56px] items-center">
              <li>
                <Link to={``}>Trang chủ</Link>
              </li>

              <li className="relative">
                <Link
                  to={``}
                  onClick={(e) => {
                    e.preventDefault()
                    handleMenuToggle("suKien")
                  }}
                >
                  Sự kiện
                </Link>
                {openMenu === "suKien" && (
                  <ul className="absolute bg-gray-100 shadow-lg mt-2 rounded-lg p-2 w-[230px]">
                    <li className="flex hover:bg-gray-300">
                      <Link
                        to={``}
                        className="block px-4 py-2"
                        onClick={closeMenu} // Đóng menu khi chọn mục
                      >
                        Danh mục sự kiện
                      </Link>
                    </li>
                    <li className="flex hover:bg-gray-300">
                      <Link
                        to={``}
                        className="block px-4 py-2"
                        onClick={closeMenu} // Đóng menu khi chọn mục
                      >
                        Địa điểm tổ chức sự kiện
                      </Link>
                    </li>
                    <li className="flex hover:bg-gray-300">
                      <Link
                        to={``}
                        className="block px-4 py-2"
                        onClick={closeMenu} // Đóng menu khi chọn mục
                      >
                        Lịch sử sự kiện
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              <li>
                <Link to={``}>Blog</Link>
              </li>

              <li className="relative">
                <Link
                  to={``}
                  onClick={(e) => {
                    e.preventDefault()
                    handleMenuToggle("troGiup")
                  }}
                >
                  Trợ giúp
                </Link>
                {openMenu === "troGiup" && (
                  <ul className="absolute bg-gray-100 shadow-lg mt-2 rounded-lg p-2 w-[230px]">
                    <li className="flex hover:bg-gray-300">
                      <Link
                        to={``}
                        className="block px-4 py-2"
                        onClick={closeMenu} // Đóng menu khi chọn mục
                      >
                        Liên hệ
                      </Link>
                    </li>
                    <li className="flex hover:bg-gray-300">
                      <Link
                        to={``}
                        className="block px-4 py-2"
                        onClick={closeMenu} // Đóng menu khi chọn mục
                      >
                        Hướng dẫn đặt vé
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              <li>
                <Link to={``}>Giới thiệu</Link>
              </li>
            </ul>
          </div>
        </div>
      </header>
    </div>
  )
}

export default Header
