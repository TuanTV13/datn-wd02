import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
ChartJS.register(ArcElement, Tooltip, Legend);

const DetailEvents = () => {
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTickets, setShowTickets] = useState(false); // Quản lý popup vé
  const [showUsers, setShowUsers] = useState(false); // Quản lý popup người dùng
  const [showStatusPopup, setShowStatusPopup] = useState(false); // Popup trạng thái
  const [selectedStatus, setSelectedStatus] = useState(""); // Lưu trạng thái được chọn
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

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
        `http://127.0.0.1:8000/api/v1/events/changeStatus/${id}`,
        { status: selectedStatus },
        { headers }
      );
      toast.success("Cập nhật trạng thái thành công!", {
        position: "top-right",
        autoClose: 3000, // Thời gian tự động đóng (ms)
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setShowStatusPopup(false);
  
      // Fetch lại dữ liệu sự kiện
      setLoading(true);
      const response = await axios.get(
        `http://127.0.0.1:8000/api/v1/events/${id}/show`,
        { headers }
      );
      setEventDetails(response.data);
      setLoading(false);
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
 
const handleCheckIn = async (id, ticketCode) => {
 if (window.confirm('xac nhan')) {
  try {
    // Lấy token từ localStorage
    const token = localStorage.getItem("access_token");

    // Tạo headers với token
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json', // Nếu bạn gửi JSON
    };

    const response = await fetch(`http://127.0.0.1:8000/api/v1/events/${id}/checkin`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify({ ticket_code: ticketCode }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.log('Error:', error);
      // Xử lý lỗi tại đây
    }

    const data = await response.json();
    console.log('Check-in successful:', data);
    // Xử lý kết quả thành công nếu cần
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === id ? { ...user, pivot: { ...user.pivot, checked_in: 1 } } : user
      )
    );
    
  } catch (error) {
    console.error('Error:', error);
  }
 }
};

