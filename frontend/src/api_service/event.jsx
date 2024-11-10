import axios from 'axios';

// Base URL for your API
const API_URL = 'http://192.168.2.112:8000/api/v1'; // Replace with your actual API URL
export const getEvents = async () => {
   try {
     const response = await axios.get(`${API_URL}/events`);
     return response.data; // Xử lý dữ liệu trả về nếu cần
   } catch (error) {
     throw error.response.data; // Xử lý lỗi phù hợp
   }
 };
 export const deleteEvent = async (id) => {
   try {
     const response = await axios.delete(`${API_URL}/events/${id}`);
     return response.data;
   } catch (error) {
     throw new Error('Lỗi khi xóa sự kiện');
   }
 };
 const addEvent = async (eventData) => {
   // Lấy token từ localStorage (hoặc nơi bạn lưu token)
   const token = localStorage.getItem('token'); // Điều chỉnh theo cách bạn lưu token
 
   // Tạo headers với token
   const headers = {
       'Authorization': `Bearer ${token}`,
       'Content-Type': 'multipart/form-data', // Nếu bạn gửi FormData
   };
 
   try {
       const response = await axios.post(`${API_URL}/events/create`, eventData, { headers });
       return response.data;
   } catch (error) {
       throw error.response ? error.response.data : error.message;
   }
 };
 export { addEvent };


 export const getEvent = async (eventId) => {
   try {
     const response = await axios.get(`${BASE_URL}/events/${eventId}`);
     return response.data;
   } catch (error) {
     throw new Error('Lỗi khi lấy sự kiện: ' + error.message);
   }
 };
 
 // Các hàm khác
 export const updateEvent = async (eventId, formData) => {
   try {
     const response = await axios.put(`${BASE_URL}/events/${eventId}`, formData);
     return response.data;
   } catch (error) {
     throw new Error('Lỗi khi cập nhật sự kiện: ' + error.message);
   }
 };
