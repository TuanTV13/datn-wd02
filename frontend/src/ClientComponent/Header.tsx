import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown, MenuProps } from "antd";
import { useForm } from "react-hook-form";

const Header = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const menuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const notificationRef = useRef(null);

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <a rel="noopener noreferrer" href="/profile">
          Thông tin cá nhân{" "}
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a rel="noopener noreferrer" href="/change-password">
          Đổi mật khẩu{" "}
        </a>
      ),
    },
    {
      key: "3",
      label: (
        <a rel="noopener noreferrer" href="/event-history">
          Lịch sử tham gia sự kiện{" "}
        </a>
      ),
    },
    {
      key: "4",
      label: (
        <a rel="noopener noreferrer" href="/payment-history">
          Lịch sử giao dịch{" "}
        </a>
      ),
    },
    {
      key: "5",
      label: (
        <a rel="noopener noreferrer" onClick={() => handleLogout()} href="">
          Đăng xuất{" "}
        </a>
      ),
    },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuToggle = (menu: any) => {
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
    const handleClickOutside = (event: any) => {
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

  // Search
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: any) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };
  // Check đăng nhập

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setIsAuthenticated(true); // User is logged in
    } else {
      setIsAuthenticated(false); // User is not logged in
    }
  }, []);
  // Đăng xuất
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };
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
          <a href="/">
            <img
              className=" w-12 h-12 rounded-full"
              src="../../public/images/logo.webp"
              alt="Logo"
            />
          </a>

          {/* Desktop Search Bar */}
          <div className="hidden lg:block h-[40px]">
            <form
              onSubmit={handleSearch}
              className="w-[456px] flex h-[40px] justify-between"
            >
              <input
                type="text"
                className="border rounded-full w-[400px] px-6"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
            {!isAuthenticated ? (
              <Link to={"/auth"}>
                <span className="text-sm flex items-center">Đăng nhập</span>
              </Link>
            ) : (
              <Dropdown menu={{ items }}>
                <Link to={""}>
                  <span className="flex items-center mt-1">
                    <svg
                      className="w-[25px] h-[25px] fill-[#454444]"
                      viewBox="0 0 448 512"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z"></path>
                    </svg>
                  </span>
                </Link>
              </Dropdown>
            )}
            {isAuthenticated && (
              <div
                className="relative h-[24px] lg:ml-3  items-center"
                ref={notificationRef}
              >
                <button
                  onClick={toggleNotificationPopup}
                  className="flex items-center"
                >
                  <svg
                    className="w-[27px] h-[27px] fill-[#454444]"
                    viewBox="0 0 448 512"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z"></path>
                  </svg>
                  <span className="absolute bg-red-500 top-0 right-0 rounded-full w-[16px] h-[16px] text-xs text-white flex items-center justify-center">
                    2
                  </span>
                </button>
                {isNotificationOpen && (
                  <div className="absolute right-0 mt-2 w-[400px] bg-white shadow-lg rounded-lg p-4 z-10">
                    <p className="text-sm font-medium">
                      Bạn có 2 thông báo mới
                    </p>
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
            )}
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
              <Link to={`/`}>Trang chủ</Link>
            </li>
            <li className="relative">
              <Link to={`/event-list`}>Sự kiện</Link>
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
