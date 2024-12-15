import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import emailjs from "emailjs-com";

const UpdateEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    start_time: "",
    end_time: "",
    location: "",
    
    category_id: "", // Thêm trường category_id
  });

  const [dataaa, setDataaa] = useState({
    start_time: "",
    end_time: "",
    location: "",
    category_id: "", // Thêm trường category_id
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("access_token");
  const [showPopup, setShowPopup] = useState(false);

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  };
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/v1/categories", { headers })
      .then((response) => {
        setCategories(response.data.data); // Cập nhật danh sách danh mục
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách danh mục:", error);
        toast.error("Không thể tải danh mục.");
      });
  }, []);
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/v1/events/${id}/show`, { headers })
      .then((response) => {
        const event = response.data.data.event;
        setDataaa({
          start_time: event.start_time,
          end_time: event.end_time,
          location: event.location,
          category_id: event.category_id, // Thêm category_id
          
        });

        setFormData({
          start_time: event.start_time,
          end_time: event.end_time,
          location: event.location,
          category_id: event.category_id, // Thêm category_id
         
        });
      })
      .catch((error) => {
        console.error("Lỗi khi lấy sự kiện:", error);
        toast.error("Lỗi khi lấy sự kiện. Vui lòng thử lại!");
      });
  }, [id]);


  useEffect(() => {

    axios
      .get(`http://127.0.0.1:8000/api/v1/events/${id}/show`, { headers })
      .then((response) => {
        const event = response.data.data.event;
        setFormData({
          start_time: event.start_time,
          end_time: event.end_time,
          location: event.location,
         
        });

        console.log(response);
      })
      .catch((error) => {
        if (error.status === 401) {
          localStorage.clear();
          window.location = "/auth";
        }
        console.error("Lỗi khi lấy sự kiện:", error);
        toast.error("Lỗi khi lấy sự kiện. Vui lòng thử lại!");
      });

  }, [id]);


  const formatDate = (date) => {
    const newDate = new Date(date);
    // Điều chỉnh thành UTC
    const offset = newDate.getTimezoneOffset(); // Lấy chênh lệch phút so với UTC
    const utcDate = new Date(newDate.getTime() - offset * 60000); // Chuyển sang UTC
    return utcDate.toISOString().slice(0, 19); // Trả về dạng "YYYY-MM-DDTHH:mm:ss"
  };
  const handleSave = () => {
    setShowPopup(true);
  };

  const handleConfirmSave = (e) => {
    e.preventDefault(); // Ngừng hành động mặc định của form submit
    setShowPopup(false); // Đóng popup
    handleSubmit(e); // Truyền sự kiện vào handleSubmit
  };
  

  const handleCancelSave = () => {
    setShowPopup(false); // Đóng popup nếu hủy
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Nếu là category_id, tìm kiếm tên danh mục
    if (name === "category_id") {
      const selectedCategory = categories.find((category) => category.id === value);
      setFormData((prevData) => {
        return {
          ...prevData,
          [name]: value,
          category_name: selectedCategory ? selectedCategory.name : "", // Lưu tên danh mục
        };
      });
    } else {
      setFormData((prevData) => {
        return { ...prevData, [name]: value };
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    // Kiểm tra dữ liệu trước khi gửi
    console.log("Dữ liệu form sẽ được gửi:", formData);
  
    if (!formData.start_time || !formData.end_time || !formData.location || !formData.category_id) {
      setLoading(false);
      return toast.error("Vui lòng điền đầy đủ thông tin!");
    }
  
    const formattedData = {
      start_time: formatDate(formData.start_time),
      end_time: formatDate(formData.end_time),
      location: formData.location,
      category_id: formData.category_id, // Chỉ cần gửi category_id
    };
  
    try {
      const result = await axios.put(
        `http://127.0.0.1:8000/api/v1/events/${id}/update`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(formattedData);
      
      toast.success("Cập nhật sự kiện thành công!");
     
    } catch (error) {
      console.error("Lỗi khi cập nhật sự kiện:", error);
      toast.error(error.response ? error.response.data.message : "Lỗi khi cập nhật sự kiện!");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-3xl font-bold mb-4 text-center">Cập nhật sự kiện</h2>
    <hr />
    <br />
    <div className="grid grid-cols-10 gap-4">
      <div className="col-span-4 p-4 border-r">
        <h3 className="text-2xl font-semibold text-gray-800">Thông tin sự kiện</h3>
        <div className="mt-4 space-y-2">
          <p className="text-lg text-gray-700">
            <strong className="text-gray-900">Địa điểm:</strong> {dataaa.location}
          </p>
          <p className="text-lg text-gray-700">
            <strong className="text-gray-900">Thời gian bắt đầu:</strong> {new Date(dataaa.start_time).toLocaleString()}
          </p>
          <p className="text-lg text-gray-700">
            <strong className="text-gray-900">Thời gian kết thúc:</strong> {new Date(dataaa.end_time).toLocaleString()}
          </p>
        </div>
      </div>
      <div className="col-span-6 p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="form-group">
            <label className="form-label">Danh mục:</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">Chọn danh mục</option>
              {/* Dữ liệu danh mục giả sử đã được cung cấp */}
               {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))} 
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Thời gian bắt đầu:</label>
              <input
                name="start_time"
                type="datetime-local"
                value={formData.start_time}
                onChange={handleChange}
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
                className="form-control"
              />
            </div>
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleSave} // Hiển thị popup xác nhận
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              disabled={loading}
            >
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
    </div>

    {/* Popup xác nhận */}
    {showPopup && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Xác nhận</h2>
          <p className="mb-6">Bạn có chắc chắn muốn lưu sự kiện này?</p>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancelSave} // Đóng popup
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-all duration-300"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleConfirmSave} // Xác nhận lưu
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
            >
              Đồng ý
            </button>
          </div>
        </div>
      </div>
    )}

    <ToastContainer />
  </div>
  );
};

export default UpdateEvent;
