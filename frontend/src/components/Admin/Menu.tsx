import { Menu } from "antd";
import { LuCalendarPlus, LuUsers } from "react-icons/lu";
import { MdLogout, MdPieChartOutlined } from "react-icons/md";
import { TfiDashboard } from "react-icons/tfi";
import {
  AiOutlineTag,
  AiOutlinePercentage,
  AiOutlineCheckCircle,
} from "react-icons/ai";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Badge, Tooltip } from "antd"; // Thêm Badge và Tooltip
import React, { useEffect } from "react";

type Props = {
  collapsed?: boolean;
};

const MenuSidebar = ({ collapsed = false }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const roles: any[] = JSON.parse(localStorage.getItem("roles") as string);
    const role = roles?.find((v) => v.name === "admin");
    if (!role) {
      navigate("/");
    }
  }, []);

  const getSelectedKey = () => {
    const path = location.pathname;

    if (path === "/admin") return "1";
    if (path === "/admin/report") return "1";

    if (path.startsWith("/admin/user-list")) return "2.1";
    if (path.startsWith("/admin/add-user")) return "2.2";
    if (path.startsWith("/admin/client-list")) return "7.1";
    if (path.startsWith("/admin/add-client")) return "7.2";
    if (path.startsWith("/admin/event-list")) return "3.1";
    if (path.startsWith("/admin/add-event")) return "3.2";
    if (path.startsWith("/admin/ticket-list")) return "4.1";
    if (path.startsWith("/admin/add-ticket")) return "4.2";
    if (path.startsWith("/admin/discount-code-list")) return "5.1";
    if (path.startsWith("/admin/discount-code")) return "5.2";
    if (path.startsWith("/admin/expiring-vouchers")) return "5.3";
    if (path.startsWith("/admin/voucher-analytics")) return "5.6";
    if (path.startsWith("/admin/review-list")) return "6.1";

    return "1";
  };
  return (
    <div className="flex flex-col justify-between h-full bg-gray-50 shadow-lg transition-all duration-300">
      <div>
        <div className="py-5 px-6 bg-blue-500 text-white font-bold text-lg">
          {collapsed ? (
            <img
              src="../../../public/images/logo.webp"
              alt="Logo"
              className="h-8 w-8"
            />
          ) : (
            "AdminDashBoard"
          )}
        </div>
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={[getSelectedKey()]}
          items={[
            {
              key: "1",
              icon: (
                <Tooltip title={!collapsed ? "" : "Bảng điều khiển"}>
                  <TfiDashboard />
                </Tooltip>
              ),
              label: <Link to="/admin/report">Bảng điều khiển</Link>,
            },
            // {
            //   key: "6",
            //   icon: (
            //     <Tooltip title={!collapsed ? "" : "Bảng điều khiển"}>
            //       <MdPieChartOutlined />{" "}
            //     </Tooltip>
            //   ),
            //   label: <Link to="/admin/report">Bảng Thống Kê</Link>,
            // },
            {
              key: "2",
              icon: (
                <Tooltip title={!collapsed ? "" : "Quản lý người dùng"}>
                  <LuUsers />
                </Tooltip>
              ),
              label: "Quản lý người dùng",
              children: [
                {
                  key: "2.1",
                  label: (
                    <Link to="/admin/user-list">Danh sách người dùng</Link>
                  ),
                },
                {
                  key: "2.2",
                  label: <Link to="/admin/add-user">Thêm mới người dùng</Link>,
                },
              ],
            },
            {
              key: "3",
              icon: (
                <Tooltip title={!collapsed ? "" : "Quản lý sự kiện"}>
                  <LuCalendarPlus />
                </Tooltip>
              ),
              label: "Quản lý sự kiện",
              children: [
                {
                  key: "3.1",
                  label: <Link to="/admin/event-list">Danh sách sự kiện</Link>,
                },
                {
                  key: "3.2",
                  label: <Link to="/admin/add-event">Thêm mới sự kiện</Link>,
                },
              ],
            },
            {
              key: "4",
              icon: (
                <Tooltip title={!collapsed ? "" : "Quản lý vé"}>
                  <AiOutlineTag />
                </Tooltip>
              ),
              label: "Quản lý vé",
              children: [
                {
                  key: "4.1",
                  label: <Link to="ticket-list">Danh sách vé</Link>,
                },
                {
                  key: "4.2",
                  label: <Link to="/admin/add-ticket">Thêm mới vé</Link>,
                },
              ],
            },
            {
              key: "5",
              icon: (
                <Tooltip title={!collapsed ? "" : "Quản lý mã giảm giá"}>
                  <AiOutlinePercentage />
                </Tooltip>
              ),
              label: "Quản lý mã giảm giá",
              children: [
                {
                  key: "5.1",
                  label: (
                    <Link to="/admin/discount-code-list">
                      Danh sách mã giảm giá
                    </Link>
                  ),
                },
                {
                  key: "5.2",
                  label: (
                    <Link to="/admin/discount-code">Thêm mới mã giảm giá</Link>
                  ),
                },
                // {
                //   key: "5.3",
                //   label: (
                //     <Link to="/admin/expiring-voucher">
                //       Cập Nhật Mã Hết Hạn
                //     </Link>
                //   ),
                // },
              ],
            },

            {
              key: "6",
              icon: (
                <Tooltip
                  title={!collapsed ? "" : <div> "Danh sách đánh giá"</div>}
                >
                  <AiOutlineCheckCircle />
                </Tooltip>
              ),
              label: (
                <Link to="/admin/rating-list">
                  {" "}
                  {/* <span className="">
                    <Badge count={5} offset={[10, 0]}> */}
                  <span>Danh sách đánh giá</span>
                  {/* </Badge>
                  </span> */}
                </Link>
              ),
            },
          ]}
        />
      </div>
      <div
        onClick={() => {
          localStorage.clear();
          navigate("/");
        }}
        className="flex items-center gap-2 px-6 mb-10 cursor-pointer"
      >
        <MdLogout />
        <p className={`w-full truncate ${collapsed}`}>Đăng xuất</p>
      </div>
    </div>
  );
};

export default MenuSidebar;
