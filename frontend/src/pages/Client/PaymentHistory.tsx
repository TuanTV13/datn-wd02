import React, { useEffect, useState } from "react";
import { Transaction } from "../../interfaces/Transaction";
import api from "../../api_service/api";
import { Link } from "react-router-dom";

const PaymentHistory = ({ userId }: { userId: number }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const eventsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const userId = localStorage.getItem("user_id");
        const response = await api.get(
          `/clients/${userId}/transaction-history`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setTransactions(response.data.data || []);
      } catch (err) {
        if (err.status === 401) {
          localStorage.clear();
          window.location = "/auth";
        }
      }
    };

    fetchTransactionHistory();
  }, [userId]);
  const totalPages = Math.ceil(transactions.length / eventsPerPage);
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = transactions.slice(indexOfFirstEvent, indexOfLastEvent);

  const handlePageChange = (direction: any) => {
    setCurrentPage((prevPage) => {
      if (direction === "next" && prevPage < totalPages) {
        return prevPage + 1;
      } else if (direction === "prev" && prevPage > 1) {
        return prevPage - 1;
      }
      return prevPage;
    });
  };

  const getStatusColor = (statusId: any) => {
    switch (statusId) {
      case "completed":
        return { text: "Đã hoàn thành", color: "text-gray-500" };
      case "pending":
        return { text: "Đang chờ xác nhận", color: "text-gray-400" };
      case "failed":
        return { text: "Thanh toán thất bại", color: "text-red-500" };
      default:
        return { text: "Trạng thái không xác định", color: "text-gray-400" };
    }
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
                <th className="border border-gray-400 p-2 text-center"></th>
              </tr>
            </thead>
            <tbody>
              {currentEvents.length > 0 ? (
                currentEvents.map((event, index) => (
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
                    <td
                      className={`border border-gray-400 p-2 text-center ${
                        getStatusColor(event.status).color
                      }`}
                    >
                      {getStatusColor(event.status).text}
                    </td>
                    <td className="border border-gray-400 p-2 text-center">
                      <Link to={`/order-detail/${event.id}`}>Xem chi tiết</Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="border border-gray-400 p-2 text-center"
                  >
                    Không có thông tin giao dịch nào.
                  </td>
                </tr>
              )}
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
