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

export const checkInEvent = async (eventId) => {
  try {
    const { data } = await api.put(`/clients/events/${eventId}/checkin`);
    return data.data;
  } catch (error) {
    console.error(`Error checking in for event ID ${eventId}:`, error);
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
      const {data} = await api.get(`/categories`)
      return data.data
  } catch (error) {
      console.log(error)
  }
}