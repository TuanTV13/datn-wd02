import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { TicketsCT } from "../../../Contexts/TicketContext";

const ListTicketDelete = () => {
  const { ticketDelete, onRestore} = useContext(TicketsCT);
  const handleRestore = (id: number) => {
    onRestore(id); 
  };
  return (
    <div>
      <div className="bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center">Danh sách vé đã xóa</h2>
        <div className="p-4 flex justify-between">
          <div className="flex space-x-4">
            <Link
              to="/admin/ticket-list"
              className="bg-blue-500 text-white px-4 py-2 rounded-[10px]"
            >
              Danh sách vé
            </Link>
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
              <th className="p-4 border border-gray-300">Mã vé</th>
              <th className="p-4 border border-gray-300">Tên sự kiện</th>
              <th className="p-4 border border-gray-300">Loại vé</th>
              <th className="p-4 border border-gray-300">Số lượng</th>
              <th className="p-4 border border-gray-300">Trạng thái</th>
              <th className="p-4 border border-gray-300">Giá</th>
              <th className="p-4 border border-gray-300">
                Thời gian bắt đầu bán
              </th>
              <th className="p-4 border border-gray-300">
                Thời gian kết thúc bán
              </th>
              <th className="p-4 border border-gray-300">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-center">
            {ticketDelete?.length > 0 ? (
              ticketDelete.map((item, index: number) => (
                <tr key={item.id}>
                  <td className="p-4 border border-gray-300">{index + 1}</td>
                  <td className="p-4 border border-gray-300">{item.id}</td>
                  <td className="p-4 border border-gray-300">
                    {item.event?.name}
                  </td>
                  <td className="p-4 border border-gray-300">
                    {item.ticket_type}
                  </td>
                  <td className="p-4 border border-gray-300">
                    {item.quantity}
                  </td>
                  <td className="p-4 border border-gray-300">
                    {item.status}
                  </td>
                  <td className="p-4 border border-gray-300">{item.price}</td>
                  <td className="p-4 border border-gray-300">
                    {item.sale_start}
                  </td>
                  <td className="p-4 border border-gray-300">
                    {item.sale_end}
                  </td>
                  <td className="p-4 border border-gray-300">
                    <div className="flex items-center space-y-1 justify-between ">
                      <button onClick={() => handleRestore(Number(item.id))}>
                        Khôi phục
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={9}
                  className="p-4 border border-gray-300 text-center"
                >
                  Không có vé nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListTicketDelete;
