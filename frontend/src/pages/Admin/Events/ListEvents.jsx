import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents, deleteEvent } from '../../../api_service/event'; // Gọi API từ file auth-service

const EventList = () => {
  const [list, setList] = useState([]); 

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getEvents();
        if (response && Array.isArray(response.data)) {
          setList(response.data);
        } else {
          console.error('Dữ liệu trả về không phải là mảng:', response);
          setList([]);
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu sự kiện:', error);
      }
    };
    fetchEvents();
  }, []);

  const onDelete = async (id) => {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa sự kiện này?');
    if (confirmDelete) {
      try {
        await deleteEvent(id);
        const updatedList = list.filter(event => event.id !== id);
        setList(updatedList);
      } catch (error) {
        console.error('Lỗi khi xóa sự kiện:', error);
      }
    }
  };

  // Hàm lấy màu sắc cho trạng thái sự kiện
  const getStatusColor = (statusId) => {
    switch (statusId) {
      case 1:
        return 'bg-green-500'; // Đang diễn ra
      case 'confirmed':
        return 'bg-blue-500'; // Đã xác nhận
      case 'pending':
        return 'bg-yellow-500'; // Chờ duyệt
      case 'canceled':
        return 'bg-red-500'; // Đã hủy
      default:
        return 'bg-gray-300'; // Trạng thái khác
    }
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-3xl font-bold mb-4 text-center">Danh sách sự kiện</h2>
        <hr />
        <br />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-center">
          {Array.isArray(list) && list.length > 0 ? (
            list.map((event) => (
              <div key={event.id} className="relative flex flex-col bg-white p-4 rounded-md shadow-sm cursor-pointer border-2 border-gray-50 hover:border-black transition-colors duration-300 w-64 h-80 mx-auto">
                {/* Trạng thái sự kiện */}
                <div className={`absolute top-2 left-2 ${getStatusColor(event.status)} text-white px-3 py-1 text-sm rounded-br-md z-10`}>
                  {event.status === 'pending' ? 'Chờ duyệt' :
                   event.status === 'confirmed' ? 'Đã xác nhận' :
                   event.status === 'ongoing' ? 'Đang diễn ra' :
                   event.status === 'canceled' ? 'Đã hủy' : 'Trạng thái không xác định'}
                </div>

                {/* Icons sửa và xóa */}
                <div className="icons absolute top-2 right-2 p-2 text-right z-10">
                  <Link to={`/admin/update-event/${event.id}`}>
                    <i className="fas fa-pencil-alt mx-3 text-gray-600"></i>
                  </Link>
                  <i className="fas fa-trash-alt text-red-600 cursor-pointer" onClick={() => onDelete(event.id)}></i>
                </div>

                {/* Ảnh sự kiện thumbnail */}
                <img src={event.thumbnail} className="w-full h-[100px] rounded-lg shadow-lg object-cover mt-4" alt={event.name} />

                <h2 className="text-xl font-semibold mb-2">{event.name}</h2>
                <p className="text-gray-600 mb-2">Loại hình: {event.event_type === 'online' ? 'Trực tuyến' : 'Trực tiếp'}</p>
                <p className="text-green-500 mb-2">
                  {event.status === 'ongoing' ? `Đang diễn ra từ ${new Date(event.start_time).toLocaleDateString()}` : 
                    event.status === 'confirmed' ? `Sẽ diễn ra vào ${new Date(event.start_time).toLocaleDateString()}` : 
                    'Sự kiện đã kết thúc'}
                </p>
                {event.event_type === 'online' && (
                  <a href={event.link_online} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline mb-2 block">
                    Tham gia Zoom
                  </a>
                )}
                
                <div className="flex-grow"></div> {/* Tạo không gian cho nút */}

                {/* Nút "Xem chi tiết" */}
                <Link to={`/detail/${event.id}`}>
                  <button className="btn btn-info bg-blue-500 text-white px-4 py-2 rounded-lg mt-2">
                    Xem chi tiết
                  </button>
                </Link>
              </div>
            ))
          ) : (
            <div className="text-center">Không có sự kiện nào</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventList;
