import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../axios";

const AddClient = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post("/users/create", data);
      toast.success("Thêm người dùng thành công!");
      navigate("/admin/user-list");
    } catch (error) {
      if (error?.response?.status === 401) {
        navigate("/auth");
      } else {
        toast.error("Lỗi khi thêm người dùng. Vui lòng thử lại!");
        console.error(error);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 mx-auto shadow">
      <div className="bg-gray-100 rounded-lg p-8 mx-auto max-w-md shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
          Thêm người dùng
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Tên */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Tên
            </label>
            <input
              type="text"
              {...register("name", { required: "Tên là bắt buộc." })}
              className={`border border-gray-300 rounded-lg w-full px-4 py-2 focus:outline-none focus:ring-2 ${
                errors.name ? "focus:ring-red-500" : "focus:ring-blue-500"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          {/* Email */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email là bắt buộc.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Email không hợp lệ.",
                },
              })}
              className={`border border-gray-300 rounded-lg w-full px-4 py-2 focus:outline-none focus:ring-2 ${
                errors.email ? "focus:ring-red-500" : "focus:ring-blue-500"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          {/* Mật khẩu */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              {...register("password", {
                required: "Mật khẩu là bắt buộc.",
                minLength: {
                  value: 6,
                  message: "Mật khẩu phải có ít nhất 6 ký tự.",
                },
              })}
              className={`border border-gray-300 rounded-lg w-full px-4 py-2 focus:outline-none focus:ring-2 ${
                errors.password ? "focus:ring-red-500" : "focus:ring-blue-500"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          {/* Xác nhận mật khẩu */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              {...register("password_confirmation", {
                required: "Xác nhận mật khẩu là bắt buộc.",
              })}
              className={`border border-gray-300 rounded-lg w-full px-4 py-2 focus:outline-none focus:ring-2 ${
                errors.password_confirmation
                  ? "focus:ring-red-500"
                  : "focus:ring-blue-500"
              }`}
            />
            {errors.password_confirmation && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password_confirmation.message}
              </p>
            )}
          </div>
          {/* Số điện thoại */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Số điện thoại
            </label>
            <input
              type="text"
              {...register("phone", {
                required: "Số điện thoại là bắt buộc.",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Số điện thoại không hợp lệ.",
                },
              })}
              className={`border border-gray-300 rounded-lg w-full px-4 py-2 focus:outline-none focus:ring-2 ${
                errors.phone ? "focus:ring-red-500" : "focus:ring-blue-500"
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>
          {/* Địa chỉ */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Địa chỉ
            </label>
            <input
              type="text"
              {...register("address")}
              className="border border-gray-300 rounded-lg w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Nút Submit */}
          <div className="flex justify-between">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            >
              Thêm người dùng
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/user-list")}
              className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300"
            >
              Quay lại danh sách
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClient;
