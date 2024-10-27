import React from 'react';

const EventDetail = () => {
  return (
    <div className='container pt-40'>
      <div 
        className="relative w-full h-[500px] bg-gray-100" 
        style={{ backgroundImage: "url('https://i.pinimg.com/736x/2f/37/8c/2f378ce8cc27a74ca5d0b351da1c341a.jpg')" }}
      >
        {/* Lớp nền mờ */}
        <div className="absolute inset-0 bg-black opacity-20 rounded-lg"></div>
        
        <div className="absolute inset-0 text-white p-8 rounded-lg flex flex-col items-center justify-center transform translate-x-[25%]">
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
        </div>
      </div>
    </div>
  );
}

export default EventDetail;
