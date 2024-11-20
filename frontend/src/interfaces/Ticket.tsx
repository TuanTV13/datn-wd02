export interface Tickets {
  id?: number | string;
  event_id: number;
  status: StatusType;
  ticket_type: TicketType;
  name: string;
  price: number;
  quantity: number;
  available_quantity: number;
  seat_location: number;
  sale_start: string;
  sale_end: string;
  description: string;
  event?: {
    id: number;
    name: string;
  start_time: string;
  };
}
export enum TicketType {
  VIP = "VIP",
  Group = "Thường",
}
export enum StatusType {
  Pending = "pending",
  Confirmed = "confirmed",
}
