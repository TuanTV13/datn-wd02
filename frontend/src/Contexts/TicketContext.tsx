import React, { createContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Tickets } from "../interfaces/Ticket";
import {
  addTicket,
  deleteTicket,
  editTicket,
  getAllTickets,
  restoreTicket,
  verifyTicket,
} from "../api_service/ServiceTicket";

type Props = {
  children: React.ReactNode;
};

interface TypeTickets {
  onDel: (id: number) => void;
  onAdd: (data: Tickets) => void;
  onEdit: (data: Tickets) => void;
  onRestore: (id: number) => void;
  onVerify: (id: number) => void;
  tickets: Tickets[];
}

export const TicketsCT = createContext<TypeTickets>({} as TypeTickets);

const TicketsContext = ({ children }: Props) => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Tickets[]>([]);

  useEffect(() => {
    (async () => {
        const data = await getAllTickets()
        setTickets(data)
    })()
  }, []);

  const onDel = async (id: number) => {
    if (confirm("Bạn có muốn xóa không?")) {
      try {
        await deleteTicket(id);
        setTickets(tickets.filter((item) => item.id !== id && id));
        toast.success("Xóa thành công");
      } catch (error) {
        console.error("Error deleting ticket:", error);
        toast.error("Lỗi khi xóa vé");
      }
    }
  };

  const onAdd = async (ticket: Tickets) => {
    try {
      const newTicket = await addTicket(ticket);
      setTickets([...tickets, newTicket]);
      toast.success("Thêm thành công");
      navigate("/admin/ticket-list");
    } catch (error) {
      console.error("Error adding ticket:", error);
      toast.error("Lỗi khi thêm vé");
    }
  };

  const onEdit = async (ticket: Tickets) => {
    try {
      const updatedTicket = await editTicket(ticket);
      setTickets(
        tickets.map((item) => (item.id === updatedTicket.id ? updatedTicket : item))
      );
      toast.success("Sửa thành công");
      navigate("/admin/ticket-list");
    } catch (error) {
      console.error("Error editing ticket:", error);
      toast.error("Lỗi khi sửa vé");
    }
  };

  const onRestore = async (id: number) => {
    try {
      const restoredTicket = await restoreTicket(id);
      setTickets([...tickets, restoredTicket]);
      toast.success("Khôi phục thành công");
    } catch (error) {
      console.error("Error restoring ticket:", error);
      toast.error("Lỗi khi khôi phục vé");
    }
  };

  const onVerify = async (id: number) => {
    try {
      const verifiedTicket = await verifyTicket(id);
      setTickets(
        tickets.map((item) => (item.id === id ? verifiedTicket : item))
      );
      toast.success("Xác minh thành công");
    } catch (error) {
      console.error("Error verifying ticket:", error);
      toast.error("Lỗi khi xác minh vé");
    }
  };

  return (
    <TicketsCT.Provider
      value={{
        onDel,
        onAdd,
        onEdit,
        onRestore,
        onVerify,
        tickets,
      }}
    >
      {children}
      <ToastContainer />
    </TicketsCT.Provider>
  );
};

export default TicketsContext;
