import React, { useContext, useState } from "react";
import { Input, Button, Select, DatePicker, notification } from "antd";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import axios from "axios";
import api from "../../../api_service/api";
import axiosInstance from "../../../axios";
import { TicketsCT } from "../../../Contexts/TicketContext";
import { register } from "../../../api_service/auth";

const { Option } = Select;

const AddDiscountCode = (props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { events } = useContext(TicketsCT);

  const [formData, setFormData] = useState({
    code: "",
    status: "published",
    startDate: "",
    endDate: "",
    discountType: "fixed",
    discountValue: "",
    minOrderValue: 1,
    maxOrderValue: 1,
    usageCount: "",
    description: "",
    issueQuantity: 1,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Chuyển đổi ngày theo định dạng yyyy-mm-dd
    const startTime = formData.startDate;
    const endTime = formData.endDate;

    const requestData = {
      creator_id: 3,
      event_id: props.eventId,
      code: formData.code,
      discount_type: formData.discountType,
      discount_value: formData.discountValue,
      min_order_value: formData.minOrderValue,
      max_order_value: formData.maxOrderValue,
      issue_quantity: formData.issueQuantity,
      start_time: startTime,
      end_time: endTime,
      used_limit: 1,
      status: formData.status,
    };

    try {
      const response = await axiosInstance.post(
        "/vouchers/create",
        requestData,
        {}
      );
      notification.success({
        message: "Thêm mã giảm giá thành công",
        description: `Mã giảm giá "${formData.code}" đã được thêm.`,
      });
      setLoading(false);
      if (!props.eventId) navigate("/admin/discount-code-list");
    } catch (error) {
      setLoading(false);
      notification.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra khi thêm mã giảm giá.",
      });
    }
  };

  return (
    <div>
      <form
        className=" mx-auto p-6 bg-white shadow-md rounded-lg"
        onSubmit={handleSubmit}
      >
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
              required
              value={formData.code}
              onChange={handleChange}
              placeholder="Nhập mã giảm giá"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {!props.eventId && (
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-700"
              >
                Sự kiện
              </label>
              <select
                id="event_id"
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                {...register("event_id", { required: true })}
              >
                <option value="">Chọn sự kiện</option>
                {events?.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              Trạng thái
            </label>
            <select
              id="status"
              required
              value={formData.status}
              onChange={(e) => handleSelectChange(e.target.value, "status")}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option>Chọn trạng thái</option>
              <option value="published">Hoạt động</option>
              <option value="draft">Bản nháp</option>
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
              required
              value={formData.startDate}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700"
            >
              Ngày kết thúc
            </label>
            <input
              type="date"
              id="endDate"
              required
              value={formData.endDate}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="discountType"
              className="block text-sm font-medium text-gray-700"
            >
              Loại mã giảm giá
            </label>
            <select
              id="discountType"
              value={formData.discountType}
              required
              onChange={(e) =>
                handleSelectChange(e.target.value, "discountType")
              }
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option>Chọn loại mã giảm giá</option>
              <option value="fixed">Cố định</option>
              <option value="fixed">Theo phần trăm</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="discountValue"
              className="block text-sm font-medium text-gray-700"
            >
              Giá trị giảm giá
            </label>
            <input
              type="number"
              min={1}
              id="discountValue"
              value={formData.discountValue}
              required
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="minOrderValue"
              className="block text-sm font-medium text-gray-700"
            >
              Giá trị đơn hàng tối thiểu
            </label>
            <input
              type="number"
              min={1}
              id="minOrderValue"
              value={formData.minOrderValue}
              required
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="maxOrderValue"
              className="block text-sm font-medium text-gray-700"
            >
              Giá trị đơn hàng tối đa
            </label>
            <input
              type="number"
              min={1}
              id="maxOrderValue"
              value={formData.maxOrderValue}
              required
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="issueQuantity"
              className="block text-sm font-medium text-gray-700"
            >
              Số lượng phát hành
            </label>
            <input
              type="number"
              min={1}
              id="issueQuantity"
              value={formData.issueQuantity}
              required
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-start space-x-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? "Đang lưu..." : "Lưu"}
          </button>
          {!props.eventId && (
            <button
              type="button"
              onClick={() => navigate("/admin/discount-code-list")}
              className="px-6 py-2 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Danh sách
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddDiscountCode;
