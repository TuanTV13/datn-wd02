import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const UpdateEvent = () => {
  const navigate = useNavigate();
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
      .get(`http://127.0.0.1:8000/api/v1/events/${id}/show`, { headers })
      .then((response) => {
        const event = response.data.data.event;
  
        setFormData({
          start_time: event.start_time,
          end_time: event.end_time,
          location: event.location,
          name: event.name,
          province: event.province, // Giả sử dữ liệu trả về có trường này
          district: event.district, // Giả sử dữ liệu trả về có trường này
          ward:event.ward
        });
  
        console.log(response);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy sự kiện:", error);
        toast.error("Lỗi khi lấy sự kiện. Vui lòng thử lại!");
      });

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
       `http://127.0.0.1:8000/api/v1/events/${id}/update`,
       formattedData, // Gửi dữ liệu dạng JSON
       { 
         headers: {
           Authorization: `Bearer ${token}`,
           "Content-Type": "application/json", // Đặt Content-Type cho JSON
         },
       }
     );
     console.log("Cập nhật thành công:", result);
     toast.success("Cập nhật sự kiện thành công!");
   } catch (error) {
     console.error("Lỗi khi cập nhật sự kiện:", error);
     toast.error(error.response.data.message);
   } finally {
     setLoading(false);
   }
 };
 
  return (
  <div className="bg-white rounded-lg shadow-lg p-6 flex space-x-8 border border-gray-200">
  {/* Form hiển thị thông tin sự kiện */}
  <div className="w-1/2 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-md">
    <form className="space-y-4">
      <h2 className="text-3xl font-bold mb-4 text-center text-blue-800">Thông tin sự kiện</h2>
      <hr className="border-gray-300" />
      <br />

      <div className="form-group">
        <label className="form-label text-gray-700">Tên sự kiện:</label>
        <p className="text-gray-800 font-semibold">{formData.name}</p>
      </div>

      <div className="form-group">
        <label className="form-label text-gray-700">Tỉnh:</label>
        <p className="text-gray-800 font-semibold">{formData.province}</p>
      </div>

      <div className="form-group">
        <label className="form-label text-gray-700">Huyện:</label>
        <p className="text-gray-800 font-semibold">{formData.district}</p>
      </div>
    </form>
  </div>

  {/* Form cập nhật thời gian */}
  <div className="w-1/2 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg shadow-md">
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-3xl font-bold mb-4 text-center text-green-800">Cập nhật thời gian sự kiện</h2>
      <hr className="border-gray-300" />
      <br />

      <div className="grid grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label text-gray-700">Địa điểm:</label>
          <input
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            className="form-control px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
        </div>
        <div className="form-group">
          <label className="form-label text-gray-700">Xã:</label>
          <input
            name="location"
            type="text"
            value={formData.ward}
            onChange={handleChange}
            className="form-control px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label text-gray-700">Thời gian bắt đầu:</label>
          <input
            name="start_time"
            type="datetime-local"
            value={formData.start_time}
            onChange={handleChange}
            required
            className="form-control px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
        </div>
        <div className="form-group">
          <label className="form-label text-gray-700">Thời gian kết thúc:</label>
          <input
            name="end_time"
            type="datetime-local"
            value={formData.end_time}
            onChange={handleChange}
            required
            className="form-control px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <button type="submit" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" disabled={loading}>
          {loading ? "Đang cập nhật..." : "Lưu sự kiện"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/admin/event-list")}
          className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300"
        >
          Quay lại danh sách
        </button>
      </div>
    </form>
  </div>

  <ToastContainer />
</div>

  
  
  );
};

export default UpdateEvent;
