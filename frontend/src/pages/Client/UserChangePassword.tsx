import React, { useState } from "react";
import { Form, Input, Button, notification } from "antd";
import "tailwindcss/tailwind.css";

const UserChangePassword = () => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    if (values.confirm_password !== values.new_password) {
      notification.error({
        message: "Mật khẩu mới và mật khẩu nhập lại không khớp",
      });
      return;
    }
    notification.success({
      message: "Đổi mật khẩu thành công",
    });
  };

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
            name="old_password"
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
