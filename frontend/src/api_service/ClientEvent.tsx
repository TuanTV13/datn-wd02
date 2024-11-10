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
