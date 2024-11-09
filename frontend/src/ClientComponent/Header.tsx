import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const menuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const notificationRef = useRef(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuToggle = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const closeMenu = () => {
    setOpenMenu(null);
  };

  const toggleNotificationPopup = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  // Close sub-menu if click happens outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile menu if click happens outside (for mobile only)
  useEffect(() => {
    const handleClickOutsideMobileMenu = (event) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideMobileMenu);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideMobileMenu);
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="absolute top-0 left-0 w-full z-50">
      <div className="w-full flex justify-center items-center border-b bg-[#007BFF]">
        <div className="container mx-auto px-4 lg:h-[76px] h-[56px] flex justify-between items-center">
          {/* Mobile Menu Toggle */}
          <div className="lg:hidden block">
            <button onClick={toggleMobileMenu}>
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
            </button>
          </div>
          <img
            className=" w-12 h-12 rounded-full"
            src="../../public/images/logo.webp"
            alt="Logo"
          />

          {/* Desktop Search Bar */}
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
            <Link to={"auth"}>
              <span className="text-sm">Your Account</span>
            </Link>{" "}
            |
            <Link to={`/cart`} className="relative h-[24px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-[24px]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
              <span className="absolute bg-red-500 top-0 right-0 rounded-full w-[16px] h-[16px] text-xs text-white flex items-center justify-center">
                2
              </span>
            </Link>
            <div className="relative h-[24px] lg:ml-10" ref={notificationRef}>
              <button onClick={toggleNotificationPopup}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"
                  />
                </svg>
                <span className="absolute bg-red-500 top-0 right-0 rounded-full w-[16px] h-[16px] text-xs text-white flex items-center justify-center">
                  2
                </span>
              </button>
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-[400px] bg-white shadow-lg rounded-lg p-4 z-10">
                  <p className="text-sm font-medium">Bạn có 2 thông báo mới</p>
                  <ul className="mt-2">
                    <li className="py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                      Thông báo 1
                    </li>
                    <li className="py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                      Thông báo 2
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* <!-- form mobile --> */}
      <div className=" *:h-[58px] lg:hidden mb:block w-full">
        <form className="flex *:h-[36px] justify-center items-center gap-x-2">
          <input
            type="text"
            className="border rounded-full w-[298px] px-5"
            placeholder="Search"
          />
          <button className="rounded-[50%] bg-[#6C757D] w-[36px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="size-6 text-white mx-auto"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </button>
        </form>
      </div>
      {/* Desktop Menu */}
      <div className="w-full hidden lg:flex justify-center items-center">
        <div>
          <ul className="flex gap-x-8 h-[56px] items-center">
            <li>
              <Link to={``}>Trang chủ</Link>
            </li>
            <li className="relative">
              <Link to={`event-list`}>Sự kiện</Link>
              {/* {openMenu === "suKien" && (
                <ul className="absolute bg-gray-100 shadow-lg mt-2 rounded-lg p-2 w-[230px]">
                  <li className="flex hover:bg-gray-300">
                    <Link
                      to={`/event-category`}
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
              )} */}
            </li>

            <li>
              <Link to={``}>Blog</Link>
            </li>

            <li className="relative" ref={menuRef}>
              <Link
                to={``}
                onClick={(e) => {
                  e.preventDefault();
                  handleMenuToggle("troGiup");
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden block absolute top-[76px] left-0 w-full bg-white shadow-lg z-50"
          ref={mobileMenuRef}
        >
          <ul className="flex flex-col gap-y-4 p-4">
            <li>
              <Link to={``} onClick={toggleMobileMenu}>
                Trang chủ
              </Link>
            </li>

            <li className="relative">
              <button
                onClick={() => handleMenuToggle("suKien")}
                className="block w-full text-left"
              >
                Sự kiện
              </button>
              {openMenu === "suKien" && (
                <ul className="bg-gray-100 shadow-lg mt-2 rounded-lg p-2 w-full">
                  <li className="flex hover:bg-gray-300">
                    <Link
                      to={``}
                      className="block px-4 py-2"
                      onClick={closeMenu}
                    >
                      Danh mục sự kiện
                    </Link>
                  </li>
                  <li className="flex hover:bg-gray-300">
                    <Link
                      to={``}
                      className="block px-4 py-2"
                      onClick={closeMenu}
                    >
                      Địa điểm tổ chức sự kiện
                    </Link>
                  </li>
                  <li className="flex hover:bg-gray-300">
                    <Link
                      to={``}
                      className="block px-4 py-2"
                      onClick={closeMenu}
                    >
                      Lịch sử sự kiện
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <Link to={``} onClick={toggleMobileMenu}>
                Blog
              </Link>
            </li>

            <li className="relative">
              <button
                onClick={() => handleMenuToggle("troGiup")}
                className="block w-full text-left"
              >
                Trợ giúp
              </button>
              {openMenu === "troGiup" && (
                <ul className="bg-gray-100 shadow-lg mt-2 rounded-lg p-2 w-full">
                  <li className="flex hover:bg-gray-300">
                    <Link
                      to={``}
                      className="block px-4 py-2"
                      onClick={closeMenu}
                    >
                      Liên hệ
                    </Link>
                  </li>
                  <li className="flex hover:bg-gray-300">
                    <Link
                      to={``}
                      className="block px-4 py-2"
                      onClick={closeMenu}
                    >
                      Hướng dẫn đặt vé
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <Link to={``} onClick={toggleMobileMenu}>
                Giới thiệu
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
