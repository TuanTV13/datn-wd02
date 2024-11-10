import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { TicketsCT } from "../../../Contexts/TicketContext";
import { Tickets } from "../../../interfaces/Ticket";

const ListTicket = () => {
<<<<<<< HEAD
  const { tickets, onDel} = useContext(TicketsCT);
=======
  const { tickets, onDel } = useContext(TicketsCT);
>>>>>>> origin/main
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
<<<<<<< HEAD
                  <td className="p-4 border border-gray-300">{item.event?.name}</td>
                  <td className="p-4 border border-gray-300"></td>
                  <td className="p-4 border border-gray-300">{item.statuses?.name}</td>
                  <td className="p-4 border border-gray-300">{item.price}</td>
                  <td className="p-4 border border-gray-300">{item.sale_start}</td>
                  <td className="p-4 border border-gray-300">{item.sale_end}</td>
=======
                  <td className="p-4 border border-gray-300">
                    {item.event?.name}
                  </td>
                  <td className="p-4 border border-gray-300"></td>
                  <td className="p-4 border border-gray-300">
                    {item.statuses?.name}
                  </td>
                  <td className="p-4 border border-gray-300">{item.price}</td>
                  <td className="p-4 border border-gray-300">
                    {item.sale_start}
                  </td>
                  <td className="p-4 border border-gray-300">
                    {item.sale_end}
                  </td>
>>>>>>> origin/main
                  <td className="p-4 border border-gray-300">
                    <div className="flex flex-col items-center space-y-1">
                      <Link
                        to={`/admin/edit-ticket/${item.id}`}
                        className="bg-blue-500 text-white w-[80px] h-8 rounded-[10px]"
                      >
                        Cập nhật
                      </Link>
                      <button
                        className="bg-red-500 text-white w-[80px] h-8 rounded-[10px]"
                        onClick={() => onDel(Number(item.id))}
                      >
                        Xóa
                      </button>
                      {/* <button
                        className="bg-yellow-500 text-white w-[80px] h-8 rounded-[10px]"
                        onClick={() => onVerify(Number(item.id))}
                      >
                        Chi tiết
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
<<<<<<< HEAD
                <td colSpan={9} className="p-4 border border-gray-300 text-center">
=======
                <td
                  colSpan={9}
                  className="p-4 border border-gray-300 text-center"
                >
>>>>>>> origin/main
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
