export interface Tickets {
  id?: number | string;
  ticket_id: number | string;
  seat_zone_id: number | string;
  price: number ;
  quantity: number;
  sold_quantity: number;
  sale_start: string;
  sale_end: string;
  ticket: {
    id: number | string;
    status: StatusType;
    ticket_type: TicketType;
  };
  seat_zones: {
    id: number | string
    event_id: number | string;
    name: string;
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

export interface DeletedTicket {
  id: number | string;
  event_id: number | string;
  status: string;
  ticket_type: string;
}