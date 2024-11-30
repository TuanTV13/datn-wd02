import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json", // Nếu bạn yêu cầu dữ liệu JSON
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
