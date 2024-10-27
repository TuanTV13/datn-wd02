import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuToggle = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const closeMenu = () => {
    setOpenMenu(null);
  };

  // Close sub-menu if click happens outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
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
            <Link to={""}>
              <span className="text-sm">Your Account</span>
            </Link> |
            <Link to={`/cart`} className="relative h-[24px]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                  stroke="currentColor" className="w-[24px]">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                <span className="absolute bg-red-500 top-0 right-0 rounded-full w-[16px] h-[16px] text-xs text-white flex items-center justify-center">2</span>
              </Link>
          </div>
        </div>
      </div>

      {/* Desktop Menu */}
      <div className="w-full hidden lg:flex justify-center items-center">
        <div>
          <ul className="flex gap-x-8 h-[56px] items-center">
            <li>
              <Link to={``}>Trang chủ</Link>
            </li>
            <li className="relative" ref={menuRef}>
              <Link
                to={``}
                onClick={(e) => {
                  e.preventDefault();
                  handleMenuToggle("suKien");
                }}
              >
                Sự kiện
              </Link>
              {openMenu === "suKien" && (
                <ul className="absolute bg-gray-100 shadow-lg mt-2 rounded-lg p-2 w-[230px]">
                  <li className="flex hover:bg-gray-300">
                    <Link
                      to={`event-category`}
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
