import React from 'react';

const DetailEvents = () => {
  const event = {
    id: 6,
    name: 'Sự kiện 2',
    status: 'Sắp diễn ra',
    eventType: 'Offline',
    startDate: new Date('2024-10-25'),
    endDate: new Date('2024-10-26'),
    participants: 100,
    speaker: 'Nguyễn Văn A',
    location: 'Hà Nội',
    zoomLink: 'sdasfdghjghgdfsdafg',
    category: 'Khóa học',
    description: '<p>Đây là mô tả cho sự kiện 2.</p>',
    thumbnail: 'https://picsum.photos/401/200', // Ảnh thumbnail
    imageUrl: 'https://picsum.photos/501/301', // Ảnh trong mô tả
  };

  return (
    <div className="mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">{event.name}</h2>
      <div className="text-center mb-6">
        <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${event.status === 'Sắp diễn ra' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
          {event.status}
        </span>
      </div>
      <div className="text-center mb-4">
        <img src={event.thumbnail} alt="Thumbnail" className="w-full h-40 object-cover rounded-lg shadow-md mb-4" />
      </div>
      

      {/* Điều chỉnh chiều rộng phần thông tin sự kiện */}
      <div className="text-center">
        <div className="bg-gray-50 p-6 rounded-lg shadow-md w-full"> {/* Thêm w-full để đảm bảo chiều rộng đầy đủ */}
          <h3 className="text-lg font-semibold text-gray-700">Thông tin sự kiện</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p className="text-gray-600"><strong>Ngày bắt đầu:</strong> {new Date(event.startDate).toLocaleDateString()}</p>
            <p className="text-gray-600"><strong>Ngày kết thúc:</strong> {new Date(event.endDate).toLocaleDateString()}</p>
            <p className="text-gray-600"><strong>Loại hình:</strong> {event.eventType}</p>
            <p className="text-gray-600"><strong>Số lượng tham gia:</strong> {event.participants}</p>
            <p className="text-gray-600"><strong>Diễn giả:</strong> {event.speaker}</p>
            <p className="text-gray-600"><strong>Địa điểm:</strong> {event.location}</p>
            <p className="text-gray-600"><strong>Danh mục:</strong> {event.category}</p>
            {event.zoomLink && (
              <p className="text-gray-600">
                <strong>Link Zoom: </strong> 
                <a href={event.zoomLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{event.zoomLink}</a>
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700">Mô tả sự kiện</h3>
        <div className="prose" dangerouslySetInnerHTML={{ __html: event.description }} />
      </div>
      
      <div className="text-center">
        <img src={event.imageUrl} alt="Mô tả sự kiện" className="w-full h-64 object-cover rounded-lg shadow-md" />
      </div>
    </div>
  );
};

export default DetailEvents;
