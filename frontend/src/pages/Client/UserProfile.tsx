import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Card, Descriptions, Image } from "antd";
import "tailwindcss/tailwind.css";
import axiosInstance from "../../axios";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Gọi API lấy dữ liệu người dùng
    axiosInstance
      .get("/user", {})
      .then((response) => {
        // Lưu thông tin người dùng vào state
        setUser(response.data.user);
        setLoading(false);
      })
      .catch((error) => {
        if (error?.response?.status === 401) navigate("/auth");

        console.error("Error fetching user data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full lg:py-10 py-4 border pb-[199px] mt-36">
      <div className="px-80 ">
        <Card className="bg-white p-6 rounded-lg shadow-md">
          <Descriptions title="Thông tin cá nhân" bordered column={1}>
            <Descriptions.Item label="Tên">{user.name}</Descriptions.Item>
            <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {user.phone || "Chưa cập nhật"}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">
              {user.address || "Chưa cập nhật"}
            </Descriptions.Item>
            <Descriptions.Item label="Ảnh đại diện">
              {user.image ? (
                <Image width={150} src={user.image} />
              ) : (
                "Chưa cập nhật"
              )}
            </Descriptions.Item>
          </Descriptions>
          <a href="/profile/edit">
            <div className="flex justify-end mt-4">
              <Button type="primary">Sửa</Button>
            </div>
          </a>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
