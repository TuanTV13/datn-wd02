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
import api from "../api_service/api";

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
      const data = await getAllTickets();
      setTickets(data);
    })();
  }, []);

  const onDel = async (id: number) => {
    if (confirm("Bạn có muốn xóa không?")) {
      try {
        await deleteTicket(id);
        setTickets(tickets.filter((item) => item.id !== id && id));
        toast.success("Xóa thành công");
        navigate("/admin/list-ticket-delete");
      } catch (error) {
        console.error("Error deleting ticket:", error);
        toast.error("Lỗi khi xóa vé");
      }
    }
  };

  // Thêm vé
  const validateTicketCreation = async (ticket: Tickets) => {
    const errors: string[] = [];
    if (!ticket.sale_end) {
      errors.push("Ngày kết thúc bán vé không hợp lệ.");
    }
    // Kiểm tra số lượng vé
    if (!ticket.quantity || ticket.quantity <= 0) {
      errors.push("Số lượng vé phải lớn hơn 0.");
    }
    // Kiểm tra loại vé
    if (!ticket.ticket_type) {
      errors.push("Loại vé không được để trống.");
    }
    // Kiểm tra sự kiện
    // try {
    //   const token = localStorage.getItem("access_token");
    //   const headers = {
    //     Authorization: `Bearer ${token}`,
    //     "Content-Type": "application/json",
    //   };
    //   const eventResponse = await api.get(`/events/${ticket.event_id}/show`,{headers});
    // } catch (error: any) {
    //   if (error.response && error.response.status === 404) {
    //     errors.push("Sự kiện không tồn tại.");
    //   } else {
    //     errors.push("Không thể kiểm tra sự kiện.");
    //   }
    // }

    // Kiểm tra ngày kết thúc bán vé hợp lệ
    if (ticket.sale_end) {
      try {
        const token = localStorage.getItem("access_token");
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };
        const eventResponse = await api.get(`/events/${ticket.event_id}/show`,{headers});
        const event = eventResponse.data;
        if (new Date(ticket.sale_end) > new Date(event.start_time)) {
          errors.push("Ngày kết thúc bán vé không thể sau ngày diễn ra sự kiện.");
        }
      } catch (error: any) {
        errors.push("Lỗi khi kiểm tra thời gian bán vé.");
      }
    }

    return errors;
  };

  const onAdd = async (ticket: Tickets) => {
    try {
      // Chỉ validate dữ liệu local
      const validationErrors = await validateTicketCreation(ticket);
      if (validationErrors.length > 0) {
        validationErrors.forEach((error) => toast.error(error));
        return;
      }

      // Gửi thẳng lên backend
      const newTicket = await addTicket(ticket);
      setTickets([...tickets, newTicket]);
      toast.success("Thêm thành công");
      navigate("/admin/ticket-list");
      window.location.reload();
    } catch (error) {
      console.log("Error adding ticket:", error);
      toast.error("Vé đã có vui lòng kiểm tra lại");
    }
  };

  // Cập nhật ve
  const onEdit = async (ticket: Tickets) => {
    try {
      const updatedTicket = await editTicket(ticket);
      setTickets(
        tickets.map((item) =>
          item.id === updatedTicket.id ? updatedTicket : item
        )
      );
      toast.success("Sửa thành công");
      navigate("/admin/ticket-list");
      window.location.reload();
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
      navigate("/admin/ticket-list");
      window.location.reload();
    } catch (error) {
      console.error("Error restoring ticket:", error);
      toast.error("Lỗi khi khôi phục vé");
    }
  };
  // Xác nhận vé
  const onVerify = async (id: number) => {
    try {
      const verifiedTicket = await verifyTicket(id);
      setTickets(
        tickets.map((item) => (item.id === id ? verifiedTicket : item))
      );
      toast.success("Xác nhận thành công");
    } catch (error) {
      console.error("Error verifying ticket:", error);
      toast.error("Lỗi khi xác nhận vé");
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
