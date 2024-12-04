import axios from "axios";
import API_URL from "./api_url"

export const getEvents = async () => {
  try {
    const response = await axios.get(`${API_URL}/events`);
    return response.data; // Xử lý dữ liệu trả về nếu cần
  } catch (error) {
    throw error.response.data; // Xử lý lỗi phù hợp
  }
};
export const deleteEvent = async (id) => {
  const token = localStorage.getItem("access_token"); // Kiểm tra nếu token có tồn tại

  if (!token) {
    throw new Error("Token không tìm thấy");
  }

  // Tạo headers với token
  const headers = {
    Authorization: `Bearer ${token}`,
    // Chỉ thêm Content-Type nếu cần thiết
  };

  try {
    // Gọi axios.delete với URL đúng cách
    const response = await axios.delete(`${API_URL}/events/${id}/delete`, {
      headers
    });
    return response.data;
  } catch (error) {
    // Xử lý lỗi trả về chi tiết từ backend nếu có
    throw error.response ? error.response.data : error.message;
  }
};

const addEvent = async (eventData) => {
  // Lấy token từ localStorage (hoặc nơi bạn lưu token)
  const token = localStorage.getItem("access_token"); // Điều chỉnh theo cách bạn lưu token

  // Tạo headers với token
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data", // Nếu bạn gửi FormData
  };

  try {
    const response = await axios.post(`${API_URL}/events/create`, eventData, {
      headers,
    });
    return response.data.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
export { addEvent };
export const updateEvent = async (id, eventData) => {
  // Lấy token từ localStorage (hoặc nơi bạn lưu token)
  const token = localStorage.getItem("access_token"); // Điều chỉnh theo cách bạn lưu token

  // Tạo headers với token
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data", // Nếu bạn gửi FormData
  };

  try {
    const response = await axios.put(
      `${API_URL}/events/${id}/update`, // Đường dẫn API
      eventData, // Dữ liệu gửi
      { headers } // Headers
    );
    return response.data; // Trả về dữ liệu phản hồi
  } catch (error) {
    // Xử lý lỗi
    throw error.response ? error.response.data : new Error("Lỗi khi cập nhật sự kiện");
  }
};


 export const getEvent = async (id) => {
   try {
     const response = await axios.get(`${BASE_URL}/events/${id}`);
     return response.data;
   } catch (error) {
     throw new Error('Lỗi khi lấy sự kiện: ' + error.message);
   }
 };
 

 export const fetchCategories = async () => {
  try {
      const response = await axios.get(`${API_URL}/categories`);
      return response.data; // Trả về dữ liệu danh mục
  } catch (error) {
      console.error('Error fetching categories:', error);
      throw error; // Ném lỗi để xử lý ở nơi sử dụng
  }
};

