import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import {
  Button,
  Drawer,
  Dropdown,
  Input,
  Layout,
  MenuProps,
  theme,
} from "antd";
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { Outlet } from "react-router-dom";
import MenuSidebar from "../components/admin/Menu";
import Notification from "../components/admin/Notification";
import useWindowSize from "../hooks/hook";

const { Header, Sider, Content } = Layout;
const { Search } = Input;
const items: MenuProps["items"] = [
  {
    key: "1",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.antgroup.com"
      >
        Phùng Quang Trường
      </a>
    ),
  },
  {
    key: "2",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.aliyun.com"
      ></a>
    ),
  },
  {
    key: "3",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.luohanacademy.com"
      ></a>
    ),
  },
];

const LayoutAdmin = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isOpenSibarMobile, setOpenSidebarMobile] = useState(false);
  const { width } = useWindowSize();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    setIsMobile(width <= 820);
  }, [width]);

  const handleToggleSidebar = () => {
    isMobile
      ? setOpenSidebarMobile((prev) => !prev)
      : setCollapsed((prev) => !prev);
  };

  const handleSearch = (value) => {
    console.log(value);
  };

  return (
    <Layout className="h-screen">
      {isMobile ? (
        <Drawer
          title="Danh mục"
          placement="left"
          closable={false}
          onClose={() => setOpenSidebarMobile(false)}
          open={isOpenSibarMobile}
        >
          <MenuSidebar />
        </Drawer>
      ) : (
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <MenuSidebar collapsed={collapsed} />
        </Sider>
      )}

      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div className="flex items-center justify-between pr-5">
            <Button
              type="text"
              icon={
                collapsed || isOpenSibarMobile ? (
                  <ArrowRightOutlined />
                ) : (
                  <ArrowLeftOutlined />
                )
              }
              onClick={handleToggleSidebar}
              style={{ fontSize: "16px", width: 64, height: 64 }}
            />
            <div className="flex items-center gap-5">
              <Search
                placeholder="Tìm kiếm..."
                allowClear
                onSearch={handleSearch}
                style={{ width: 200 }}
              />
              <Notification />
              <Dropdown menu={{ items }} placement="bottomRight" arrow>
                <div className="flex items-center gap-2 cursor-pointer">
                  <FaUser />
                  <p>Admin</p>
                </div>
              </Dropdown>
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutAdmin;
