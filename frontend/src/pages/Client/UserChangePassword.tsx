import React, { useState } from "react";
import { Form, Input, Select, Button, Upload, notification } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "tailwindcss/tailwind.css";

const { Option } = Select;
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
    <div className="w-full lg:py-10 py-4 border pb-[199px] mt-36">
      <div className="px-[600px] ">
        <h2 className="text-xl font-bold mb-4">Đổi mật khẩu</h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <Form.Item
            label="Mật khẩu cũ"
            name="old_password"
            rules={[
              { required: true, message: "Please enter your old_password" },
            ]}
          >
            <Input.Password placeholder="Mật khẩu cũ" />
          </Form.Item>
          <Form.Item
            label="Mật khẩu mới"
            name="new_password"
            rules={[
              { required: true, message: "Please enter your new_password" },
            ]}
          >
            <Input.Password placeholder="Mật khẩu cũ" />
          </Form.Item>
          <Form.Item
            label="Nhập lại mật khẩu mới"
            name="confirm_password"
            rules={[
              { required: true, message: "Please enter your confirm_password" },
            ]}
          >
            <Input.Password placeholder="Mật khẩu cũ" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-fit  ">
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default UserChangePassword;
