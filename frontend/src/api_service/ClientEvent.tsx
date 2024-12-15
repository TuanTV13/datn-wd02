import axios from "axios";
import api from "./api";

export const getAllEvents = async () => {
  try {
    const { data } = await api.get("/clients/events/");
    return data.data;
  } catch (error) {
    console.error("Error fetching all events:", error);
    throw error;
  }
};

export const getEventById = async (id: number) => {
  try {
    const { data } = await api.get(`/clients/events/${id}`);
    return data.data;
  } catch (error) {
    console.error(`Error fetching event with ID ${id}:`, error);
    throw error;
  }
};

// Lấy sự kiện theo danh mục
export const getEventsByCategory = async (id: number | string) => {
  try {
    const { data } = await api.get(`/clients/events/category/${id}`);
    return data.data;
  } catch (error) {
    console.error("Error fetching events by category:", error);
    throw error;
  }
};

export const getAllCategory = async () => {
  try {
    const { data } = await api.get(`/categories`);
    return data.data;
  } catch (error) {
    console.log(error);
  }
};

export const GetAllProvinces = async () => {
  try {
    const { data } = await axios.get(
      `https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1`
    );
    return data.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách các tỉnh:", error);
    throw new Error("Không thể tải danh sách tỉnh/thành phố");
  }
};
export const fetchEventsByProvince = async (province: string) => {
  try {
    console.log(province);
    const { data } = await api.post("/clients/events/filter", {
      location: province,
    });
    console.log(data);
    return data.data.data;
  } catch (error) {
    if (error) console.error("Error fetching events by province:");
    throw error;
  }
};
