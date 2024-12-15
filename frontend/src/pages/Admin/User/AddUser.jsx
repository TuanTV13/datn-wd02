import React, { useState } from "react";
import axios from "axios"; // Thêm axios
import axiosInstance from "../../../axios";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import { toast } from "react-toastify";

const AddClient = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    image: "",
    email_verification_token: "",
    email_verified_at: "",
   
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Cấu trúc dữ liệu body theo yêu cầu API
    const requestBody = {
      name: formData.name,
      email: formData.email,
      password: "123456789", // Có thể lấy từ một trường mật khẩu nếu có
      password_confirmation: "123456789", // Xác nhận mật khẩu
      phone: formData.phone,
    };

    // Gọi API để thêm người dùng mới
    axiosInstance
      .post("/users/create", requestBody, {})
      .then((response) => {
        // Reset form sau khi thêm thành công
        setFormData({
          name: "",
          email: "",
          phone: "",
          email_verification_token: "",
          email_verified_at: "",
          status: "Đang hoạt động",
        });
        toast.success({ message: "Thêm người dùng thành công" });
      })
      .catch((error) => {
        if (error?.response?.status === 401) navigate("/auth");

        if (error.response && error.response.data && error.response.data.errors) {
          const errors = error.response.data.errors;
          
          if (typeof errors === 'object') {
            // Lặp qua từng lỗi và hiển thị toast riêng
            Object.values(errors).forEach((errorMessages) => {
              if (Array.isArray(errorMessages)) {
                errorMessages.forEach((msg) => toast.error(msg));
              } else {
                toast.error(errorMessages);
              }
            });
          } else {
            toast.error("Có lỗi xảy ra.");
          }
        } else {
          toast.error("Có lỗi xảy ra.");
        }
        
        
        console.log(error);
        
      });
  };

  return (
    <div className="bg-white rounded-lg p-6 mx-auto shadow">
  <h2 className="text-2xl font-bold mb-4">Thêm người dùng</h2>
  <form onSubmit={handleSubmit}>
    <div className="mb-4">
      <label className="block text-gray-700">Tên <span className="text-red-500">*</span></label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        className="border rounded w-full px-3 py-2"
      />
    </div>
    <div className="mb-4">
      <label className="block text-gray-700">Email <span className="text-red-500">*</span></label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        className="border rounded w-full px-3 py-2"
      />
    </div>
    <div className="mb-4">
      <label className="block text-gray-700">Số điện thoại <span className="text-red-500">*</span></label>
      <input
        type="text"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        className="border rounded w-full px-3 py-2"
      />
    </div>
  
    <div className="mt-6 flex justify-end space-x-4">
      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Thêm người dùng
      </button>
    </div>
  </form>
</div>

  );
};

export default AddClient;
