import { Tickets } from "../interfaces/Ticket";
import api from "./api";

// Lấy danh sách tất cả tickets
export const getAllTickets = async () => {
  try {
    const { data } = await api.get(`/tickets`);
    return data.data;
  } catch (error) {
    console.log(error);
  }
};

// Lấy danh sách tất cả sự kiện
export const getAllEvent = async () => {
  try {
    const { data } = await api.get(`/events`);
    return data.data;
  } catch (error) {
    console.log(error);
  }
};

// Lấy danh tickets id
export const getTicketsId = async (id: string) => {
  try {
    const { data } = await api.get(`/tickets/${id}`);
    return data.data;
  } catch (error) {
    console.log(error);
  }
};

// Thêm vé mới
export const addTicket = async (ticketData: Tickets) => {
  const token = localStorage.getItem("access_token");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  try {
    const { data } = await api.post(`/tickets/create`, ticketData, { headers });
    return data.data;
  } catch (error) {
    if (error.status === 401) {
      localStorage.clear();
      window.location = "/auth";
    }
    console.error("Error adding ticket:", error);
    console.log(error);
  }
};

// Cập nhật thông tin vé
export const editTicket = async (ticket: Tickets, seatId: number) => {
  const token = localStorage.getItem("access_token");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  try {
    const { data } = await api.put(
      `/tickets/${ticket.id}/update/${seatId}`,
      ticket,
      { headers }
    );
    console.log(data.data);
    return data.data;
  } catch (error) {
    if (error.status === 401) {
      localStorage.clear();
      window.location = "/auth";
    }
    console.error("Error editing ticket:", error);
    throw error;
  }
};

// Xóa vé
export const deleteTicket = async (id: number, seatId: number) => {
  const token = localStorage.getItem("access_token");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  try {
    const { data } = await api.delete(`/tickets/${id}/delete/${seatId}`, {
      headers,
    });
    console.log(data);
    return data.data;
  } catch (error) {
    if (error.status === 401) {
      localStorage.clear();
      window.location = "/auth";
    }
    console.error("Error deleting ticket:", error);
    console.log(error);
    throw error;
  }
};

// Khôi phục vé đã bị xóa
export const restoreTicket = async (id: number) => {
  const token = localStorage.getItem("access_token");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  try {
    const { data } = await api.post(`/tickets/${id}/restore`,{}, { headers });
    console.log(data)
    return data;
  } catch (error) {
    if (error.status === 401) {
      localStorage.clear();
      window.location = "/auth";
    }
    console.error("Error restoring ticket:", error);
    throw error;
  }
};

// Xác minh vé
export const verifyTicket = async (id: number) => {
  const token = localStorage.getItem("access_token");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  try {
    const { data } = await api.put(`/tickets/${id}/verified`, { headers });
    return data.data;
  } catch (error) {
    if (error.status === 401) {
      localStorage.clear();
      window.location = "/auth";
    }
    console.error("Error verifying ticket:", error);
    throw error;
  }
};

export const getTicketData = async (eventId: number, ticketType: string) => {
  const token = localStorage.getItem("access_token");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  try {
    const { data } = await api.get(`/tickets/${eventId}/${ticketType}`, {
      headers,
    });
    console.log(data);
    return data;
  } catch (error) {
    if (error.status === 401) {
      localStorage.clear();
      window.location = "/auth";
    }
    console.error("Error verifying ticket:", error);
    throw error;
  }
};
