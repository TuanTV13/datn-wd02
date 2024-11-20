import api from "./api";

export const PaymentHistory = async (eventId: number, ticketType: string)=> {
    const token = localStorage.getItem("access_token");
    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
    try {
        const {data} = await api.get(`/tickets/${eventId}/${ticketType}`,{headers});
        console.log(data)
        return data
    } catch (error) {
        console.error("Error verifying ticket:", error);
        throw error;
    }
  };