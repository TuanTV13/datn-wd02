import React, { useEffect, useState } from "react";
import api from "../../api_service/api";
import { EventUser } from "../../interfaces/EventUser";

const EventHistory = ({id}: {id: number}) => {

  const [participationHistory, setParticipationHistory] = useState<EventUser[]>([])
  useEffect(() => {
    const fetchParticipationHistory = async () => {
      try {
        const token = localStorage.getItem("access_token")
        const id = localStorage.getItem("user_id")
        const response = await api.get(`/clients/${id}/participation-history`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        })
        setParticipationHistory(response.data.data || [])
        // console.log(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchParticipationHistory()
  }, [])

  const eventsPerPage = 6; // Số sự kiện trên mỗi trang
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại

  // Tính tổng số trang
  const totalPages = Math.ceil(participationHistory.length / eventsPerPage);

  // Tính các sự kiện cần hiển thị dựa trên trang hiện tại
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = participationHistory.slice(indexOfFirstEvent, indexOfLastEvent);

  // Hàm xử lý thay đổi trang
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

  return (
    <div className="mt-36">
      <div className="p-4 bg-gray-100 rounded-md shadow-md mx-10">
        <h2 className="text-lg font-semibold mb-4">LỊCH SỬ THAM GIA SỰ KIỆN</h2>
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
              {participationHistory.length > 0 ? (
                currentEvents.map((item, index) => (
                  <tr key={item.id}>
                    <td className="border border-gray-400 p-2 text-center">
                      {indexOfFirstEvent + index + 1}
                    </td>
                    <td className="border border-gray-400 p-2 text-center">{item.event_name}</td>
                    <td className="border border-gray-400 p-2 text-center">{item.event_date}</td>
                    <td className="border border-gray-400 p-2 text-center">{item.location}</td>
                    <td className="border border-gray-400 p-2 text-center">
                      <img
                        src={item.thumbanail}
                        alt="Event"
                        className="w-12 h-auto mx-auto"
                      />
                    </td>
                    <td className="border border-gray-400 p-2 text-center">{item.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="border border-gray-400 p-2 text-center">
                    Không có sự kiện nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {participationHistory.length > 0 && (
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
        )}
      </div>
    </div>
  );
  
};

export default EventHistory;
