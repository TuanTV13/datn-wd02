export interface Tickets {
    id?: number | string
    event_id: number
    status	:string
    ticket_type: TicketType;
    name:   string
    price: number
    quantity: number
    available_quantity: number
    seat_location: number
    sale_start: string
    sale_end: string
    description: string
    event?: {
        id: number
        name: string
      }
}
export enum TicketType {
  VIP = "VIP",
  Group = "Thường"
}