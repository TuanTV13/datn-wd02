import React, { useState } from 'react';

// Popup Component for ticket selection
const TicketPopup = ({ onClose, onConfirm }) => {
  const [selectedType, setSelectedType] = useState('VIP');
  const [quantity, setQuantity] = useState(1);

  // Giả lập dữ liệu vé từ database
  const ticketData = [
    {
      id: 1,
      ticket_type: 'VIP',
      price: 500000,
      available_quantity: 20,
      seat_location: 'Khu VIP, hàng đầu',
      sale_start: '2024-10-20',
      sale_end: '2024-11-20',
      description: 'Vé VIP mang đến trải nghiệm đẳng cấp nhất trong sự kiện.',
    },
    {
      id: 2,
      ticket_type: 'Thường',
      price: 200000,
      available_quantity: 100,
      seat_location: 'Khu vực thường',
      sale_start: '2024-10-20',
      sale_end: '2024-11-20',
      description: 'Vé Thường giúp bạn tham gia sự kiện với giá hợp lý.',
    },
  ];

  const selectedTicket = ticketData.find((ticket) => ticket.ticket_type === selectedType);

  const increaseQuantity = () => {
    if (quantity < selectedTicket.available_quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const totalPrice = selectedTicket.price * quantity;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto space-y-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Chọn loại vé</h2>

        {/* Chọn loại vé với 2 nút */}
        <div className="flex justify-center space-x-4 mb-4">
          <button
            onClick={() => {
              setSelectedType('VIP');
              setQuantity(1); // Reset số lượng khi đổi loại vé
            }}
            className={`px-4 py-2 font-semibold rounded-md focus:outline-none ${
              selectedType === 'VIP' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            Vé VIP
          </button>
          <button
            onClick={() => {
              setSelectedType('Thường');
              setQuantity(1); // Reset số lượng khi đổi loại vé
            }}
            className={`px-4 py-2 font-semibold rounded-md focus:outline-none ${
              selectedType === 'Thường' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            Vé Thường
          </button>
        </div>

        {/* Thông tin vé được chọn */}
        <div className="bg-gray-100 rounded-lg p-4 space-y-2">
          <p><strong>Giá vé:</strong> {selectedTicket.price.toLocaleString()} VND</p>
          <p><strong>Số lượng còn:</strong> {selectedTicket.available_quantity}</p>
          <p><strong>Vị trí chỗ ngồi:</strong> {selectedTicket.seat_location}</p>
          <p><strong>Thời gian bán:</strong> {selectedTicket.sale_start} - {selectedTicket.sale_end}</p>
          <p><strong>Mô tả:</strong> {selectedTicket.description}</p>
        </div>

        {/* Nhập số lượng vé với nút cộng trừ */}
        <div className="flex items-center justify-center mt-4 space-x-4">
          <button 
            onClick={decreaseQuantity} 
            className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-full text-lg font-bold focus:outline-none"
            disabled={quantity <= 1}
          >
            -
          </button>
          <span className="w-10 text-center text-xl font-semibold">{quantity}</span>
          <button 
            onClick={increaseQuantity} 
            className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-full text-lg font-bold focus:outline-none"
            disabled={quantity >= selectedTicket.available_quantity}
          >
            +
          </button>
        </div>

        {/* Tổng giá */}
        <div className="text-center">
          <p className="text-lg font-semibold">Tổng giá: <span className="text-blue-600">{totalPrice.toLocaleString()} VND</span></p>
        </div>

        {/* Nút xác nhận và hủy */}
        <div className="flex justify-end space-x-4 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md font-semibold focus:outline-none">Hủy</button>
          <button onClick={() => onConfirm(selectedType, quantity, totalPrice)} className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold focus:outline-none">
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};


// Main EventDetail component
const EventDetail = () => {
  const [showPopup, setShowPopup] = useState(false);

  // Giả lập trạng thái sự kiện
  const eventStatus = {
    id: 1,
    name: 'Đang diễn ra',
  };
  
  const eventDescription = "Chào mừng bạn đến với sự kiện 'Những Thành Phố Mơ Màng'. Đây là một trải nghiệm tuyệt vời để khám phá những địa điểm tuyệt đẹp và những câu chuyện hấp dẫn về các thành phố nổi tiếng.";
  const eventImages = [
    "https://i.pinimg.com/736x/2f/37/8c/2f378ce8cc27a74ca5d0b351da1c341a.jpg",
    "https://i.pinimg.com/736x/2f/37/8c/2f378ce8cc27a74ca5d0b351da1c341a.jpg",
    "https://i.pinimg.com/736x/2f/37/8c/2f378ce8cc27a74ca5d0b351da1c341a.jpg",
    "https://i.pinimg.com/736x/2f/37/8c/2f378ce8cc27a74ca5d0b351da1c341a.jpg"
  ];

  const similarEvents = [
    { id: 1, name: 'Sự kiện A', status: 'Đã kết thúc', thumbnail: 'https://i.pinimg.com/736x/2f/37/8c/2f378ce8cc27a74ca5d0b351da1c341a.jpg' },
    { id: 2, name: 'Sự kiện B', status: 'Sắp diễn ra', thumbnail: 'https://i.pinimg.com/736x/2f/37/8c/2f378ce8cc27a74ca5d0b351da1c341a.jpg' },
    { id: 3, name: 'Sự kiện C', status: 'Chờ duyệt', thumbnail: 'https://i.pinimg.com/736x/2f/37/8c/2f378ce8cc27a74ca5d0b351da1c341a.jpg' },
    { id: 4, name: 'Sự kiện D', status: 'Đang diễn ra', thumbnail: 'https://i.pinimg.com/736x/2f/37/8c/2f378ce8cc27a74ca5d0b351da1c341a.jpg' },
  ];

  const getStatusColor = (statusId) => {
    switch (statusId) {
      case 1:
        return 'bg-green-500';
      case 2:
        return 'bg-yellow-500';
      case 3:
        return 'bg-red-500';
      case 4:
        return 'bg-gray-500';
      case 5:
        return 'bg-blue-500';
      default:
        return 'bg-gray-300';
    }
  };

  const handleBuyTicketClick = () => setShowPopup(true);
  const handleClosePopup = () => setShowPopup(false);

 // Cập nhật hàm handleConfirmPurchase trong EventDetail
const handleConfirmPurchase = (ticketType, quantity, totalPrice) => {
  // Chuyển hướng sang trang thanh toán cùng với thông tin vé
  window.location.href = `/payment?ticketType=${ticketType}&quantity=${quantity}&totalPrice=${totalPrice}`;
};

  return (
    <div className='container pt-40'>
      <div 
        className="relative w-full h-[500px] bg-gray-100 rounded-lg overflow-hidden" 
        style={{ backgroundImage: "url('https://i.pinimg.com/736x/2f/37/8c/2f378ce8cc27a74ca5d0b351da1c341a.jpg')" }}
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        
        <div className="absolute inset-0 text-white p-8 flex flex-col items-center justify-center" style={{ left: '60%' }}>
          <h1 style={{ fontFamily: 'Dancing Script, cursive' }} className="text-5xl font-bold text-center">
            NHỮNG THÀNH PHỐ MƠ MÀNG
          </h1>
          <br />
          <button 
            onClick={handleBuyTicketClick} 
            className="w-[150px] h-[50px] bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
          >
            Mua vé
          </button>
          <div className="mt-4 text-center">
            <p className="text-lg">Thời gian bắt đầu: 20:00, 30/10/2024</p>
            <p className="text-lg">Thời gian kết thúc: 22:00, 30/10/2024</p>
            <p className="text-lg">Địa điểm: Nhà hát lớn</p>
          </div>
          <div className={`mt-4 px-4 py-2 rounded-full text-white ${getStatusColor(eventStatus.id)}`}>
            {eventStatus.name}
          </div>
        </div>
      </div>

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

      <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Sự kiện tương tự</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
          {similarEvents.map((event) => (
            <div key={event.id} className="flex flex-col items-center p-4 border border-gray-300 rounded-lg shadow-sm">
              <img src={event.thumbnail} alt={event.name} className="w-[200px] h-auto rounded-md mb-2" />
              <div className="text-center">
                <h3 className="font-semibold text-lg">{event.name}</h3>
                <div className={`mt-1 px-2 py-1 rounded-full text-white ${getStatusColor(event.id)}`}>
                  {event.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showPopup && (
        <TicketPopup onClose={handleClosePopup} onConfirm={handleConfirmPurchase} />
      )}
    </div>
  );
}

export default EventDetail;
