import React, { useState } from "react";
import { Input, Button, DatePicker, notification, Card } from "antd";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import moment from "moment";

const ExpiringVoucherForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    setTimeout(() => {
      notification.success({
        message: "Cập nhật mã giảm giá thành công",
        description: `Mã giảm giá "${values.code}" đã được cập nhật.`,
      });
      setLoading(false);
      navigate("/admin/expiring-voucher-list");
    }, 1500);
  };

  return (
    <div>
      <Card className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-5">
          Cập nhật voucher sắp hết hạn
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
            <DatePicker
              id="expiryDate"
              placeholder="Chọn ngày hết hạn"
              style={{ width: "100%", padding: "12px 16px" }}
              format="DD/MM/YYYY"
            />
          </div>

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
              rows={3}
              placeholder="Mô tả mã giảm giá..."
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
        </div>

        <div className="mt-6 flex justify-start space-x-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Lưu
          </button>
          <button
            type="button"
            className="px-6 py-2 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Quay lại
          </button>
        </div>
      </Card>
    </div>
  );
};

export default ExpiringVoucherForm;
