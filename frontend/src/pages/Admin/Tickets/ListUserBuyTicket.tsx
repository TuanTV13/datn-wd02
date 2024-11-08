import React from "react";
import { Link } from "react-router-dom";

const ListUserBuyTicket = () => {
  return (
    <div>
      <div className="bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center">
          Danh sách người dùng mua vé
        </h2>
        <div className="p-4 flex justify-between">
          <div className="flex space-x-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-[10px]">
              Chờ duyệt
            </button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-[10px]">
              Đã thanh toán
            </button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-[10px]">
              Chưa thanh toán
            </button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-[10px]">
              Đã hủy
            </button>
          </div>
          <div className="flex space-x-4 items-center">
            <span>Hiển thị:</span>
            <select className="border rounded px-2 py-1">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
            <button className="bg-gray-200 px-4 py-2 rounded-[10px]">
              Bộ lọc
            </button>
            <button className="bg-yellow-500 text-white px-4 py-2 rounded-[10px]">
              Xuất PDF
            </button>
          </div>
        </div>
        <table className="min-w-full table-auto border border-gray-700">
          <thead className="bg-gray-100 items-center text-center">
            <tr>
              <th className="p-4 border border-gray-300">STT</th>
              <th className="p-4 border border-gray-300">Họ tên</th>
              <th className="p-4 border border-gray-300">Email</th>
              <th className="p-4 border border-gray-300">Số điện thoại</th>
              <th className="p-4 border border-gray-300">Sự kiện </th>
              <th className="p-4 border border-gray-300">Loại vé</th>
              <th className="p-4 border border-gray-300">Số lượng</th>
              <th className="p-4 border border-gray-300">Ngày mua vé</th>
              <th className="p-4 border border-gray-300">Tổng tiền</th>
              <th className="p-4 border border-gray-300">
                Phương thức thanh toán
              </th>
              <th className="p-4 border border-gray-300">
                Trạng thái thanh toán
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-center">
            <tr>
              <td className="p-4 border border-gray-300">1</td>
              <td className="p-4 border border-gray-300">Nguyễn Văn A</td>
              <td className="p-4 border border-gray-300">ABC123@gmail.com</td>
              <td className="p-4 border border-gray-300">0987654321</td>
              <td className="p-4 border border-gray-300">Sự kiện Âm nhạc</td>
              <td className="p-4 border border-gray-300">Vé VIP</td>
              <td className="p-4 border border-gray-300">2</td>
              <td className="p-4 border border-gray-300">21/08/2024</td>
              <td className="p-4 border border-gray-300">1.200.000 VND</td>
              <td className="p-4 border border-gray-300">Thẻ tín dụng</td>
              <td className="p-4 border border-gray-300">Đã thanh toán</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <Link
          to={"/admin/ticket-list"}
          className="px-6 py-2 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Quay lại
        </Link>
      </div>
    </div>
  );
};

export default ListUserBuyTicket;
