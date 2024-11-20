import api from "./api";

export const PaymentHistoryService = async (id: number)=> {
    const token = localStorage.getItem("access_token");
    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
    try {
        const {data} = await api.get(`/clients/${id}/transaction-history`,{headers});
        console.log(data)
        return data
    } catch (error) {
        console.error("Payment history err", error);
        throw error;
    }
  };