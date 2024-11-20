import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Input, Button, notification } from "antd";
import "tailwindcss/tailwind.css";
import axiosInstance from "../../axios";
import { useNavigate } from "react-router-dom";

const UserChangePassword = () => {
  const [form] = Form.useForm();
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Gọi API GET để lấy thông tin người dùng và lưu id
  useEffect(() => {
    axiosInstance
      .get("/user", {})
      .then((response) => {
        setUserId(response.data.user.id);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setLoading(false);
      });
  }, []);

  // Hàm xử lý đổi mật khẩu
  const handleSubmit = (values) => {
    if (values.confirm_password !== values.new_password) {
      notification.error({
        message: "Mật khẩu mới và mật khẩu nhập lại không khớp",
      });
      return;
    }

    if (!userId) {
      notification.error({
        message: "Không tìm thấy thông tin người dùng",
      });
      return;
    }

    // Gọi API để thay đổi mật khẩu
    axiosInstance
      .put(`/user/change-password/${userId}`, {
        password: values.password,
        new_password: values.new_password,
      })
      .then((response) => {
        notification.success({
          message: "Đổi mật khẩu thành công",
        });
      })
      .catch((error) => {
        console.error("Error changing password:", error);
        if (error?.response?.status === 401) navigate("/auth");

        notification.error({
          message: "Có lỗi xảy ra khi đổi mật khẩu",
        });
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full lg:py-12 py-6 mt-36 flex justify-center">
      <div className="w-full max-w-md px-6 py-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Đổi mật khẩu
        </h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="space-y-6"
        >
          <Form.Item
            label="Mật khẩu cũ"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ" }]}
          >
            <Input.Password
              placeholder="Nhập mật khẩu cũ"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="new_password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới" }]}
          >
            <Input.Password
              placeholder="Nhập mật khẩu mới"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </Form.Item>

          <Form.Item
            label="Nhập lại mật khẩu mới"
            name="confirm_password"
            rules={[
              { required: true, message: "Vui lòng nhập lại mật khẩu mới" },
            ]}
          >
            <Input.Password
              placeholder="Nhập lại mật khẩu mới"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default UserChangePassword;
