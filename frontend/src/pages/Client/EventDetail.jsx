import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [similarEvents, setSimilarEvents] = useState([]);
  useEffect(() => {
<<<<<<< HEAD
    axios.get(`http://192.168.2.145:8000/api/v1/clients/events/${id}`)
=======
    axios.get(`http://192.168.2.112:8000/api/v1/clients/events/${id}`)
>>>>>>> 300ec41077ab17a09a4e66676bf4134a7ec9feb9
      .then((response) => {
        setEvent(response.data.data);
      })
      .catch((error) => {
        console.error('Lỗi khi gọi API:', error);
      });
  }, [id]);
  const fetchSimilarEvents = (categoryId) => {
<<<<<<< HEAD
    axios.get(`http://192.168.2.145:8000/api/v1/clients/category/${categoryId}`)
=======
    axios.get(`http://192.168.2.112:8000/api/v1/clients/category/${categoryId}`)
>>>>>>> 300ec41077ab17a09a4e66676bf4134a7ec9feb9
      .then((response) => {
        setSimilarEvents(response.data.data.filter((e) => e.id !== id)); // Lọc bỏ sự kiện hiện tại
      })
      .catch((error) => {
        console.error('Lỗi khi lấy sự kiện tương tự:', error);
      });
  };
  const getStatusTextAndColor = (status) => {
    switch (status) {
      case 'confirmed':
        return { text: 'Đang chuẩn bị', color: 'bg-yellow-500' };
      case 'checkin':
        return { text: 'Đang check-in', color: 'bg-green-500' };
      case 'ongoing':
        return { text: 'Đang diễn ra', color: 'bg-blue-500' };
      case 'completed':
        return { text: 'Đã kết thúc', color: 'bg-gray-500' };
      default:
        return null;
    }
  };

  const handleBuyTicketClick = (ticket) => {
    setSelectedTicket(ticket);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedTicket(null);
  };

  const handleConfirmPurchase = () => {
    if (selectedTicket) {
      const totalPrice = selectedTicket.price;
      const ticketId = selectedTicket.id;  // Lấy id vé
      window.location.href = `/checkout?ticketType=${selectedTicket.ticket_type}&totalPrice=${totalPrice}&ticketId=${ticketId}`;  // Thêm id vé vào URL
    }
  };
  

  if (!event) {
    return <div>Đang tải sự kiện...</div>;
  }

  const statusInfo = getStatusTextAndColor(event.status);

  return (
    <div className="container pt-40">
      {/* Ảnh nền sự kiện */}
      <div
        className="relative w-full h-[500px] bg-gray-100 rounded-lg overflow-hidden"
        style={{ backgroundImage: `url('${event.thumbnail}')` }}
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>

        <div
          className="absolute inset-0 text-white p-8 flex flex-col items-center justify-center"
          style={{ left: '60%' }}
        >
          <h1 style={{ fontFamily: 'Dancing Script, cursive' }} className="text-5xl font-bold text-center">
            {event.name}
          </h1>

          {event.status !== 'completed' && (
            <>
              <p className="mt-4 text-lg">
                Thời gian bắt đầu: {new Date(event.start_time).toLocaleString()}
              </p>
              <p className="text-lg">
                Thời gian kết thúc: {new Date(event.end_time).toLocaleString()}
              </p>
              <br />
              <button
                onClick={() => setShowPopup(true)}
                className="w-[150px] h-[50px] bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
              >
                Mua vé
              </button>
            </>
          )}
          <div className="mt-4 text-center">
            <p className="text-lg">Địa điểm: {`${event.ward}, ${event.district}, ${event.province}`}</p>
          </div>
          {statusInfo && (
            <div className={`mt-4 px-4 py-2 rounded-full text-white ${statusInfo.color}`}>
              {statusInfo.text}
            </div>
          )}
        </div>
      </div>

           {/* Diễn giả */}
      <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Diễn giả</h2>
        <ul className="list-disc list-inside">
          {event.speakers.map((speaker, index) => (
            <li key={index} className="text-gray-700">{speaker}</li>
          ))}
        </ul>
      </div>
      {/* Mô tả sự kiện */}
      <div className="mt-8 p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Mô tả sự kiện</h2>
        <div
          className="mb-4 text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: event.description.replace(
              /<img/g, 
              '<img class="max-w-[40%] h-auto mx-auto my-4 p-2 border border-gray-300 rounded-md shadow-sm"'
            )
          }}
        ></div>

      </div>
     {/* Sự kiện tương tự */}
<div className="mt-8 p-8 bg-white rounded-lg shadow-md">
  <h2 className="text-2xl font-bold mb-4">Sự kiện tương tự</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {similarEvents.map((event) => (
      <div key={event.id} className="border p-4 rounded-lg">
        <img 
          src={event.thumbnail} 
          alt={event.name} 
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        <h3 className="text-lg font-semibold text-center">{event.name}</h3>
        <button  
          className="text-blue-500 hover:underline mt-2 block text-center"
          onClick={() => window.location.href = `/event-detail/${event.id}`}
        >
          Xem chi tiết
        </button>
      </div>
    ))}
  </div>
</div>

     

      {/* Hiển thị Popup nếu showPopup là true */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h2 className="text-2xl font-bold mb-4">Chọn vé</h2>
            
            {event.tickets.map((ticket) => (
              <div 
                key={ticket.id} 
                className={`border p-4 rounded-lg mb-4 cursor-pointer hover:bg-gray-100 ${selectedTicket?.id === ticket.id ? 'bg-blue-100 border-blue-500' : ''}`}
                onClick={() => handleBuyTicketClick(ticket)}
              >
                <h3 className="text-lg font-semibold">{ticket.ticket_type}</h3>
                <p>Giá: {ticket.price} VND</p>
                <p>Số lượng còn lại: {ticket.available_quantity}</p>
                <p>Vị trí: {ticket.seat_location}</p>
              </div>
            ))}

            <div className="mt-4 flex justify-between">
              <button 
                onClick={handleClosePopup} 
                className="bg-gray-500 text-white py-2 px-4 rounded"
              >
                Đóng
              </button>
              <button 
                onClick={handleConfirmPurchase} 
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetail;
