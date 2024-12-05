import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TicketsCT } from "../../../Contexts/TicketContext";
import { DeletedTicket } from "../../../interfaces/Ticket";
import api from "../../../api_service/api";
import { message } from 'antd';

const ListTicketDelete = () => {
  const { onRestore } = useContext(TicketsCT);
  const [ticketDelete, setTicketDelete] = useState<DeletedTicket[]>([]); // Dữ liệu vé đã xóa

  useEffect(() => {
    // Gọi API POST để lấy danh sách vé đã xóa
    const fetchDeletedTickets = async () => {
      try {
        const response = await api.post("/tickets/block");
        console.log(response.data.message)
        setTicketDelete(response.data.message);
      } catch (error) {
        console.error("Error fetching deleted tickets:", error);
      }
    };

    fetchDeletedTickets();
  }, []);

  const handleRestore = (id: number,seatId: number) => {
    onRestore(id,seatId); // Hàm khôi phục vé
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
            <button className="bg-green-500 text-white px-4 py-2 rounded-[10px]">
              Xuất PDF
            </button>
          </div>
        </div>
        <table className="min-w-full table-auto border border-gray-700">
          <thead className="bg-gray-100 items-center text-center">
            <tr>
              <th className="p-4 border border-gray-300">STT</th>
              <th className="p-4 border border-gray-300">Tên sự kiện</th>
              <th className="p-4 border border-gray-300">Loại vé</th>
              <th className="p-4 border border-gray-300">Trạng thái</th>
              <th className="p-4 border border-gray-300">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-center">
            {ticketDelete?.length > 0 ? (
              ticketDelete.map((item, index) => (
                <tr key={item.id}>
                  <td className="p-4 border border-gray-300">{index + 1}</td>
                  <td className="p-4 border border-gray-300">
                  {item.event_id}
                  </td>
                  <td className="p-4 border border-gray-300">
                  {item.ticket_type}
                  </td>
                  <td className="p-4 border border-gray-300">{item.status}</td>
                  <td className="p-4 border border-gray-300">
                    <button
                      className="bg-green-500 text-white px-1 py-1 rounded"
                      onClick={() => handleRestore(Number(item.id))}
                    >
                      <svg
                        className="w-[20px] h-[20px] fill-[#fff9f9]"
                        viewBox="0 0 512 512"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160H336c-17.7 0-32 14.3-32 32s14.3 32 32 32H463.5c0 0 0 0 0 0h.4c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1V448c0 17.7 14.3 32 32 32s32-14.3 32-32V396.9l17.6 17.5 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352H176c17.7 0 32-14.3 32-32s-14.3-32-32-32H48.4c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z"></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="text-center py-4">
                  Không có vé nào đã xóa.
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
