import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TicketsCT } from "../../../Contexts/TicketContext";
import { StatusType, Tickets, TicketType } from "../../../interfaces/Ticket";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
const ListTicket = () => {
  const { tickets, onDel, onVerify, events } = useContext(TicketsCT);
  const [StatusList] = useState(Object.values(StatusType));
  const [filteredTickets, setFilteredTickets] = useState(tickets);
console.log(filteredTickets)
  // Filters
  const [searchName, setSearchName] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedTicketType, setSelectedTicketType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    
    const applyFilters = () => {
      let filtered = tickets;

      if (searchName) {
        filtered = filtered.filter((ticket) =>
          ticket.ticket_type.toLowerCase().includes(searchName.toLowerCase())
        );
      }

      if (selectedStatus) {
        filtered = filtered.filter(
          (ticket) => ticket.status === selectedStatus
        );
      }

      if (selectedTicketType) {
        filtered = filtered.filter(
          (ticket) => ticket.ticket_type === selectedTicketType
        );
      }

      if (startDate) {
        filtered = filtered.filter(
          (ticket) =>
            new Date(ticket.price[0].sale_start) >= new Date(startDate)
        );
      }

      if (endDate) {
        filtered = filtered.filter(
          (ticket) => new Date(ticket.price[0].sale_end) <= new Date(endDate)
        );
      }

      setFilteredTickets(filtered);
    };

    applyFilters();
  }, [
    searchName,
    selectedStatus,
    selectedTicketType,
    startDate,
    endDate,
    tickets,
  ]);

  const handleVerify = (id: number) => {
    onVerify(id); 
  };

  const getEventName = (eventId: number | string) => {
    const event = events.find((event) => event.id === eventId);
    return event ? event.name : "Tên sự kiện không tìm thấy";
  };

  const paginateTickets = (tickets, page, perPage) => {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return tickets.slice(start, end);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow h-full">
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
              to="/admin/list-ticket-delete"
              className="bg-blue-500 text-white px-4 py-2 rounded-[10px]"
            >
              Vé đã xóa
            </Link>
          </div>
          <div className="flex space-x-4 items-center">
            <span>Hiển thị:</span>
            <select
              className="border rounded px-2 py-1"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="20">50</option>
              <option value="20">100</option>
            </select>
            <button className="bg-gray-200 px-4 py-2 rounded-[10px]">
              Bộ lọc
            </button>
          </div>
        </div>

        <div className="p-4">
          <input
            type="text"
            placeholder="Tìm theo tên vé"
            className="border p-2 rounded"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <select
            className="border p-2 rounded ml-2"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">Chọn trạng thái</option>
            {StatusList.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <select
            className="border p-2 rounded ml-2"
            value={selectedTicketType}
            onChange={(e) => setSelectedTicketType(e.target.value)}
          >
            <option value="">Chọn loại vé</option>
            
            {Object.values(TicketType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <input
            type="date"
            className="border p-2 rounded ml-2"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="border p-2 rounded ml-2"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <table className="min-w-full table-auto border border-gray-700">
          <thead className="bg-gray-100 items-center text-center">
            <tr>
              <th className="p-4 border border-gray-300">STT</th>
              <th className="p-4 border border-gray-300">Tên sự kiện</th>
              <th className="p-4 border border-gray-300">Tên khu vực</th>
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
            {filteredTickets?.length > 0 ? (
              paginateTickets(filteredTickets, currentPage, itemsPerPage).map(
                (item: Tickets, index: number) => (
                  <>
                    {item?.price?.map((priceItem: any, subIndex: number) => (
                      <tr key={`${item.id}-${subIndex}`}>
                        <td className="p-4 border border-gray-300">
                          {index + 1}.{subIndex + 1}
                        </td>
                        <td className="p-4 border border-gray-300">
                          {getEventName(priceItem.event_id)}
                        </td>
                        <td className="p-4 border border-gray-300">
                          {/* {priceItem.zone.name} */}
                        </td>
                        <td className="p-4 border border-gray-300">
                          {item.ticket_type}
                        </td>
                        <td className="p-4 border border-gray-300">
                          {priceItem.quantity}
                        </td>
                        <td className="p-4 border border-gray-300">
                          <select className="border rounded p-2">
                            <option value={item.status}>{item.status}</option>
                            {StatusList.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-4 border border-gray-300">
                          {priceItem.price}
                        </td>
                        <td className="p-4 border border-gray-300">
                          {priceItem.sale_start}
                        </td>
                        <td className="p-4 border border-gray-300">
                          {priceItem.sale_end}
                        </td>
                        <td className="p-4 border border-gray-300">
                          <div className="flex items-center space-x-2">
                            <Link
                              to={`/admin/edit-ticket/${item.id}`}
                              className="text-blue-500"
                            >
                              <svg
                                className="w-[20px] h-[20px] fill-current"
                                viewBox="0 0 512 512"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"></path>
                              </svg>
                            </Link>
                            <button
                              onClick={() => onDel(item.id, priceItem.id)}
                              className="text-red-500"
                            >
                              <svg
                                className="w-[20px] h-[20px] fill-current"
                                viewBox="0 0 448 512"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"></path>
                              </svg>
                            </button>
                            <button
                              onClick={() => handleVerify(Number(item.id))}
                            >
                              <svg
                                className="w-[20px] h-[20px] fill-gray-500"
                                viewBox="0 0 512 512"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </>
                )
              )
            ) : (
              <tr>
                <td
                  colSpan={10}
                  className="p-4 border border-gray-300 text-center"
                >
                  Không có vé nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        
        <div className="flex justify-center space-x-2 mt-4 pb-10">
          <LeftOutlined
            className="cursor-pointer"
            onClick={() => {
              if (currentPage > 1) {
                setCurrentPage((prev) => prev - 1);
              }
            }}
          />
          {Array.from(
            { length: Math.ceil(filteredTickets.length / itemsPerPage) },
            (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-4 py-2 rounded-md ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            )
          )}
          <RightOutlined
            className="cursor-pointer"
            onClick={() => {
              if (
                currentPage < Math.ceil(filteredTickets.length / itemsPerPage)
              ) {
                setCurrentPage((prev) => prev + 1);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ListTicket;
