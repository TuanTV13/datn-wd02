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
  
    // Kiểm tra ngày kết thúc bán vé
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
  
    return errors;
  };
  
  const onAdd = async (ticket: Tickets) => {
    try {
      // Kiểm tra vé đã tồn tại theo sự kiện
      const existingTicket = tickets.find((t) => t.event_id === ticket.event_id);
      if (existingTicket) {
        toast.error("Sự kiện này đã có vé, không thể thêm vé mới.");
        return;
      }
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
      console.error("Error adding ticket:", error);
      toast.error("Lỗi khi thêm vé");
    }
  };
  

  // Cập nhật ve
  const validateTicket = (ticket: Tickets) => {
    const errors: string[] = [];

    // Kiểm tra xem sự kiện có tồn tại hay không
    if (!ticket.event) {
      errors.push("Sự kiện không tồn tại.");
      return errors; // Không tiếp tục kiểm tra nếu không có sự kiện
    }

    // Kiểm tra nếu ngày bắt đầu sự kiện (start_time) tồn tại
    if (!ticket.event.start_time) {
      errors.push("Ngày bắt đầu sự kiện không tồn tại hoặc không hợp lệ.");
    } else {
      // Chuyển đổi ngày kết thúc bán vé và ngày bắt đầu sự kiện sang kiểu Date
      const saleEndDate = new Date(ticket.sale_end);
      const eventStartDate = new Date(ticket.event.start_time);

      // Kiểm tra nếu ngày kết thúc bán vé sau ngày bắt đầu sự kiện
      if (saleEndDate >= eventStartDate) {
        errors.push("Ngày kết thúc bán vé phải trước ngày bắt đầu sự kiện.");
      }
    }
    // Trả về danh sách lỗi (nếu có)
    return errors;
  };
  const onEdit = async (ticket: Tickets) => {
    try {
      // Kiểm tra lỗi logic
      // const validationErrors = validacd b  teTicket(ticket);
      // if (validationErrors.length > 0) {
      //   validationErrors.forEach((error) => toast.error(error));
      //   return; // Dừng tiếp tục nếu có lỗi
      // }
      const updatedTicket = await editTicket(ticket);
      setTickets(
        tickets.map((item) =>
          item.id === updatedTicket.id ? updatedTicket : item
        )
      );
      toast.success("Sửa thành công");
      navigate("/admin/ticket-list");
    } catch (error) {
      console.error("Error editing ticket:", error);
      toast.error("Lỗi khi sửa vé");
    }
  };

  const onRestore = async (id: number) => {
    if(confirm("Bạn có muốn khôi phục vé không?")){
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