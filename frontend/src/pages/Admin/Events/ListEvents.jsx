import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const EventList = () => {
  const mockEventData = [
    {
      id: 1,
      name: 'Sự kiện 1',
      status: 'Đang diễn ra',
      eventType: 'Online',
      startDate: new Date('2024-10-20'),
      endDate: new Date('2024-10-22'),
      participants: 50,
      speaker: 'Nguyễn Văn B',
      location: 'Hà Nội',
      zoomLink: 'https://zoom.us/j/123456789',
      category: 'Hội thảo',
      description: '<p>Đây là mô tả cho sự kiện 1.</p>',
      thumbnail: 'https://picsum.photos/400/200',
      imageUrl: 'https://picsum.photos/500/300', // ảnh trong mô tả
    },
    {
      id: 2,
      name: 'Sự kiện 2',
      status: 'Sắp diễn ra',
      eventType: 'Offline',
      startDate: new Date('2024-10-25'),
      endDate: new Date('2024-10-26'),
      participants: 100,
      speaker: 'Nguyễn Văn A',
      location: 'Hà Nội',
      zoomLink: '',
      category: 'Khóa học',
      description: '<p>Đây là mô tả cho sự kiện 2.</p>',
      thumbnail: 'https://picsum.photos/401/200',
      imageUrl: 'https://picsum.photos/501/301', // ảnh trong mô tả
    },
    ,
    {
      id: 3,
      name: 'Sự kiện 2',
      status: 'Sắp diễn ra',
      eventType: 'Offline',
      startDate: new Date('2024-10-25'),
      endDate: new Date('2024-10-26'),
      participants: 100,
      speaker: 'Nguyễn Văn A',
      location: 'Hà Nội',
      zoomLink: '',
      category: 'Khóa học',
      description: '<p>Đây là mô tả cho sự kiện 2.</p>',
      thumbnail: 'https://picsum.photos/401/200',
      imageUrl: 'https://picsum.photos/501/301', // ảnh trong mô tả
    },
    ,
    {
      id: 4,
      name: 'Sự kiện 2',
      status: 'Sắp diễn ra',
      eventType: 'Offline',
      startDate: new Date('2024-10-25'),
      endDate: new Date('2024-10-26'),
      participants: 100,
      speaker: 'Nguyễn Văn A',
      location: 'Hà Nội',
      zoomLink: '',
      category: 'Khóa học',
      description: '<p>Đây là mô tả cho sự kiện 2.</p>',
      thumbnail: 'https://picsum.photos/401/200',
      imageUrl: 'https://picsum.photos/501/301', // ảnh trong mô tả
    },
    ,
    {
      id: 5,
      name: 'Sự kiện 2',
      status: 'Đã kết thúc',
      eventType: 'Offline',
      startDate: new Date('2024-10-25'),
      endDate: new Date('2024-10-26'),
      participants: 100,
      speaker: 'Nguyễn Văn A',
      location: 'Hà Nội',
      zoomLink: '',
      category: 'Khóa học',
      description: '<p>Đây là mô tả cho sự kiện 2.</p>',
      thumbnail: 'https://picsum.photos/401/200',
      imageUrl: 'https://picsum.photos/501/301', // ảnh trong mô tả
    },
    ,
    {
      id: 6,
      name: 'Sự kiện 2',
      status: 'Sắp diễn ra',
      eventType: 'Offline',
      startDate: new Date('2024-10-25'),
      endDate: new Date('2024-10-26'),
      participants: 100,
      speaker: 'Nguyễn Văn A',
      location: 'Hà Nội',
      zoomLink: '',
      category: 'Khóa học',
      description: '<p>Đây là mô tả cho sự kiện 2.</p>',
      thumbnail: 'https://picsum.photos/401/200',
      imageUrl: 'https://picsum.photos/501/301', // ảnh trong mô tả
    },
  ];

  const [list, setList] = useState(mockEventData); // Sử dụng mock data ở đây

  // Hàm xóa sự kiện
  const onDelete = (id) => {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa sự kiện này?');
    if (confirmDelete) {
      const updatedList = list.filter(event => event.id !== id);
      setList(updatedList);
    }
  };

  // Hàm lấy màu sắc cho trạng thái sự kiện
  const getStatusColor = (status) => {
    switch (status) {
      case 'Đang diễn ra':
        return 'bg-green-500';
      case 'Sắp diễn ra':
        return 'bg-yellow-500';
      case 'Đã kết thúc':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Hàm lấy thông tin thời gian sự kiện
  const getEventTimeInfo = (status, startDate) => {
    const currentDate = new Date();
    if (status === 'Đang diễn ra') {
      return `Đang diễn ra từ ${startDate.toLocaleDateString()}`;
    } else if (status === 'Sắp diễn ra') {
      return `Sẽ diễn ra vào ${startDate.toLocaleDateString()}`;
    } else {
      return 'Sự kiện đã kết thúc';
    }
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-3xl font-bold mb-4 text-center">Danh sách sự kiện</h2>
        <hr />
        <br />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-center">
          {list.map((event) => (
            <div key={event.id} className="relative flex flex-col bg-white p-4 rounded-md shadow-sm cursor-pointer border-2 border-gray-50 hover:border-black transition-colors duration-300 max-w-xs mx-auto">
              {/* Trạng thái sự kiện */}
              <div className={`absolute top-2 left-2 ${getStatusColor(event.status)} text-white px-3 py-1 text-sm rounded-br-md z-10`}>
                {event.status}
              </div>

              {/* Icons sửa và xóa */}
              <div className="icons absolute top-2 right-2 p-2 text-right z-10">
                <Link to={`/admin/update-event/${event.id}`}>
                  <i className="fas fa-pencil-alt mx-3 text-gray-600"></i>
                </Link>
                <i className="fas fa-trash-alt text-red-600 cursor-pointer" onClick={() => onDelete(event.id)}></i>
              </div>

              {/* Ảnh sự kiện thumbnail */}
              <img src={event.thumbnail} className="w-full h-40 rounded-lg shadow-lg object-cover mt-4" alt={event.name} />

              <h2 className="text-xl font-semibold mb-2">{event.name}</h2>
              <p className="text-gray-600 mb-2">Loại hình: {event.eventType === 'Online' ? 'Trực tuyến' : 'Trực tiếp'}</p>
              <p className="text-green-500 mb-2">{getEventTimeInfo(event.status, event.startDate)}</p>
              {event.eventType === 'Online' && (
                <a href={event.zoomLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline mb-2 block">
                  Tham gia Zoom
                </a>
              )}
              <div className="flex-grow"></div>
              <Link to={`/detail/${event.id}`}>
                <button className="btn btn-info bg-blue-500 text-white px-4 py-2 rounded-lg mt-2">
                  Xem chi tiết
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventList;
