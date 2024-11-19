import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { TicketsCT } from "../../../Contexts/TicketContext";
import { Tickets } from "../../../interfaces/Ticket";

const ListTicket = () => {
  const { tickets, onDel } = useContext(TicketsCT);
  return (
    <div>
      <div className="bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center">Danh sách vé</h2>
        <div className="p-4 flex justify-between">
          <div className="flex space-x-4">
            <Link
              to="/admin/add-ticket"
              className="bg-blue-500 text-white px-4 py-2 rounded-[10px]"
            >
              Thêm mới
            </Link>
            <Link
              to="/admin/ticket-list-user"
              className="bg-blue-500 text-white px-4 py-2 rounded-[10px]"
            >
              Vé đã bán
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
            {tickets?.length > 0 ? (
              tickets.map((item: Tickets, index: number) => (
                <tr key={item.id}>
                  <td className="p-4 border border-gray-300">{index + 1}</td>
                  <td className="p-4 border border-gray-300">{item.id}</td>
                  <td className="p-4 border border-gray-300">
                    {item.event?.name}
                  </td>
                  <td className="p-4 border border-gray-300">
                    {item.ticket_type}
                  </td>
                  <td className="p-4 border border-gray-300">{item.status}</td>
                  <td className="p-4 border border-gray-300">{item.price}</td>
                  <td className="p-4 border border-gray-300">
                    {item.sale_start}
                  </td>
                  <td className="p-4 border border-gray-300">
                    {item.sale_end}
                  </td>
                  <td className="p-4 border border-gray-300">
                    <div className="flex items-center space-y-1 justify-between p-2">
                      <Link to={`/admin/edit-ticket/${item.id}`}>
                        <svg
                          className="w-[20px] h-[20px] fill-[#007BFF]"
                          viewBox="0 0 512 512"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"></path>
                        </svg>
                      </Link>
                      <button onClick={() => onDel(Number(item.id))}>
                        <svg
                          className="w-[20px] h-[20px] fill-[#fa0606]"
                          viewBox="0 0 448 512"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"></path>
                        </svg>
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

export default ListTicket;
