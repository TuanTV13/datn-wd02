import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const DetailEvents = () => {
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTickets, setShowTickets] = useState(false); // Quản lý popup vé
  const [showUsers, setShowUsers] = useState(false); // Quản lý popup người dùng

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
          `http://127.0.0.1:8000/api/v1/events/${id}/show`,
          { headers }
        );
        setEventDetails(response.data);
      } catch (err) {
        setError("Lỗi khi tải chi tiết sự kiện");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  if (loading) return <div className="text-center py-10 text-gray-700">Đang tải...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!eventDetails || !eventDetails.data) return <div className="text-center py-10 text-gray-500">Không tìm thấy dữ liệu sự kiện.</div>;

  const { data, users } = eventDetails;

  // Kiểm tra các trường trước khi sử dụng .map()
  const speakers = data.speakers || [];
  const tickets = data.tickets || [];

  return (
    <div className="bg-white rounded-lg shadow p-6">
             <h2 className="text-3xl font-bold mb-4 text-center">Chi tiết sự kiện</h2>
             <br />
             <br />
             <hr />
        {/* Tiêu đề và thông tin chung */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{data.name}</h1>
        <img
          src={data.thumbnail}
          alt={data.name}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
        <div
           className="text-xl font-bold text-gray-600 mb-6 space-y-4"
          dangerouslySetInnerHTML={{ __html: data.description }}
        ></div>
        <hr />
        <br /><br />
        <h2 className="text-2xl font-bold text-gray-800 mb-4" >Thông tin sự kiện</h2>
        <br />
        <br />
        {/* Thông tin sự kiện */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 flex justify-center ">
    <div className="p-4 bg-white rounded-lg shadow-md flex justify-center">
      <p className="text-lg text-gray-700 font-semibold">Thời gian:</p>
      <p className="text-lg text-gray-600">{new Date(data.start_time).toLocaleString()} - {new Date(data.end_time).toLocaleString()}</p>
    </div>
    
    <div className="p-4 bg-white rounded-lg shadow-md flex justify-center">
      <p className="text-lg text-gray-700 font-semibold">Địa điểm:</p>
      <p className="text-lg text-gray-600">{data.location}</p>
    </div>

    <div className="p-4 bg-white rounded-lg shadow-md flex justify-center">
      <p className="text-lg text-gray-700 font-semibold">Tỉnh/Thành phố:</p>
      <p className="text-lg text-gray-600">{data.province}</p>
    </div>

    <div className="p-4 bg-white rounded-lg shadow-md flex justify-center">
      <p className="text-lg text-gray-700 font-semibold">Quận/Huyện:</p>
      <p className="text-lg text-gray-600">{data.district}</p>
    </div>

    <div className="p-4 bg-white rounded-lg shadow-md flex justify-center">
      <p className="text-lg text-gray-700 font-semibold">Phường/Xã:</p>
      <p className="text-lg text-gray-600">{data.ward}</p>
    </div>

    <div className="p-4 bg-white rounded-lg shadow-md flex justify-center">
      <p className="text-lg text-gray-700 font-semibold">Trạng thái:</p>
      <p className="text-lg text-gray-600">{data.status}</p>
    </div>

    <div className="p-4 bg-white rounded-lg shadow-md flex justify-center">
      <p className="text-lg text-gray-700 font-semibold">Loại sự kiện:</p>
      <p className="text-lg text-gray-600">{data.event_type}</p>
    </div>

    <div className="p-4 bg-white rounded-lg shadow-md flex justify-center">
      <p className="text-lg text-gray-700 font-semibold">Link trực tuyến:</p>
      <p className="text-lg text-gray-600">{data.link_online ? data.link_online : "Không có"}</p>
    </div>

    <div className="p-4 bg-white rounded-lg shadow-md flex justify-center">
      <p className="text-lg text-gray-700 font-semibold">Số lượng tham gia tối đa:</p>
      <p className="text-lg text-gray-600">{data.max_attendees}</p>
    </div>

    <div className="p-4 bg-white rounded-lg shadow-md flex justify-center">
      <p className="text-lg text-gray-700 font-semibold">Số lượng đã đăng ký:</p>
      <p className="text-lg text-gray-600">{data.registed_attendees ? data.registed_attendees : "Chưa có thông tin"}</p>
    </div>
  </div>


      {/* Danh sách speakers */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Diễn giả</h2>
        <div className="space-y-4 flex justify-center">
          {speakers.length > 0 ? (
            speakers.map((speaker) => (
              <div key={speaker.name} className="p-4 bg-gray-50 rounded-lg shadow-md ">
                <img
                  src={speaker.image_url}
                  alt={speaker.name}
                  className="w-16 h-16 object-cover rounded-full mb-2"
                />
                <p className="font-semibold text-gray-800">{speaker.name}</p>
                <p className="text-gray-600">Chức vụ: {speaker.profile}</p>
                <p className="text-gray-600">Email: {speaker.email}</p>
                <p className="text-gray-600">Số điện thoại: {speaker.phone}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Chưa có diễn giả thông tin</p>
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
      {showTickets && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
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
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full">
            <h2 className="text-2xl font-semibold mb-4">Người đã mua vé</h2>
            <div className="grid grid-cols-2 gap-4 max-h-[500px] overflow-y-auto">
              {users && users.length > 0 ? (
                users.map((user) => (
                  <div
                    key={user.id}
                    className="p-4 bg-gray-50 rounded-lg shadow-md"
                  >
                    <img
                      src={user.image || "https://via.placeholder.com/100"}
                      alt={user.name}
                      className="w-12 h-12 object-cover rounded-full mb-2"
                    />
                    <p className="font-semibold text-gray-800">{user.name}</p>
                    <p className="text-gray-600">Email: {user.email}</p>
                    <p className="text-gray-600">Số điện thoại: {user.phone}</p>
                    <p
                      className={`text-sm font-medium ${
                        user.pivot.checked_in ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {user.pivot.checked_in ? "Đã check-in" : "Chưa check-in"}
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
