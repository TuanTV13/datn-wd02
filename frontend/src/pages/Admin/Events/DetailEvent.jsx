import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Modal } from "antd";
import AddTicket from "../Tickets/AddTicket";
import AddDiscountCode from "../Voucher/AddDiscountCode";
import UpdateEvent from "./UpdateEvent";
import AddSpeakerModal from "../../../components/Admin/AddSpeakerModal";
ChartJS.register(ArcElement, Tooltip, Legend);

const DetailEvents = () => {
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTickets, setShowTickets] = useState(false); 
  const [showUsers, setShowUsers] = useState(false); 
  const [showUpdateEvent, setShowUpdateEvent] = useState(false); 
  const [showStatusPopup, setShowStatusPopup] = useState(false); 
  const [selectedStatus, setSelectedStatus] = useState(""); 
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  const [modalData, setModalData] = useState({
    show: false,
    id: null,
    ticketCode: "",
    action: "",
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const { id } = useParams();


  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTicketForm, setIsTicketForm] = useState(true);
  const [eventId, setEventId] = useState(id);
  const [reload, setReload] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [showAddSpeaker, setShowAddSpeaker] = useState(false);

  const [showUsersStatistics, setShowUsersStatistics] = useState(false); 

  useEffect(() => {
    const fetchEventDetails = async () => {
      const token = localStorage.getItem("access_token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/v1/events/${id}/show`,
          { headers }
        );
        setEventDetails(response.data);
      } catch (err) {
        if (err.status === 401) {
          localStorage.clear();
          window.location = "/auth";
        }
        setError("Lỗi khi tải chi tiết sự kiện");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id, reload]);
  useEffect(() => {
    
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); 

    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (currentStatus) => {
    const token = localStorage.getItem("access_token");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    
    const nextStatusMap = {
      pending: "confirmed",
      confirmed: "checkin",
      checkin: "ongoing",
      ongoing: "completed",
    };
    const nextStatus = nextStatusMap[currentStatus];

    try {
      
      const response = await axios.put(
        `http://127.0.0.1:8000/api/v1/events/changeStatus/${id}`,
        { status: nextStatus },
        { headers }
      );
      setReload(!reload);
      
      toast.success("Cập nhật trạng thái thành công!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      
      toast.error("Cập nhật trạng thái thất bại!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error(err);
    }
  };

  const handleShowPopup = (status) => {
    setSelectedStatus(status);
    setShowConfirmPopup(true);
  };
  
  const getTimeDifference = (startTime) => {
    const eventStartTime = new Date(startTime);
    return (eventStartTime - currentTime) / 1000 / 60 / 60; 
  };

  const getNextStatusLabel = (status) => {
    if (status === "pending") {
      return "Thay đổi thành Đang chuẩn bị";
    } else if (status === "confirmed") {
      return "Thay đổi thành Đang check-in";
    } else if (status === "checkin") {
      return "Thay đổi thành Đang diễn ra";
    } else if (status === "ongoing") {
      return "Kết thúc";
    }
    return "";
  };

  const handleCheckIn = async (id, ticketCode) => {
    try {
      
      const token = localStorage.getItem("access_token");

      
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", 
      };

      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/events/${id}/checkin`,
        {
          method: "PUT",
          headers: headers,
          body: JSON.stringify({ ticket_code: ticketCode }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        
      }

      const data = await response.json();

      toast.success("Thay đổi trạng thái check-in thành công!");
      setReload(!reload);
    } catch (error) {
      toast.error("Thay đổi trạng thái check-in thất bại!");
      if (error.status === 401) {
      }
      localStorage.clear();
      window.location = "/auth";
      console.error("Error:", error);
    }
  };

  const handleCancelCheckIn = async (id, ticketCode) => {
    try {
      
      const token = localStorage.getItem("access_token");

      
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/events/${id}/cancelcheckin`,
        {
          method: "PUT",
          headers: headers,
          body: JSON.stringify({ ticket_code: ticketCode }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to cancel check-in");
      }

      const data = await response.json();
      toast.success("Thay đổi trạng thái check-in thành công!");
      setReload(!reload);
      
    } catch (error) {
      toast.error("Thay đổi trạng thái check-in thất bại!");
      if (error.status === 401) {
        localStorage.clear();
        window.location = "/auth";
      }
      console.error("Error:", error);
    }
  };

  if (loading)
    return <div className="text-center py-10 text-gray-700">Đang tải...</div>;
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!eventDetails || !eventDetails.data)
    return (
      <div className="text-center py-10 text-gray-500">
        Không tìm thấy dữ liệu sự kiện.
      </div>
    );

  const { data } = eventDetails;

  
  const speakers = data.speakers || [];
  const tickets = data.event.tickets || [];
  const users = data.event.users || [];
  
  const { vipPercentage, normalPercentage } = data;

  const chartData = {
    labels: ["Vé VIP", "Vé Thường"],
    datasets: [
      {
        data: [vipPercentage, normalPercentage],
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };
  const timeDifference = getTimeDifference(data.event.start_time);
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <AddSpeakerModal
        show={showAddSpeaker}
        onClose={() => {
          setShowAddSpeaker(false);
          setReload(!reload);
        }}
        eventId={id}
      />
      <h2 className="text-4xl font-bold mb-6 text-center text-gradient bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600">
        Chi tiết sự kiện
      </h2>
      <hr className="border-t-2 border-gray-300 mb-6" />

      {}
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6 p-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-transparent bg-clip-text shadow-xl rounded-lg">
        {data.event.name}
      </h1>

      <p className="text-lg font-medium text-gray-700 mb-6 flex justify-between items-center bg-white p-4 rounded-lg shadow-md border-l-4">
        
        <span className="flex items-center text-gray-800">
          <span className="mr-2 text-xl">📌</span>
          Trạng thái:{" "}
          <span className="font-bold text-indigo-600">
            {data.event.status === "pending" && " Đang chờ"}
            {data.event.status === "confirmed" && " Đang chuẩn bị"}
            {data.event.status === "checkin" && " Đang check-in"}
            {data.event.status === "ongoing" && " Đang diễn ra"}
            {data.event.status === "completed" && " Đã kết thúc"}
          </span>
        </span>

        {}
        {data.event.status !== "completed" && (
          <>
            {}
            {data.event.status === "pending" && timeDifference < 10 && (
              <Button
                type="primary"
                className="h-12 px-6 py-2 to-teal-600 text-white font-semibold rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                onClick={() => handleShowPopup(data.event.status)}
              >
                {getNextStatusLabel(data.event.status)}
              </Button>
            )}
            {data.event.status === "confirmed" && timeDifference < 4 && (
              <Button
                type="primary"
                className="h-12 px-6 py-2 to-teal-600 text-white font-semibold rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                onClick={() => handleShowPopup(data.event.status)}
              >
                {getNextStatusLabel(data.event.status)}
              </Button>
            )}

            {/* Hiển thị nút chuyển sang check-in trong vòng 2 giờ trước khi sự kiện bắt đầu */}
            {timeDifference <= 2 && timeDifference > 0 && data.event.status === "checkin" && (
              <Button
                type="primary"
                className="h-12 px-6 py-2 to-teal-600 text-white font-semibold rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                onClick={() => handleShowPopup(data.event.status)}
              >
                {getNextStatusLabel(data.event.status)}
              </Button>
            )}

            {/* Hiển thị nút chuyển sang "Hoàn thành" khi sự kiện đang diễn ra */}
            {data.event.status === "ongoing" && (
              <Button
                type="primary"
                className="h-12 px-6 py-2 to-teal-600 text-white font-semibold rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                onClick={() => handleShowPopup(data.event.status)}
              >
                {getNextStatusLabel(data.event.status)}
              </Button>
            )}
          </>
        )}
      </p>

      {showConfirmPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full relative">
            <button
              onClick={() => setShowConfirmPopup(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <i className="fas fa-times"></i>
            </button>
            <h3 className="text-xl font-semibold mb-4 text-gray-700 text-center">
              Xác nhận thay đổi trạng thái
            </h3>
            <p className="text-gray-600 mb-6 text-center">
              Bạn có chắc chắn muốn thay đổi trạng thái sự kiện từ{" "}
              <span className="font-bold text-blue-500">
                {getNextStatusLabel(data.event.status)}
              </span>{" "}
              sang{" "}
              <span className="font-bold text-blue-500">
                {getNextStatusLabel(selectedStatus)}
              </span>?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowConfirmPopup(false)}
                className="px-6 py-2 text-sm text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  handleStatusChange(selectedStatus);
                  setShowConfirmPopup(false);
                }}
                className="px-6 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Group the buttons in one row, with different colors */}
      <div className="flex space-x-4 justify-center mb-8">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300">
          Quản lý vé và voucher
        </button>

        <button
          onClick={() => { }}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300"
        >
          Thêm địa chỉ IP check-in
        </button>


        <button
          onClick={() => setShowUpdateEvent(!showUpdateEvent)}
          className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-700 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300"
        >
          Cập nhật sự kiện{" "}
        </button>
      </div>
      {showUpdateEvent && <UpdateEvent />}

     



      <hr />
      <br />
      <br />
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Thông tin sự kiện
      </h2>
      <br />
      <br />
      {/* Thông tin sự kiện */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 flex justify-center">
        <div className="p-4 bg-gradient-to-r from-blue-50 via-blue-100 to-blue-200 border border-blue-300 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 flex justify-between items-center">
          <p className="text-lg text-gray-800 font-semibold">Thời gian:</p>
          <p className="text-lg text-gray-700 font-medium">
            {new Date(data.event.start_time).toLocaleString()} -{" "}
            {new Date(data.event.end_time).toLocaleString()}
          </p>
        </div>

        <div className="p-4 bg-gradient-to-r from-green-50 via-green-100 to-green-200 border border-green-300 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 flex justify-between items-center">
          <p className="text-lg text-gray-800 font-semibold">Địa điểm:</p>
          <p className="text-lg text-gray-700 font-medium">
            {data.event.location}
          </p>
        </div>

        <div className="p-4 bg-gradient-to-r from-yellow-50 via-yellow-100 to-yellow-200 border border-yellow-300 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 flex justify-between items-center">
          <p className="text-lg text-gray-800 font-semibold">Tỉnh/Thành phố:</p>
          <p className="text-lg text-gray-700 font-medium">
            {data.event.province}
          </p>
        </div>

        <div className="p-4 bg-gradient-to-r from-pink-50 via-pink-100 to-pink-200 border border-pink-300 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 flex justify-between items-center">
          <p className="text-lg text-gray-800 font-semibold">Quận/Huyện:</p>
          <p className="text-lg text-gray-700 font-medium">
            {data.event.district}
          </p>
        </div>

        <div className="p-4 bg-gradient-to-r from-purple-50 via-purple-100 to-purple-200 border border-purple-300 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 flex justify-between items-center">
          <p className="text-lg text-gray-800 font-semibold">Phường/Xã:</p>
          <p className="text-lg text-gray-700 font-medium">{data.event.ward}</p>
        </div>

        <div className="p-4 bg-gradient-to-r from-teal-50 via-teal-100 to-teal-200 border border-teal-300 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 flex justify-between items-center">
          <p className="text-lg text-gray-800 font-semibold">Loại sự kiện:</p>
          <p className="text-lg text-gray-700 font-medium">
            {data.event.event_type === "offline"
              ? "Trực tiếp"
              : data.event.event_type === "online"
              ? "Trực tuyến"
              : "Không xác định"}
          </p>
        </div>

        <div className="p-4 bg-gradient-to-r from-indigo-50 via-indigo-100 to-indigo-200 border border-indigo-300 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 flex justify-between items-center">
          <p className="text-lg text-gray-800 font-semibold">
            Link trực tuyến:
          </p>
          <p className="text-lg text-gray-700 font-medium">
            <a href={data.event.link_online || "#"}>
              {data.event.link_online || "Không có"}
            </a>
          </p>
        </div>

        <div className="p-4 bg-gradient-to-r from-red-50 via-red-100 to-red-200 border border-red-300 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 flex justify-between items-center">
          <p className="text-lg text-gray-800 font-semibold">
            Số lượng tham gia tối đa:
          </p>
          <p className="text-lg text-gray-700 font-medium">
            {data.event.max_attendees}
          </p>
        </div>
        <div className="p-4 bg-gradient-to-r from-red-50 via-red-100 to-red-200 border border-red-300 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 flex justify-between items-center">
          <p className="text-lg text-gray-800 font-semibold">
            Số lượng vé đã bán:
          </p>
          <p className="text-lg text-gray-700 font-medium">
            {data.totalTickets}
          </p>
        </div>
        <div className="p-4 bg-gradient-to-r from-red-50 via-red-100 to-red-200 border border-red-300 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 flex justify-between items-center">
          <p className="text-lg text-gray-800 font-semibold">
            Số lượng người tham gia:
          </p>
          <p className="text-lg text-gray-700 font-medium">
            {data.event.users.length}
          </p>
        </div>
      </div>

      <br />
      <br />
      <img
        src={data.event.thumbnail}
        alt={data.event.name}
        className="w-full h-74 object-cover rounded-lg mb-6"
      />
      <div
        className="text-xl  text-gray-600 mb-6 space-y-4"
        dangerouslySetInnerHTML={{ __html: data.event.description }}
      ></div>

      <style>
        {`
    .text-xl img {
      width: 800px; /* Chiều rộng cố định */
      height: 400px; /* Chiều cao cố định */
      object-fit: cover; /* Đảm bảo không méo hình */
      display: block; /* Đảm bảo ảnh là block-level */
      margin: 0 auto; /* Căn giữa ảnh */
      padding:20px 0
    }
  `}
      </style>

      {/* Danh sách speakers */}
      <div className="flex justify-between">
        {" "}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Diễn giả</h2>
        <Button
          type="primary"
          onClick={() => {
            setShowAddSpeaker(true);
          }}
        >
          Thêm diễn giả
        </Button>
      </div>
      <div className="mb-6 flex justify-center">
        <div
          className="grid gap-4 justify-center w-70"
          style={{
            gridTemplateColumns: `repeat(${Math.min(speakers.length, 4)}, 1fr)`,
          }}
        >
          {speakers.length > 0 ? (
            speakers.map((speaker) => (
              <div
                key={speaker.name}
                className="p-4 bg-gray-50 rounded-lg shadow-md"
              >
                <img
                  src={speaker.image_url}
                  alt={speaker.name}
                  className="w-16 h-16 object-cover rounded-full mb-2"
                />
                <p className="font-semibold text-gray-800 text-center">
                  {speaker.name}
                </p>
                <p className="text-gray-600 text-center">
                  Chức vụ: {speaker.profile}
                </p>
                <p className="text-gray-600 text-center">
                  Email: {speaker.email}
                </p>
                <p className="text-gray-600 text-center">
                  Số điện thoại: {speaker.phone}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">
              Chưa có diễn giả thông tin
            </p>
          )}
        </div>
      </div>

      {/* Popup hiển thị Người dùng */}
      {showUsers && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowUsers(false);
            }
          }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-7xl w-full h-auto max-h-[80vh] overflow-auto relative">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Người đã mua vé
            </h2>
            <div className="overflow-x-auto">
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      STT
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Mã vé
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Khách hàng
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Trạng thái check-in
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users && users.length > 0 ? (
                    users.map((user, index) => (
                      <tr key={user.id} className="hover:bg-gray-100">
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          {index + 1}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {user.ticket_code}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          {user.name}
                        </td>
                        <td
                          className={`border border-gray-300 px-4 py-2 ${
                            user.pivot.checked_in === 1
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {user.pivot.checked_in === 1
                            ? "Đã check-in"
                            : "Chưa check-in"}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          <button
                            onClick={() =>
                              setModalData({
                                show: true,
                                id: user.id,
                                ticketCode: user.ticket_code,
                                action:
                                  user.pivot.checked_in === 1
                                    ? "cancel"
                                    : "checkin",
                              })
                            }
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 w-[150px] ${
                              user.pivot.checked_in === 1
                                ? "bg-red-500 text-white hover:bg-red-600"
                                : "bg-green-500 text-white hover:bg-green-600"
                            }`}
                          >
                            {user.pivot.checked_in === 1
                              ? "Hủy check-in"
                              : "Check-in"}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                      >
                        Chưa có người mua vé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="text-right mt-4">
              <button
                onClick={() => setShowUsers(false)}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal xác nhận */}
      {modalData.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Xác nhận</h2>
            <p className="mb-4">
              Bạn có chắc muốn{" "}
              <strong>
                {modalData.action === "checkin" ? "Check-in" : "Hủy check-in"}
              </strong>{" "}
              cho vé <strong>{modalData.ticketCode}</strong> không?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setModalData({ show: false })}
                className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  modalData.action === "checkin"
                    ? handleCheckIn(modalData.id, modalData.ticketCode)
                    : handleCancelCheckIn(modalData.id, modalData.ticketCode);
                  setModalData({ show: false });
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}


<Modal
  title={
    <div className="flex justify-between items-center">
      <span>Quản lý vé và voucher</span>
      <button
        onClick={() => setIsModalOpen(false)}
        className="text-xl font-semibold text-gray-500 hover:text-gray-700"
      >
      
      </button>
    </div>
  }
  width={1000}
  open={isModalOpen}
  footer={[
    <Button
      key="close"
      type="primary"
      onClick={() => {
        setIsModalOpen(false);
        navigate("/admin/detail-event/" + eventId);
      }}
    >
      Đóng
    </Button>,
  ]}
  onCancel={() => setIsModalOpen(false)} 
>
  <div className="flex justify-center gap-3">
    <Button
      key="ticket"
      onClick={() => {
        setIsTicketForm(true); 
        setShowStatistics(false); 
        setShowUsersStatistics(false); 
      }}
    >
      Thêm vé
    </Button>
    <Button
      key="voucher"
      onClick={() => {
        setIsTicketForm(false); 
        setShowStatistics(false); 
        setShowUsersStatistics(false); 
      }}
    >
      Thêm voucher
    </Button>
    <Button
      onClick={() => {
        setShowStatistics(true); 
        setIsTicketForm(false); 
        setShowUsersStatistics(false); 
      }}
    >
      Thống kê vé
    </Button>
    <Button
      onClick={() => {
        setShowUsersStatistics(true); 
        setIsTicketForm(false); 
        setShowStatistics(false); 
      }}
    >
      Thống kê người dùng
    </Button>
  </div>

        {}
        {isTicketForm && !showStatistics && !showUsersStatistics && (
          <AddTicket eventId={eventId} />
        )}
        {!isTicketForm && !showStatistics && !showUsersStatistics && (
          <AddDiscountCode eventId={eventId} />
        )}

        {/* Hiển thị thống kê vé khi showStatistics là true */}
        {showStatistics && (
          <div className="mt-6 max-h-[600px] overflow-y-auto">
            <h3 className="text-2xl font-semibold text-center">Thống kê vé </h3>
            <br />
            <hr />
            <br />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {tickets?.length > 0 ? (
                tickets?.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="p-4 bg-gray-50 rounded-lg shadow-md mb-4"
                  >
                    <p className="font-semibold text-gray-800">
                      Loại vé: {ticket.ticket.ticket_type}
                    </p>
                    <div className="mt-2 p-3 border rounded-lg bg-white shadow-sm">
                      <p className="text-gray-600">
                        Giá:{" "}
                        <span className="font-semibold">
                          {ticket.price} VND
                        </span>
                      </p>
                      <p className="text-gray-600">
                        Số lượng:{" "}
                        <span className="font-semibold">{ticket.quantity}</span>
                      </p>
                      <p className="text-gray-600">
                        Khu vực:{" "}
                        <span className="font-semibold">
                          {ticket.zone?.name || "Không xác định"}
                        </span>
                      </p>
                      <p className="text-gray-600">
                        Ngày mở bán:{" "}
                        {new Date(ticket.sale_start).toLocaleString()}
                      </p>
                      <p className="text-gray-600">
                        Ngày kết thúc bán:{" "}
                        {new Date(ticket.sale_end).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 col-span-2 text-center">
                  Chưa có thông tin vé.
                </p>
              )}
            </div>

            <hr className="my-6" />
            <h2 className="text-3xl font-semibold mb-2 text-center">
              Biểu đồ tỉ lệ vé bán
            </h2>
            <h4 className="text-xl mb-2 text-center">
              Tổng vé đã bán: {data.totalTickets}
            </h4>
            <div className="flex justify-center space-x-4">
              <h4 className="text-xl mb-4 text-center">
                Số lượng vé VIP đã bán: {data.vipTickets}
              </h4>
              <div className="h-6 w-px bg-gray-300"></div>
              <h4 className="text-xl mb-4 text-center">
                Số lượng vé thường đã bán: {data.normalTickets}
              </h4>
            </div>
            <div className="flex justify-center mb-6">
              <div className="w-1/3 max-w-sm">
                <Pie data={chartData} />
              </div>
            </div>
          </div>
        )}

        {/* Hiển thị thống kê người dùng đã mua vé khi showUsersStatistics là true */}
        {showUsersStatistics && (
          <div className="mt-6 max-h-[600px] overflow-y-auto">
            <h3 className="text-2xl font-semibold text-center">
              Người dùng đã mua vé
            </h3>
            <br />
            <hr />
            <br />
            <div className="overflow-x-auto">
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      STT
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Mã vé
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Khách hàng
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Trạng thái check-in
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users && users.length > 0 ? (
                    users.map((user, index) => (
                      <tr key={user.id} className="hover:bg-gray-100">
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          {index + 1}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {user.ticket_code}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          {user.name}
                        </td>
                        <td
                          className={`border border-gray-300 px-4 py-2 ${
                            user.pivot.checked_in === 1
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {user.pivot.checked_in === 1
                            ? "Đã check-in"
                            : "Chưa check-in"}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          <button
                            onClick={() =>
                              setModalData({
                                show: true,
                                id: user.id,
                                ticketCode: user.ticket_code,
                                action:
                                  user.pivot.checked_in === 1
                                    ? "cancel"
                                    : "checkin",
                              })
                            }
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 w-[150px] ${
                              user.pivot.checked_in === 1
                                ? "bg-red-500 text-white hover:bg-red-600"
                                : "bg-green-500 text-white hover:bg-green-600"
                            }`}
                          >
                            {user.pivot.checked_in === 1
                              ? "Hủy check-in"
                              : "Check-in"}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                      >
                        Chưa có người mua vé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {modalData.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h2 className="text-xl font-semibold mb-4">Xác nhận</h2>
              <p className="mb-4">
                Bạn có chắc muốn{" "}
                <strong>
                  {modalData.action === "checkin" ? "Check-in" : "Hủy check-in"}
                </strong>{" "}
                cho vé <strong>{modalData.ticketCode}</strong> không?
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setModalData({ show: false })}
                  className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    modalData.action === "checkin"
                      ? handleCheckIn(modalData.id, modalData.ticketCode)
                      : handleCancelCheckIn(modalData.id, modalData.ticketCode);
                    setModalData({ show: false });
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DetailEvents;
