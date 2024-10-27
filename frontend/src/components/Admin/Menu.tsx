import { Menu } from "antd";
import { LuCalendarPlus, LuUsers } from "react-icons/lu";
import { MdLogout } from "react-icons/md";
import { TfiDashboard } from "react-icons/tfi";
import {
  AiOutlineTag,
  AiOutlinePercentage,
  AiOutlineCheckCircle,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { Badge, Tooltip } from "antd"; // Thêm Badge và Tooltip
import React from 'react';


type Props = {
  collapsed?: boolean;
};

const MenuSidebar = ({ collapsed = false }: Props) => {
  return (
    <div className="flex flex-col justify-between h-full bg-gray-50 shadow-lg transition-all duration-300">
      <div>
      <div className="py-5 px-6 bg-blue-500 text-white font-bold text-lg">
          {collapsed ? (
            <img src="../../../public/images/logo.webp" alt="Logo" className="h-8 w-8" />
          ) : (
            "AdminDashBoard"
          )}
        </div>
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: (
                <Tooltip title={!collapsed ? "" : "Bảng điều khiển"}>
                  <TfiDashboard />
                </Tooltip>
              ),
              label: <Link to="/admin">Bảng điều khiển</Link>,
            },
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
              ],
            },
            {
              key: "6",
              icon: (
                <Tooltip title={!collapsed ? "" : "Danh sách đánh giá"}>
                  <AiOutlineCheckCircle />
                </Tooltip>
              ),
              label: (
                <span className="relative">
                <Badge count={5} offset={[10, 0]}>
                  <span className="whitespace-nowrap">Danh sách đánh giá</span>
                </Badge>
              </span>
              
              ),
            },
          ]}
        />
      </div>
      <div className="flex items-center gap-2 px-6 mb-10 cursor-pointer">
        <MdLogout />
        <p className={`w-full truncate ${collapsed && "hidden"}`}>Đăng xuất</p>
      </div>
    </div>
  );
};

export default MenuSidebar;
