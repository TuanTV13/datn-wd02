import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Input, Button } from "antd";
import "tailwindcss/tailwind.css";
import axiosInstance from "../../axios";
import { useNavigate } from "react-router-dom";

const UserProfileEdit = () => {
  const [form] = Form.useForm();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Gọi API GET để lấy dữ liệu người dùng
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/v1/user", {
        headers: {
          Authorization:
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL3YxL2xvZ2luIiwiaWF0IjoxNzMxNjQ0MzIwLCJleHAiOjQ4Mzg3NjQ0MzIwLCJuYmYiOjE3MzE2NDQzMjAsImp0aSI6Ik9Eb3IwWjZWeUoyTDIxUksiLCJzdWIiOiI2IiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.-xRi4wH0bh3ysiTH9pMWmWaYgGoKiiYpfTkfx2J_D18",
        },
      })
      .then((response) => {
        // Lưu thông tin người dùng vào state
        setUser(response.data.user);
        setLoading(false);
        // Điền thông tin vào form
        form.setFieldsValue({
          name: response.data.user.name,
          email: response.data.user.email,
          phone: response.data.user.phone,
          address: response.data.user.address,
          avatar: response.data.user.image,
        });
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setLoading(false);
      });
  }, [form]);

  // Gọi API PUT để cập nhật thông tin người dùng
  const handleSubmit = (values) => {
    const formData = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      address: values.address,
      image: values.avatar, // Lưu link ảnh từ form
    };

    axiosInstance
      .put(`/user/update-profile/${user.id}`, formData)
      .then((response) => {
        navigate("/profile");
        console.log("User updated successfully:", response.data);
      })
      .catch((error) => {
        if (error?.response?.status === 401) navigate("/auth");

        console.error("Error updating user data:", error);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

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
            label="Link Ảnh Đại Diện"
            name="avatar"
            rules={[{ required: true, message: "Please enter the avatar URL" }]}
          >
            <Input placeholder="Avatar URL" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-fit">
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default UserProfileEdit;