const handleCancelCheckIn = async (id, ticketCode) => {
  try {
    // Lấy token từ localStorage
    const token = localStorage.getItem("access_token");

    // Tạo headers với token
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch(`http://127.0.0.1:8000/api/v1/events/${id}/cancelcheckin`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify({ ticket_code: ticketCode }),
    });

    if (!response.ok) {
      throw new Error('Failed to cancel check-in');
    }

    const data = await response.json();
    console.log('Cancel check-in successful:', data);
    // Xử lý kết quả thành công nếu cần
   
    
  } catch (error) {
    console.error('Error:', error);
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
<h2 className="text-4xl font-bold mb-6 text-center text-gradient bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600">
  Chi tiết sự kiện
</h2>
<hr className="border-t-2 border-gray-300 mb-6" />

{/* Tiêu đề và thông tin chung */}
<h1 className="text-5xl font-extrabold text-gray-800 mb-4 shadow-md p-2 rounded-lg bg-gray-100"> 
  {data.event.name}
</h1>
<p className="text-lg font-medium text-gray-700 mb-4 flex items-center">
  <span className="mr-2 text-xl text-gray-600">📌</span>
  Trạng thái: <span className="font-bold text-teal-600">{data.event.status}</span>
</p>

<div className="flex justify-between items-center mb-6">
  <button
    onClick={() => setShowStatusPopup(true)}
    className="px-6 py-3 bg-gradient-to-r from-green-400 to-green-600 text-white font-bold rounded-lg shadow-lg transform hover:scale-105 hover:rotate-1 transition-transform duration-300"
  >
    Thay đổi trạng thái
  </button>
  <button className="px-6 py-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold rounded-lg shadow-lg transform hover:scale-105 hover:rotate-1 transition-transform duration-300">
    Thêm địa chỉ IP check-in
  </button>
</div>

{showStatusPopup && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ">
    <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full h-[400px] max-h-[100vh] relative">
      <button
        onClick={() => setShowStatusPopup(false)}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
      >
        <i className="fas fa-times"></i>
      </button>
      <h3 className="text-2xl font-semibold mb-6 text-center text-gray-700">
        Thay đổi trạng thái vé
      </h3>
      <div className="mb-4">
        <label htmlFor="status-select" className="block text-gray-600 mb-2">
          Chọn trạng thái:
        </label>
        <select
          id="status-select"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
      </div>
      <div className="flex justify-end space-x-3">
        <button
          onClick={() => setShowStatusPopup(false)}
          className="px-5 py-2 text-sm text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all"
        >
          Hủy
        </button>
        <button
  onClick={() => setShowConfirmPopup(true)}
  className={`px-5 py-2 text-sm text-white rounded-lg transition-all ${
    selectedStatus
      ? "bg-blue-500 hover:bg-blue-600"
      : "bg-blue-300 cursor-not-allowed"
  }`}
  disabled={!selectedStatus}
>
  Lưu
</button>

      </div>
    </div>
  </div>
)}
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
        Bạn có chắc chắn muốn thay đổi trạng thái vé sang{" "}
        <span className="font-bold text-blue-500">{selectedStatus}</span> không?
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
            setShowConfirmPopup(false);
            handleChangeStatus();
          }}
          className="px-6 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all"
        >
          Xác nhận
        </button>
      </div>
    </div>
  </div>
)}

   <hr />
      <br /><br />
      <h2 className="text-2xl font-bold text-gray-800 mb-4" >Thông tin sự kiện</h2>
      <br />
      <br />
      {/* Thông tin sự kiện */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 flex justify-center">
  <div className="p-4 bg-gradient-to-r from-blue-50 via-blue-100 to-blue-200 border border-blue-300 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 flex justify-between items-center">
    <p className="text-lg text-gray-800 font-semibold">Thời gian:</p>
    <p className="text-lg text-gray-700 font-medium">{new Date(data.event.start_time).toLocaleString()} - {new Date(data.event.end_time).toLocaleString()}</p>
  </div>

  <div className="p-4 bg-gradient-to-r from-green-50 via-green-100 to-green-200 border border-green-300 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 flex justify-between items-center">
    <p className="text-lg text-gray-800 font-semibold">Địa điểm:</p>
    <p className="text-lg text-gray-700 font-medium">{data.event.location}</p>
  </div>

  <div className="p-4 bg-gradient-to-r from-yellow-50 via-yellow-100 to-yellow-200 border border-yellow-300 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 flex justify-between items-center">
    <p className="text-lg text-gray-800 font-semibold">Tỉnh/Thành phố:</p>
    <p className="text-lg text-gray-700 font-medium">{data.event.province}</p>
  </div>

  <div className="p-4 bg-gradient-to-r from-pink-50 via-pink-100 to-pink-200 border border-pink-300 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 flex justify-between items-center">
    <p className="text-lg text-gray-800 font-semibold">Quận/Huyện:</p>
    <p className="text-lg text-gray-700 font-medium">{data.event.district}</p>
  </div>

  <div className="p-4 bg-gradient-to-r from-purple-50 via-purple-100 to-purple-200 border border-purple-300 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 flex justify-between items-center">
    <p className="text-lg text-gray-800 font-semibold">Phường/Xã:</p>
    <p className="text-lg text-gray-700 font-medium">{data.event.ward}</p>
  </div>

  <div className="p-4 bg-gradient-to-r from-teal-50 via-teal-100 to-teal-200 border border-teal-300 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 flex justify-between items-center">
  <p className="text-lg text-gray-800 font-semibold">Loại sự kiện:</p>
  <p className="text-lg text-gray-700 font-medium">
    {data.event.event_type === 'offline' ? 'Trực tiếp' : data.event.event_type === 'online' ? 'Trực tuyến' : 'Không xác định'}
  </p>
</div>


  <div className="p-4 bg-gradient-to-r from-indigo-50 via-indigo-100 to-indigo-200 border border-indigo-300 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 flex justify-between items-center">
    <p className="text-lg text-gray-800 font-semibold">Link trực tuyến:</p>
    <p className="text-lg text-gray-700 font-medium">{data.event.link_online ? data.link_online : "Không có"}</p>
  </div>

  <div className="p-4 bg-gradient-to-r from-red-50 via-red-100 to-red-200 border border-red-300 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 flex justify-between items-center">
    <p className="text-lg text-gray-800 font-semibold">Số lượng tham gia tối đa:</p>
    <p className="text-lg text-gray-700 font-medium">{data.event.max_attendees}</p>
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
      <br /><br />
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


      
      {/* Popup hiển thị Vé */}
{/* Popup hiển thị Vé */}
{showTickets && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
  onClick={(e) => {
    // Kiểm tra nếu click không nằm trong nội dung popup
    if (e.target === e.currentTarget) {
      setShowTickets(false);
    }
  }}>
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-7xl w-full h-auto max-h-[90vh] overflow-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">Thông tin Vé</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {tickets.length > 0 ? (
  tickets.map((ticket) => (
    <div
      key={ticket.id}
      className="p-4 bg-gray-50 rounded-lg shadow-md mb-4"
    >
      <p className="font-semibold text-gray-800">
        Loại vé: {ticket.ticket_type}
      </p>
      {ticket.price && ticket.price.length > 0 ? (
        ticket.price.map((priceItem) => (
          <div
            key={priceItem.id}
            className="mt-2 p-3 border rounded-lg bg-white shadow-sm"
          >
            <p className="text-gray-600">
              Giá: <span className="font-semibold">{priceItem.price} VND</span>
            </p>
            <p className="text-gray-600">
              Số lượng: <span className="font-semibold">{priceItem.quantity}</span>
            </p>
            <p className="text-gray-600">
              Khu vực: <span className="font-semibold">{priceItem.zone?.name || "Không xác định"}</span>
            </p>
            <p className="text-gray-600">
              Ngày mở bán:{" "}
              {new Date(priceItem.sale_start).toLocaleString()}
            </p>
            <p className="text-gray-600">
              Ngày kết thúc bán:{" "}
              {new Date(priceItem.sale_end).toLocaleString()}
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">Chưa có thông tin giá vé.</p>
      )}
    </div>
  ))
) : (
  <p className="text-gray-500 col-span-2 text-center">
    Chưa có thông tin vé.
  </p>
)}

      </div>

      <hr className="my-6" />

      <h2 className="text-2xl font-semibold mb-4 text-center">Biểu đồ</h2>
      <div className="flex justify-center mb-6">
        <div className="w-1/3 max-w-sm">
          <Pie data={chartData} />
        </div>
      </div>

      <div className="text-right mt-4">
        <button
          onClick={() => setShowTickets(false)}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
          Đóng
        </button>
      </div>
    </div>
  </div>
)}


      {/* Popup hiển thị Người dùng */}
      {showUsers && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
  onClick={(e) => {
    // Kiểm tra nếu click không nằm trong nội dung popup
    if (e.target === e.currentTarget) {
      setShowUsers(false);
    }
  }}>
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-7xl w-full h-auto max-h-[80vh] overflow-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">Người đã mua vé</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2 text-left">STT</th>
              <th className="border border-gray-300 px-4 py-2 text-left">ID người dùng</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Mã vé</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Trạng thái check-in</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {user.pivot.user_id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {user.ticket_code}
                  </td>
                  <td
                    className={`border border-gray-300 px-4 py-2 ${
                      user.pivot.checked_in === 1 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {user.pivot.checked_in === 1 ? "Đã check-in" : "Chưa check-in"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                  <td className="border border-gray-300 px-4 py-2 text-center">
  <button
    onClick={() => {
      // Kiểm tra trạng thái của user để gọi hàm phù hợp
      if (user.pivot.checked_in === 1) {
        handleCancelCheckIn(user.id, user.ticket_code);
      } else {
        handleCheckIn(user.id, user.ticket_code);
      }
    }}
    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 w-[150px] ${
      user.pivot.checked_in === 1
        ? "bg-red-500 text-white hover:bg-red-600"
        : "bg-green-500 text-white hover:bg-green-600"
    }`}
  >
    {user.pivot.checked_in === 1 ? "Hủy check-in" : "Check-in"}
  </button>
</td>


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

    </div>
  );
};

export default DetailEvents;
