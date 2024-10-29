import React from 'react';

const EventDetail = () => {
  // Giả lập trạng thái sự kiện. Thay đổi giá trị này theo trạng thái thực tế của sự kiện.
  const eventStatus = {
    id: 1, // Trạng thái: 1 - Đang diễn ra, 2 - Sắp diễn ra, 3 - Đã kết thúc, 4 - Bị hủy, 5 - Chờ duyệt
    name: 'Đang diễn ra', // Tên trạng thái
  };

  // Giả lập mô tả sự kiện
  const eventDescription = "Chào mừng bạn đến với sự kiện 'Những Thành Phố Mơ Màng'. Đây là một trải nghiệm tuyệt vời để khám phá những địa điểm tuyệt đẹp và những câu chuyện hấp dẫn về các thành phố nổi tiếng.";
  const eventImages = [
    "https://i.pinimg.com/736x/2f/37/8c/2f378ce8cc27a74ca5d0b351da1c341a.jpg",
    "https://i.pinimg.com/736x/2f/37/8c/2f378ce8cc27a74ca5d0b351da1c341a.jpg",
    "https://i.pinimg.com/736x/2f/37/8c/2f378ce8cc27a74ca5d0b351da1c341a.jpg",
    "https://i.pinimg.com/736x/2f/37/8c/2f378ce8cc27a74ca5d0b351da1c341a.jpg"
  ]; // Danh sách URL ảnh sự kiện

  // Giả lập danh sách sự kiện tương tự
  const similarEvents = [
    {
      id: 1,
      name: 'Sự kiện A',
      status: 'Đã kết thúc',
      thumbnail: 'https://i.pinimg.com/736x/2f/37/8c/2f378ce8cc27a74ca5d0b351da1c341a.jpg',
    },
    {
      id: 2,
      name: 'Sự kiện B',
      status: 'Sắp diễn ra',
      thumbnail: 'https://i.pinimg.com/736x/2f/37/8c/2f378ce8cc27a74ca5d0b351da1c341a.jpg',
    },
    {
      id: 3,
      name: 'Sự kiện C',
      status: 'Chờ duyệt',
      thumbnail: 'https://i.pinimg.com/736x/2f/37/8c/2f378ce8cc27a74ca5d0b351da1c341a.jpg',
    },
    {
      id: 4,
      name: 'Sự kiện D',
      status: 'Đang diễn ra',
      thumbnail: 'https://i.pinimg.com/736x/2f/37/8c/2f378ce8cc27a74ca5d0b351da1c341a.jpg',
    },
  ];

  const getStatusColor = (statusId) => {
    switch (statusId) {
      case 1:
        return 'bg-green-500'; // Đang diễn ra
      case 2:
        return 'bg-yellow-500'; // Sắp diễn ra
      case 3:
        return 'bg-red-500'; // Đã kết thúc
      case 4:
        return 'bg-gray-500'; // Bị hủy
      case 5:
        return 'bg-blue-500'; // Chờ duyệt
      default:
        return 'bg-gray-300'; // Trạng thái khác
    }
  };

  return (
    <div className='container pt-40'>
      <div 
        className="relative w-full h-[500px] bg-gray-100 rounded-lg overflow-hidden" 
        style={{ backgroundImage: "url('https://i.pinimg.com/736x/2f/37/8c/2f378ce8cc27a74ca5d0b351da1c341a.jpg')" }}
      >
        {/* Lớp nền mờ */}
        <div className="absolute inset-0 bg-black opacity-20"></div>
        
        <div className="absolute inset-0 text-white p-8 flex flex-col items-center justify-center" style={{ left: '60%' }}>
          <h1 style={{ fontFamily: 'Dancing Script, cursive' }} className="text-5xl font-bold text-center">
            NHỮNG THÀNH PHỐ MƠ MÀNG
          </h1>
          <br />
          <button className="w-[150px] h-[50px] bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md">
            Mua vé
          </button>
          <div className="mt-4 text-center">
            <p className="text-lg">Thời gian bắt đầu: 20:00, 30/10/2024</p>
            <p className="text-lg">Thời gian kết thúc: 22:00, 30/10/2024</p>
            <p className="text-lg">Địa điểm: Nhà hát lớn</p>
          </div>
          
          {/* Phần hiển thị trạng thái sự kiện */}
          <div className={`mt-4 px-4 py-2 rounded-full text-white ${getStatusColor(eventStatus.id)}`}>
            {eventStatus.name}
          </div>
        </div>
      </div>

      {/* Phần mô tả sự kiện */}
      <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Mô tả sự kiện</h2>
        <p className="mb-4 text-gray-700">{eventDescription}</p>
        
        <h3 className="text-xl font-semibold mb-2">Hình ảnh sự kiện</h3>
        <div className="grid grid-cols-2 gap-4 justify-items-center">
          {eventImages.map((image, index) => (
            <img key={index} src={image} alt={`Sự kiện ${index + 1}`} className="w-[80%] h-auto rounded-md shadow-lg" />
          ))}
        </div>
      </div>

      {/* Phần sự kiện tương tự */}
      <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Sự kiện tương tự</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
  {similarEvents.map((event) => (
    <div key={event.id} className="flex flex-col items-center p-4 border border-gray-300 rounded-lg shadow-sm">
      <img src={event.thumbnail} alt={event.name} className="w-[200px] h-auto rounded-md mb-2" /> {/* Tăng kích thước hình ảnh */}
      <div className="text-center">
        <h3 className="font-semibold text-lg">{event.name}</h3> {/* Tăng kích thước chữ tên sự kiện */}
        <div className={`mt-1 px-2 py-1 rounded-full text-white ${getStatusColor(event.id)}`}>
          {event.status}
        </div>
      </div>
    </div>
  ))}
</div>

      </div>
    </div>
  );
}

export default EventDetail;
