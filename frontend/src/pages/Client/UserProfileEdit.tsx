import React, { useState } from "react";
import { Form, Input, Select, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "tailwindcss/tailwind.css";

const { Option } = Select;
const UserProfileEdit = () => {
  const [form] = Form.useForm();
  const [files, setFiles] = useState<any>([]);
  const handleSubmit = (values) => {
    console.log("Form values:", values);
  };
  return (
    <div className="w-full lg:py-10 py-4 border pb-[199px] mt-36">
      <div className="px-80 ">
        <h2 className="text-xl font-bold mb-4">User Profile</h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <Form.Item
            label="Tên"
            name="name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input placeholder="Name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please enter a valid email",
              },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: "Please enter your phone number" },
            ]}
          >
            <Input placeholder="Phone" />
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: "Please enter your address" }]}
          >
            <Input placeholder="Address" />
          </Form.Item>
          <Form.Item
            label="Tỉnh thành"
            name="province_id"
            rules={[{ required: true, message: "Please select a province" }]}
          >
            <Select placeholder="Select a province">
              <Option value="1">Province 1</Option>
              <Option value="2">Province 2</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Quận/huyện"
            name="district_id"
            rules={[{ required: true, message: "Please select a district" }]}
          >
            <Select placeholder="Select a district">
              <Option value="1">District 1</Option>
              <Option value="2">District 2</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Xã"
            name="ward_id"
            rules={[{ required: true, message: "Please select a ward" }]}
          >
            <Select placeholder="Select a ward">
              <Option value="1">Ward 1</Option>
              <Option value="2">Ward 2</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Avatar">
            <Upload
              multiple
              fileList={files}
              beforeUpload={(file, fileList) => {
                console.log(fileList);
                setFiles(fileList);
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
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

export default UserProfileEdit;
