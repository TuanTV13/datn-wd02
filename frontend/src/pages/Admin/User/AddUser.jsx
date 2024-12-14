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

        if (Array.isArray(error.response.data.errors)) {
          toast.error(error.response.data.errors.join(', '));
        } else if (typeof error.response.data.errors === 'object') {
          const errorMessages = Object.values(error.response.data.errors).join(', ');
          toast.error(errorMessages);
        } else {
          toast.error("Có lỗi xảy ra.");
        }

        
        console.log(error);
        
      });
  };

  return (
    <div className="bg-white rounded-lg p-6 mx-auto shadow">
  
  <form onSubmit={handleSubmit} className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-8 rounded-xl shadow-lg max-w-lg mx-auto">
  <h2 className="text-3xl font-bold text-white text-center mb-6">Thêm người dùng</h2>

  <div className="mb-6">
    <label className="block text-gray-100 text-lg font-semibold">Tên <span className="text-red-500">*</span></label>
    <input
      type="text"
      name="name"
      value={formData.name}
      onChange={handleChange}
      className="border-2 border-gray-300 rounded-lg w-full px-4 py-3 mt-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
    />
  </div>

  <div className="mb-6">
    <label className="block text-gray-100 text-lg font-semibold">Email <span className="text-red-500">*</span></label>
    <input
      type="email"
      name="email"
      value={formData.email}
      onChange={handleChange}
      className="border-2 border-gray-300 rounded-lg w-full px-4 py-3 mt-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
    />
  </div>

  <div className="mb-6">
    <label className="block text-gray-100 text-lg font-semibold">Số điện thoại <span className="text-red-500">*</span></label>
    <input
      type="text"
      name="phone"
      value={formData.phone}
      onChange={handleChange}
      className="border-2 border-gray-300 rounded-lg w-full px-4 py-3 mt-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
    />
  </div>

  <div className="mt-8 flex justify-center">
    <button
      type="submit"
      className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 transition duration-300"
    >
      Thêm người dùng
    </button>
  </div>
</form>

</div>

  );
};

export default AddClient;
