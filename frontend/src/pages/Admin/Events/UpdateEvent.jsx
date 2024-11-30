import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const UpdateEvent = () => {
  const { id } = useParams(); // Lấy id từ URL
  const [formData, setFormData] = useState({
    start_time: "",
    end_time: "",
    location: "",
  });
  const [loading, setLoading] = useState(false); // Quản lý trạng thái đang tải
  const token = localStorage.getItem("access_token");

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  };

  useEffect(() => {
    // Lấy thông tin sự kiện từ API
    axios
      .get(`http://192.168.2.112:8000/api/v1/events/${id}/show`, { headers })
      .then((response) => {
        const event = response.data.data.event;
       
        setFormData({
          start_time: event.start_time,
          end_time: event.end_time,
          location: event.location,
        });
      })
      .catch((error) => console.error("Lỗi khi lấy sự kiện:", error));
  }, [id]);

  // Hàm định dạng lại thời gian
  const formatDate = (date) => {
    const newDate = new Date(date);
    return newDate.toISOString().slice(0, 19); // YYYY-MM-DDTHH:mm:ss
  };

  const handleChange = (e) => {
   const { name, value } = e.target;
   setFormData((prevData) => {
     const updatedData = { ...prevData, [name]: value };
     console.log("formData sau khi cập nhật:", updatedData);
     return updatedData;
   });
 };
 
 
 const handleSubmit = async (e) => {
   e.preventDefault();
   setLoading(true);
 
   // Kiểm tra dữ liệu trước khi gửi
   if (!formData.start_time || !formData.end_time || !formData.location) {
     console.log("Vui lòng nhập đầy đủ thông tin.");
     setLoading(false);
     return;
   }
 
   // Định dạng dữ liệu gửi đi
   const formattedData = {
     start_time: formatDate(formData.start_time),
    
     
     end_time: formatDate(formData.end_time),
     location: formData.location,
   };
   console.log(formData.end_time);
   console.log("Dữ liệu gửi đi:", formattedData);
 
   try {
     const result = await axios.put(
       `http://192.168.2.112:8000/api/v1/events/${id}/update`,
       formattedData, // Gửi dữ liệu dạng JSON
       { 
         headers: {
           Authorization: `Bearer ${token}`,
           "Content-Type": "application/json", // Đặt Content-Type cho JSON
         },
       }
     );
     console.log("Cập nhật thành công:", result);
     alert("Cập nhật sự kiện thành công!");
   } catch (error) {
     console.error("Lỗi khi cập nhật sự kiện:", error);
     alert(error.response.data.message);
   } finally {
     setLoading(false);
   }
 };
 
  return (
   <div className="bg-white rounded-lg shadow p-6">
    <form onSubmit={handleSubmit} className="space-y-4">
    <h2 className="text-3xl font-bold mb-4 text-center">Cập nhật sự kiện</h2>
        <hr />
        <br />

      <div className="grid grid-cols-1 gap-4">
        <div className="form-group">
          <label className="form-label">Địa điểm:</label>
          <input
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            
            className="form-control"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label">Thời gian bắt đầu:</label>
          <input
            name="start_time"
            type="datetime-local"
            value={formData.start_time}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Thời gian kết thúc:</label>
          <input
            name="end_time"
            type="datetime-local"
            value={formData.end_time}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
      </div>

      <button type="submit" className="btn btn-success" disabled={loading}>
        {loading ? "Đang cập nhật..." : "Lưu sự kiện"}
      </button>
    </form>
    </div>
  );
};

export default UpdateEvent;
