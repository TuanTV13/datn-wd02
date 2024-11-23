import React, { useEffect, useState } from "react";
import { Transaction } from "../../interfaces/Transaction";
import api from "../../api_service/api";

const PaymentHistory = ({ userId }: { userId: number }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const eventsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const userId = localStorage.getItem("user_id");
        const response = await api.get(`/clients/${userId}/transaction-history`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log(response.data.data)
        setTransactions(response.data.data);
      } catch (err) {
        console.log("hh",err);
      }
    };

    fetchTransactionHistory();
  }, [userId]);
  const totalPages = Math.ceil(transactions.length / eventsPerPage);
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = transactions.slice(indexOfFirstEvent, indexOfLastEvent);

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
                <th className="border border-gray-400 p-2 text-center">
                  Tên sự kiện
                </th>
                <th className="border border-gray-400 p-2 text-center">
                  Tổng tiền
                </th>
                <th className="border border-gray-400 p-2 text-center">
                  Phương thức thanh toán
                </th>
                <th className="border border-gray-400 p-2 text-center">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody>
              {currentEvents.map((event, index) => (
                <tr>
                  <td className="border border-gray-400 p-2 text-center">
                    {indexOfFirstEvent + index + 1}
                  </td>
                  <td className="border border-gray-400 p-2 text-center">
                    {event.event_name}
                  </td>
                  <td className="border border-gray-400 p-2 text-center">
                    {event.total_amount}
                  </td>
                  <td className="border border-gray-400 p-2 text-center">
                    {event.payment_method}
                  </td>
                  <td className="border border-gray-400 p-2 text-center">
                    {event.status}
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
