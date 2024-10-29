import React, { useState } from "react";

const EventHistory = () => {
  // Dữ liệu tạm thời
  const eventData = Array.from({ length: 30 }, (_, index) => ({
    id: index + 1,
    name: `Sự kiện ${String.fromCharCode(65 + (index % 26))}`,
    time: `10:00 - 12:00 (${index + 1}/01/2024)`,
    location: `Địa điểm ${String.fromCharCode(65 + (index % 26))}`,
    image: "https://via.placeholder.com/50",
    status: "Đã tham gia",
  }));

  const eventsPerPage = 6; // Số sự kiện trên mỗi trang
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại

  // Tính tổng số trang
  const totalPages = Math.ceil(eventData.length / eventsPerPage);

  // Tính các sự kiện cần hiển thị dựa trên trang hiện tại
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = eventData.slice(indexOfFirstEvent, indexOfLastEvent);

  // Hàm xử lý thay đổi trang
  const handlePageChange = (direction) => {
    setCurrentPage((prevPage) => {
      if (direction === "next" && prevPage < totalPages) {
        return prevPage + 1;
      } else if (direction === "prev" && prevPage > 1) {
        return prevPage - 1;
      }
      return prevPage;
    });
  };

  return (
    <div className="mt-36">
      <div className="p-4 bg-gray-100 rounded-md shadow-md mx-10">
        <h2 className="text-lg font-semibold mb-4">LỊCH SỬ THAM GIA</h2>
        <div className="overflow-x-auto rounded-md">
          <table className="min-w-full bg-white border border-gray-400">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="border border-gray-400 p-2 text-center">STT</th>
                <th className="border border-gray-400 p-2 text-center">Tên sự kiện</th>
                <th className="border border-gray-400 p-2 text-center">Thời gian</th>
                <th className="border border-gray-400 p-2 text-center">Địa điểm</th>
                <th className="border border-gray-400 p-2 text-center">Hình ảnh</th>
                <th className="border border-gray-400 p-2 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {currentEvents.map((event, index) => (
                <tr key={event.id}>
                  <td className="border border-gray-400 p-2 text-center">
                    {indexOfFirstEvent + index + 1} {/* Tính chỉ số chính xác */}
                  </td>
                  <td className="border border-gray-400 p-2 text-center">{event.name}</td>
                  <td className="border border-gray-400 p-2 text-center">{event.time}</td>
                  <td className="border border-gray-400 p-2 text-center">{event.location}</td>
                  <td className="border border-gray-400 p-2 text-center">
                    <img src={event.image} alt="Event" className="w-12 h-auto mx-auto" />
                  </td>
                  <td className="border border-gray-400 p-2 text-center">{event.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-end mt-4 space-x-2">
          <button
            onClick={() => handlePageChange("prev")}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-400 rounded-l-md text-gray-500 hover:bg-gray-200 disabled:opacity-50"
          >
            «
          </button>
          <span className="px-3 py-1 border border-gray-400 text-gray-500">
            {currentPage} / {totalPages} {/* Hiển thị trang hiện tại và tổng số trang */}
          </span>
          <button
            onClick={() => handlePageChange("next")}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-400 rounded-r-md text-gray-500 hover:bg-gray-200 disabled:opacity-50"
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventHistory;
