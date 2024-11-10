import React, { useState } from "react";
import { Input, Button, Select, DatePicker, notification } from "antd";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Option } = Select;

const AddDiscountCode = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

<<<<<<< HEAD
  const [formData, setFormData] = useState({
    code: "",
    status: "",
    expiryDate: "",
    usageCount: "",
    description: "",
    discountType: "",
    startDate: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSelectChange = (value, id) => {
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      notification.success({
        message: "Thêm mã giảm giá thành công",
        description: `Mã giảm giá "${formData.code}" đã được thêm.`,
      });
      setLoading(false);
      navigate("/admin/discount-code");
=======
  const onFinish = (values) => {
    setLoading(true);
    setTimeout(() => {
      notification.success({
        message: "Thêm mã giảm giá thành công",
        description: `Mã giảm giá "${values.code}" đã được thêm.`,
      });
      setLoading(false);
      navigate("/admin/discount-code-list");
>>>>>>> origin/main
    }, 1500);
  };

  return (
    <div>
<<<<<<< HEAD
      <form
        className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg"
        onSubmit={handleSubmit}
      >
=======
      <form className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
>>>>>>> origin/main
        <h2 className="text-2xl font-bold text-center mb-5">
          Thêm mới voucher
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="code"
              className="block text-sm font-medium text-gray-700"
            >
              Mã giảm giá
            </label>
            <input
              type="text"
              id="code"
<<<<<<< HEAD
              value={formData.code}
              onChange={handleChange}
=======
>>>>>>> origin/main
              placeholder="Nhập mã giảm giá"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              Trạng thái
            </label>
            <select
              id="status"
<<<<<<< HEAD
              value={formData.status}
              onChange={(e) => handleSelectChange(e.target.value, "status")}
=======
>>>>>>> origin/main
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option>Chọn trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="expired">Hết hạn</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="expiryDate"
              className="block text-sm font-medium text-gray-700"
            >
              Ngày hết hạn
            </label>
            <input
              type="date"
              id="expiryDate"
<<<<<<< HEAD
              value={formData.expiryDate}
              onChange={handleChange}
=======
>>>>>>> origin/main
              placeholder="dd/mm/yyyy"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
<<<<<<< HEAD

=======
>>>>>>> origin/main
          <div>
            <label
              htmlFor="usageCount"
              className="block text-sm font-medium text-gray-700"
            >
              Số lần sử dụng
            </label>
            <input
              type="number"
              id="usageCount"
<<<<<<< HEAD
              value={formData.usageCount}
              onChange={handleChange}
=======
>>>>>>> origin/main
              placeholder="Nhập số lần sử dụng"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Mô tả
            </label>
            <textarea
              id="description"
<<<<<<< HEAD
              value={formData.description}
              onChange={handleChange}
=======
>>>>>>> origin/main
              rows={3}
              placeholder="Mô tả mã giảm giá..."
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
<<<<<<< HEAD

=======
>>>>>>> origin/main
          <div>
            <label
              htmlFor="discountType"
              className="block text-sm font-medium text-gray-700"
            >
              Loại mã giảm giá
            </label>
            <select
              id="discountType"
<<<<<<< HEAD
              value={formData.discountType}
              onChange={(e) =>
                handleSelectChange(e.target.value, "discountType")
              }
=======
>>>>>>> origin/main
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option>Chọn loại mã giảm giá</option>
              <option value="percentage">Theo phần trăm</option>
              <option value="amount">Theo số tiền</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700"
            >
              Ngày bắt đầu
            </label>
            <input
              type="date"
              id="startDate"
<<<<<<< HEAD
              value={formData.startDate}
              onChange={handleChange}
=======
>>>>>>> origin/main
              placeholder="dd/mm/yyyy"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-start space-x-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
<<<<<<< HEAD
            disabled={loading}
          >
            {loading ? "Đang lưu..." : "Lưu"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/discount-code-list")}
=======
          >
            Lưu
          </button>
          <button
            type="button"
>>>>>>> origin/main
            className="px-6 py-2 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Quay lại
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDiscountCode;
