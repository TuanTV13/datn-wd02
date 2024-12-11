import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import emailjs from "emailjs-com";

const UpdateEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Lấy id từ URL
  const [formData, setFormData] = useState({
    start_time: "",
    end_time: "",
    location: "",
    users: [],
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
          users: event.users,
        });
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

      for (const user of formData.users) {
        const templateParams = {
          from_name: "event",
          from_email: "doquang227@gmail.com",
          message:
            "Event bạn đang tham gia vừa cập nhật hãy truy cập lại web để theo giõi",
          to_email: user.email, // Nhập email của người nhận ở đây
        };
        await emailjs.send(
          "service_oc42a4h",
          "template_d3v1t5m",
          templateParams,
          "HcRPgJ1iOPe4OPPG1"
        );
      }
      toast.success("Cập nhật sự kiện thành công!");
      navigate("/admin/event-list");
    } catch (error) {
      console.error("Lỗi khi cập nhật sự kiện:", error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-3xl font-bold mb-4 text-center">Cập nhật sự kiện</h2>
      <hr />
      <br />
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border-r">
          <h3 className="text-xl font-semibold">Thông tin sự kiện</h3>
          <p>
            <strong>Địa điểm:</strong> {formData.location}
          </p>
          <p>
            <strong>Thời gian bắt đầu:</strong>{" "}
            {new Date(formData.start_time).toLocaleString()}
          </p>
          <p>
            <strong>Thời gian kết thúc:</strong>{" "}
            {new Date(formData.end_time).toLocaleString()}
          </p>
        </div>
        <div className="p-4">
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
            <div className="flex justify-between">
              <button
                type="submit"
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
      <ToastContainer />
    </div>
  );
};

export default UpdateEvent;
