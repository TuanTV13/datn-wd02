import React, { useEffect, useState } from "react";
import { Input, Button, DatePicker, notification, Card } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import axiosInstance from "../../../axios";

const ExpiringVoucherForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { state } = useLocation();

  useEffect(() => {
    if (!state) {
      navigate("/admin/discount-code-list");
    }
  }, [state, navigate]);

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
      const response = await axiosInstance.put(
        `/vouchers/${state?.item?.id}/update`,
        {
          ...state?.item,
          start_time: moment(new Date()).format("YYYY-MM-DD"),
          code: voucherData.code,
          end_time: voucherData.end_time.format("YYYY-MM-DD"),
          issue_quantity: voucherData.issue_quantity,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer YOUR_TOKEN_HERE", // Thay thế bằng token thực tế
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
      <Card className="max-w mx-auto p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-5">
          Cập nhật mã giảm giá
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          {/* Cột hiển thị thông tin voucher hiện tại */}
          <div className=" border-r">
            <h3 className="text-lg font-semibold">
              Thông tin mã giảm giá hiện tại
            </h3>
            <p>
              <strong>Mã giảm giá:</strong> {voucherData.code}
            </p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              {voucherData.status === "published" ? "Hoạt động" : "Bản nháp"}
            </p>
            <p>
              <strong>Ngày hết hạn:</strong>{" "}
              {voucherData.end_time
                ? voucherData.end_time.format("DD/MM/YYYY")
                : "Chưa xác định"}
            </p>
            <p>
              <strong>Số lần sử dụng:</strong> {voucherData.issue_quantity}
            </p>
          </div>

          {/* Cột chứa các trường để sửa */}
          <div className="lg:col-span-3">
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

            

            <label
              htmlFor="end_time"
              className="block text-sm font-medium text-gray-700 mt-4"
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

            <label
              htmlFor="issue_quantity"
              className="block text-sm font-medium text-gray-700 mt-4"
            >
              Số lần sử dụng
            </label>
            <Input
              type="number"
              min={1}
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
            onClick={() => navigate("/admin/discount-code-list")}
            className="px-6 py-2 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Danh sách
          </button>
        </div>
      </Card>
    </div>
  );
};

export default ExpiringVoucherForm;
