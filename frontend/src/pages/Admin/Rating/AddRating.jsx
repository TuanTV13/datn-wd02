import React, { useState, useEffect } from "react";
import axiosInstance from "../../../axios";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

const AddRating = () => {
  const [formData, setFormData] = useState({});
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("http://localhost:8000/api/v1/events")
      .then((response) => {
        setEvents(response.data.data);
      })
      .catch((error) => {
        if (error?.response?.status === 401) navigate("/auth");
        console.error("Lỗi khi lấy danh sách sự kiện:", error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Cấu trúc dữ liệu body theo yêu cầu API
    const requestBody = {
      event_id: formData.event_id,
      user_id: localStorage.getItem("id"),
      rating: formData.rating,
      feedback: formData.feedback,
      suggestions: formData.suggestions,
    };

    // Gọi API để gửi đánh giá
    axiosInstance
      .post("feedbacks/submit", requestBody)
      .then((response) => {
        console.log("Gửi đánh giá thành công:", response.data);
        notification.success({ message: "Gửi đánh giá thành công:" });
        navigate("/admin/rating-list");
        // Reset form sau khi gửi thành công
        setFormData({
          event_id: "", // Reset lại event_id
          user_id: 6,
          rating: 3,
          feedback: "",
          suggestions: "",
        });
      })
      .catch((error) => {
        if (error?.response?.status === 401) navigate("/auth");
        console.error("Lỗi khi gửi đánh giá:", error);
        notification.error({ message: "Lỗi khi gửi đánh giá" });
      });
  };

  return (
    <div className="bg-white rounded-lg p-6 mx-auto shadow">
      <h2 className="text-2xl font-bold mb-4">Gửi đánh giá</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Chọn sự kiện</label>
          <select
            name="event_id"
            value={formData.event_id}
            onChange={handleChange}
            required
            className="border rounded w-full px-3 py-2"
          >
            <option value="">Chọn sự kiện</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Đánh giá (Sao)</label>
          <input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            min="1"
            max="5"
            required
            className="border rounded w-full px-3 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">đánh giá</label>
          <textarea
            name="feedback"
            value={formData.feedback}
            onChange={handleChange}
            rows="4"
            required
            className="border rounded w-full px-3 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Gợi ý</label>
          <textarea
            name="suggestions"
            value={formData.suggestions}
            onChange={handleChange}
            rows="4"
            required
            className="border rounded w-full px-3 py-2"
          />
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Gửi đánh giá
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRating;
