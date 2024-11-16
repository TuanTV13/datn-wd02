import React, { useState } from 'react';

const PaymentHistory = () => {
  const eventData = Array.from({ length: 30 }, (_, index) => ({
    id: index + 1,
    name: `Sự kiện ${String.fromCharCode(65 + (index % 26))}`,
    time: `10:00 - 12:00 (${index + 1}/01/2024)`,
    price: `10000`,
    payment: "Paypal",
    status: Math.random() > 0.5 ? "Thành công" : "Thất bại",
  }));

  const eventsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(eventData.length / eventsPerPage);

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = eventData.slice(indexOfFirstEvent, indexOfLastEvent);

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
        <h2 className="text-lg font-semibold mb-4">LỊCH SỬ GIAO DỊCH</h2>
        <div className="overflow-x-auto rounded-md">
          <table className="min-w-full bg-white border border-gray-400">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="border border-gray-400 p-2 text-center">STT</th>
                <th className="border border-gray-400 p-2 text-center">Tên sự kiện</th>
                <th className="border border-gray-400 p-2 text-center">Thời gian</th>
                <th className="border border-gray-400 p-2 text-center">Số tiền</th>
                <th className="border border-gray-400 p-2 text-center">Phương thức thanh toán</th>
                <th className="border border-gray-400 p-2 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {currentEvents.map((event, index) => (
                <tr key={event.id}>
                  <td className="border border-gray-400 p-2 text-center">
                    {indexOfFirstEvent + index + 1}
                  </td>
                  <td className="border border-gray-400 p-2 text-center">{event.name}</td>
                  <td className="border border-gray-400 p-2 text-center">{event.time}</td>
                  <td className="border border-gray-400 p-2 text-center">{event.price}</td>
                  <td className="border border-gray-400 p-2 text-center">
                    {event.payment}
                  </td>
                  <td className="border border-gray-400 p-2 text-center">
                    <span
                      className={`px-2 py-1 text-white rounded-[100px] w-24 inline-block text-center ${
                        event.status === "Thành công" ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {event.status}
                    </span>
                  </td>
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
            {currentPage} / {totalPages}
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

export default PaymentHistory;
