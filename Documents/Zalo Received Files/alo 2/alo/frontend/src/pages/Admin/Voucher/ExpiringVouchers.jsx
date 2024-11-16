import React, { useEffect, useState } from "react";
import { Input, Button, DatePicker, notification, Card } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import moment from "moment";
import axios from "axios"; // Import axios
import api from "../../../api_service/api";

const ExpiringVoucherForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { state } = useLocation();
  useEffect(() => {
    if (!state) {
      navigate("/admin/discount-code-list");
    }
  }, []);
  // Lấy giá trị mặc định từ state?.item
  const [voucherData, setVoucherData] = useState({
    code: state?.item?.code || "",
    status: state?.item?.status || "published",
    end_time: state?.item?.end_time ? moment(state?.item?.end_time) : null,
    issue_quantity: state?.item?.issue_quantity || 0,
    description: state?.item?.description || "",
  });

  // Xử lý submit form
  const onFinish = async () => {
    setLoading(true);
    try {
      // Gửi yêu cầu PUT với axios
      const response = await api.put(
        `/vouchers/${state?.item?.id}/update`,
        {
          ...state?.item,
          code: voucherData.code,
          status: voucherData.status,
          end_time: voucherData.end_time.format("YYYY-MM-DD"),
          issue_quantity: voucherData.issue_quantity,
          description: voucherData.description,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL3YxL2xvZ2luIiwiaWF0IjoxNzMxNjQ0MzIwLCJleHAiOjQ4Mzg3NjQ0MzIwLCJuYmYiOjE3MzE2NDQzMjAsImp0aSI6Ik9Eb3IwWjZWeUoyTDIxUksiLCJzdWIiOiI2IiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.-xRi4wH0bh3ysiTH9pMWmWaYgGoKiiYpfTkfx2J_D18",
          },
        }
      );

      if (response.status === 200) {
        notification.success({
          message: "Cập nhật mã giảm giá thành công",
          description: `Mã giảm giá "${voucherData.code}" đã được cập nhật.`,
        });
        navigate("/admin/discount-code-list");
      } else {
        notification.error({
          message: "Cập nhật thất bại",
          description: "Đã xảy ra lỗi khi cập nhật mã giảm giá.",
        });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối tới máy chủ.",
      });
    }
    setLoading(false);
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
            <Input
              id="code"
              placeholder="Nhập mã giảm giá"
              value={voucherData.code}
              onChange={(e) =>
                setVoucherData({ ...voucherData, code: e.target.value })
              }
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
              value={voucherData.status}
              onChange={(e) =>
                setVoucherData({ ...voucherData, status: e.target.value })
              }
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="published">Hoạt động</option>
              <option value="draft">Hết hạn</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="end_time"
              className="block text-sm font-medium text-gray-700"
            >
              Ngày hết hạn
            </label>
            <DatePicker
              id="end_time"
              value={voucherData.end_time}
              onChange={(date) =>
                setVoucherData({ ...voucherData, end_time: date })
              }
              style={{ width: "100%", padding: "12px 16px" }}
              format="DD/MM/YYYY"
            />
          </div>

          <div>
            <label
              htmlFor="issue_quantity"
              className="block text-sm font-medium text-gray-700"
            >
              Số lần sử dụng
            </label>
            <Input
              type="number"
              id="issue_quantity"
              value={voucherData.issue_quantity}
              onChange={(e) =>
                setVoucherData({
                  ...voucherData,
                  issue_quantity: e.target.value,
                })
              }
              placeholder="Nhập số lần sử dụng"
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
              value={voucherData.description}
              onChange={(e) =>
                setVoucherData({ ...voucherData, description: e.target.value })
              }
              placeholder="Mô tả mã giảm giá..."
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-start space-x-4">
          <button
            type="button"
            onClick={onFinish}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? "Đang cập nhật..." : "Lưu"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/expiring-voucher-list")}
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
