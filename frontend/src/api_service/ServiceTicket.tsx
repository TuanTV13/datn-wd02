
import { Tickets } from '../interfaces/Ticket';
import api from './api';

// Lấy danh sách tất cả tickets
export const getAllTickets = async () => {
    try {
        const {data} = await api.get(`/tickets`)
        return data.data
    } catch (error) {
        console.log(error)
    }
}
// Lấy danh tickets id
export const getTicketsId = async (id: string) => {
    try {
        const {data} = await api.get(`/tickets/${id}`)
        return data.data
    } catch (error) {
        console.log(error)
    }
}

// Thêm vé mới
export const addTicket = async (ticketData: Tickets) => {
    try {
        const {data} = await api.post(`/tickets/create`,ticketData)
        return data.data
    } catch (error) {
        console.error("Error adding ticket:", error);
        throw error;
    }
};

// Cập nhật thông tin vé
export const editTicket = async (ticketData: Tickets) => {
    try {
        const {data} = await api.put(`/tickets/${ticketData.id}/update`, ticketData);
        return data.data
    } catch (error) {
        console.error("Error editing ticket:", error);
        throw error;
    }
};

// Xóa vé
export const deleteTicket = async (id: number)=> {
    try {
        const {data} = await api.delete(`/tickets/${id}/delete`);
        return data.data
    } catch (error) {
        console.error("Error deleting ticket:", error);
        throw error;
    }
};

// Khôi phục vé đã bị xóa
export const restoreTicket = async (id: number)=> {
    try {
        const {data} = await api.post(`/tickets/${id}/restore`);
        return data.data
    } catch (error) {
        console.error("Error restoring ticket:", error);
        throw error;
    }
};

// Xác minh vé
export const verifyTicket = async (id: number)=> {
    try {
        const {data} = await api.put(`/tickets/${id}/verified`);
        return data.data
    } catch (error) {
        console.error("Error verifying ticket:", error);
        throw error;
    }
};
