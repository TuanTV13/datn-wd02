import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DetailEvents = () => {
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTickets, setShowTickets] = useState(false); // Quản lý popup vé
  const [showUsers, setShowUsers] = useState(false); // Quản lý popup người dùng
  const [showStatusPopup, setShowStatusPopup] = useState(false); // Popup trạng thái
  const [selectedStatus, setSelectedStatus] = useState(""); // Lưu trạng thái được chọn

  const { id } = useParams();

  useEffect(() => {
    const fetchEventDetails = async () => {
      const token = localStorage.getItem("access_token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      try {
        const response = await axios.get(
          `http://172.20.10.3:8000/api/v1/events/${id}/show`,
          { headers }
        );
        setEventDetails(response.data);
        console.log(response.data);



      } catch (err) {
        setError("Lỗi khi tải chi tiết sự kiện");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleChangeStatus = async () => {
    const token = localStorage.getItem("access_token");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      await axios.put(
        `http://172.20.10.3:8000/api/v1/events/changeStatus/${id}`,
        { status: selectedStatus },
        { headers }
      );
      alert("Cập nhật trạng thái thành công!");
      setShowStatusPopup(false);
      // Fetch lại dữ liệu sự kiện
      setLoading(true);
      const response = await axios.get(
        `http://172.20.10.3:8000/api/v1/events/${id}/show`,
        { headers }
      );
      setEventDetails(response.data);
      setLoading(false);
    } catch (err) {
      alert("Cập nhật trạng thái thất bại!");
      console.error(err);
    }
  };
  if (loading) return <div className="text-center py-10 text-gray-700">Đang tải...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!eventDetails || !eventDetails.data) return <div className="text-center py-10 text-gray-500">Không tìm thấy dữ liệu sự kiện.</div>;

  const { data } = eventDetails;

  // Kiểm tra các trường trước khi sử dụng .map()
  const speakers = data.speakers || [];
  const tickets = data.event.tickets || [];
  const users = data.event.users || []
  // const normalPercentage = data.normalPercentage || [];
  // const normalTickets = data.normalTickets || [];
  // const totalTickets = data.totalTickets || [];
  // const vipTickets = data.vipTickets || [];
  // const vipPercentage = data.vipPercentage || [];
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
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-3xl font-bold mb-4 text-center">Chi tiết sự kiện</h2>
      <br />
      <br />
      <hr />
      {/* Tiêu đề và thông tin chung */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{data.event.name}</h1>
      <p className="text-lg font-medium text-gray-600 mb-4 ">Trạng thái: {data.event.status}</p>
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setShowStatusPopup(true)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Thay đổi trạng thái
        </button>
        <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Thêm địa chỉ IP check-in
        </button>
      </div>
      {showStatusPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h3 className="text-xl font-bold mb-4">Thay đổi trạng thái vé</h3>
            <select
              className="w-full p-2 border rounded mb-4"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="" disabled>
                -- Chọn trạng thái --
              </option>
              <option value="confirmed">Confirmed</option>
              <option value="checkin">Check-in</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="canceled">Canceled</option>
            </select>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowStatusPopup(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={handleChangeStatus}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={!selectedStatus}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      <img
        src={data.event.thumbnail}
        alt={data.event.name}
        className="w-full h-64 object-cover rounded-lg mb-6"
      />
      <div
        className="text-xl font-bold text-gray-600 mb-6 space-y-4"
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

      <hr />
      <br /><br />
      <h2 className="text-2xl font-bold text-gray-800 mb-4" >Thông tin sự kiện</h2>
      <br />
      <br />
      {/* Thông tin sự kiện */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 flex justify-center ">
        <div className="p-4 bg-white rounded-lg shadow-md flex justify-center">
          <p className="text-lg text-gray-700 font-semibold">Thời gian:</p>
          <p className="text-lg text-gray-600">{new Date(data.event.start_time).toLocaleString()} - {new Date(data.event.end_time).toLocaleString()}</p>
        </div>

        <div className="p-4 bg-white rounded-lg shadow-md flex justify-center">
          <p className="text-lg text-gray-700 font-semibold">Địa điểm:</p>
          <p className="text-lg text-gray-600">{data.event.location}</p>
        </div>

        <div className="p-4 bg-white rounded-lg shadow-md flex justify-center">
          <p className="text-lg text-gray-700 font-semibold">Tỉnh/Thành phố:</p>
          <p className="text-lg text-gray-600">{data.event.province}</p>
        </div>

        <div className="p-4 bg-white rounded-lg shadow-md flex justify-center">
          <p className="text-lg text-gray-700 font-semibold">Quận/Huyện:</p>
          <p className="text-lg text-gray-600">{data.event.district}</p>
        </div>

        <div className="p-4 bg-white rounded-lg shadow-md flex justify-center">
          <p className="text-lg text-gray-700 font-semibold">Phường/Xã:</p>
          <p className="text-lg text-gray-600">{data.event.ward}</p>
        </div>



        <div className="p-4 bg-white rounded-lg shadow-md flex justify-center">
          <p className="text-lg text-gray-700 font-semibold">Loại sự kiện:</p>
          <p className="text-lg text-gray-600">{data.event.event_type}</p>
        </div>

        <div className="p-4 bg-white rounded-lg shadow-md flex justify-center">
          <p className="text-lg text-gray-700 font-semibold">Link trực tuyến:</p>
          <p className="text-lg text-gray-600">{data.event.link_online ? data.link_online : "Không có"}</p>
        </div>

        <div className="p-4 bg-white rounded-lg shadow-md flex justify-center">
          <p className="text-lg text-gray-700 font-semibold">Số lượng tham gia tối đa:</p>
          <p className="text-lg text-gray-600">{data.event.max_attendees}</p>
        </div>


      </div>


      {/* Danh sách speakers */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Diễn giả</h2>

      <div className="mb-6 flex justify-center">
        <div
          className="grid gap-4 justify-center w-70"
          style={{
            gridTemplateColumns: `repeat(${Math.min(speakers.length, 4)}, 1fr)`
          }}
        >
          {speakers.length > 0 ? (
            speakers.map((speaker) => (
              <div key={speaker.name} className="p-4 bg-gray-50 rounded-lg shadow-md">
                <img
                  src={speaker.image_url}
                  alt={speaker.name}
                  className="w-16 h-16 object-cover rounded-full mb-2"
                />
                <p className="font-semibold text-gray-800 text-center">{speaker.name}</p>
                <p className="text-gray-600 text-center">Chức vụ: {speaker.profile}</p>
                <p className="text-gray-600 text-center">Email: {speaker.email}</p>
                <p className="text-gray-600 text-center">Số điện thoại: {speaker.phone}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">Chưa có diễn giả thông tin</p>
          )}
        </div>
      </div>


      {/* Nút hiển thị thông tin Vé và Người dùng */}
      <div className="flex space-x-4 mt-8 flex justify-center">
        <button
          onClick={() => setShowTickets(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Xem thông tin Vé
        </button>
        <button
          onClick={() => setShowUsers(true)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Xem Người mua vé
        </button>
      </div>

      {/* Popup hiển thị Vé */}
      {/* Popup hiển thị Vé */}
      {showTickets && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full h-auto max-h-[80vh] overflow-auto">
            <h2 className="text-2xl font-semibold mb-4">Thông tin Vé</h2>
            <div className="space-y-4">
              {tickets.length > 0 ? (
                tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="p-4 bg-gray-50 rounded-lg shadow-md"
                  >
                    <p className="font-semibold text-gray-800">
                      Loại vé: {ticket.ticket_type}
                    </p>
                    <p className="text-gray-600">Giá: {ticket.price} VND</p>
                    <p className="text-gray-600">Số lượng: {ticket.quantity}</p>
                    <p className="text-gray-600">
                      Khu vực: {ticket.seat_location}
                    </p>
                    <p className="text-gray-600">
                      Ngày mở bán: {new Date(ticket.sale_start).toLocaleString()}
                    </p>
                    <p className="text-gray-600">
                      Ngày kết thúc bán:{" "}
                      {new Date(ticket.sale_end).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Chưa có thông tin vé</p>
              )}
            </div>
            <br />
            <hr />
            <br />
            <h2 className="text-2xl font-semibold mb-4">Thống kê Vé</h2>
            <div className="space-y-4">

              <div className="p-4 bg-gray-50 rounded-lg shadow-md">
                <p className="font-semibold text-gray-800">
                  Tổng vé đã bán: {data.totalTickets}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg shadow-md">
                <p className="font-semibold text-gray-800">
                  Vé Thường đã bán: {data.normalTickets} <p> {data.normalPercentage
                  } % </p>
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg shadow-md">
                <p className="font-semibold text-gray-800">
                  Vé VIP đã bán: {data.vipTickets} <p>{data.vipPercentage
                  } %</p>
                </p>
              </div>

              <br />
              <hr />
              <br />
              <h2 className="text-2xl font-semibold mb-4">Biểu đồ</h2>
              <div className="flex justify-center mb-6">
                <Pie data={chartData} />
              </div>
            </div>
            <button
              onClick={() => setShowTickets(false)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Popup hiển thị Người dùng */}
      {showUsers && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full h-auto max-h-[80vh] overflow-auto">
            <h2 className="text-2xl font-semibold mb-4">Người đã mua vé</h2>
            <div className="grid grid-cols-2 gap-4 max-h-[500px] overflow-y-auto">
              {users && users.length > 0 ? (
                users.map((user) => (
                  <div
                    key={user.id}
                    className="p-4 bg-gray-50 rounded-lg shadow-md"
                  >

                    <p className="font-semibold text-gray-800">Mã vé: {user.ticket_code}</p>
                    <p className="text-gray-600">Loại vé: {user.pivot.ticket_type}</p>
                    <p className="text-gray-600">ID người dùng: {user.pivot.user_id
                    }</p>
                    <p
                      className={`text-sm font-medium ${user.pivot.checked_in === 1 ? "text-green-500" : "text-red-500"
                        }`}
                    >
                      {user.pivot.checked_in === 1 ? "Đã check-in" : "Chưa check-in"}
                    </p>

                  </div>
                ))
              ) : (
                <p className="text-gray-500">Chưa có người mua vé</p>
              )}
            </div>
            <button
              onClick={() => setShowUsers(false)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailEvents;
