import api from './api';

// Lấy sự kiện ở phần header
export const getHeaderEvents = async () => {
    try {
        const { data } = await api.get('/clients/home/header-events');
        return data.data;
    } catch (error) {
        console.error("Error fetching header events:", error);
        throw error;
    }
};

// Lấy sự kiện sắp diễn ra
export const getUpcomingEvents = async (provinceSlug = '') => {
    try {
        const { data } = await api.get(`/clients/home/upcoming-events/${provinceSlug}`);
        return data.data;
    } catch (error) {
        console.error("Error fetching upcoming events:", error);
        throw error;
    }
};

// Lấy sự kiện nổi bật
export const getFeaturedEvents = async () => {
    try {
        const { data } = await api.get('/clients/home/featured-events');
        return data.data;
    } catch (error) {
        console.error("Error fetching featured events:", error);
        throw error;
    }
};

// Lấy sự kiện được đánh giá cao
export const getTopRatedEvents = async () => {
    try {
        const { data } = await api.get('/clients/home/top-rated-events');
        return data.data;
    } catch (error) {
        console.error("Error fetching top-rated events:", error);
        throw error;
    }
};
