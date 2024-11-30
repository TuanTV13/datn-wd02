import api from "./api";

export const PaymentHistoryService = async () => {
  // Kiểm tra xem người dùng đã đăng nhập hay chưa bằng cách kiểm tra access_token
  const token = localStorage.getItem("access_token");
  const id = localStorage.getItem("user_id");
  // Nếu thiếu token hoặc user_id, người dùng chưa đăng nhập
  if (!token || !id) {
    console.error("Người dùng chưa đăng nhập. Vui lòng đăng nhập trước.");
    throw new Error("Người dùng chưa đăng nhập");
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  try {
    // Gọi API để lấy lịch sử giao dịch
    const { data } = await api.get(`/clients/${id}/transaction-history`, { headers });
    console.log(data);
    return data.data; // Trả về phần data từ response
  } catch (error) {
    // Xử lý lỗi nếu có khi gọi API
    console.error("Lỗi lịch sử giao dịch", error);
    throw error;
  }
};
