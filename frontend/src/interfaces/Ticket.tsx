export interface Tickets {
    id?: number | string
    event_id: number
    status_id	: number
    ticket_type?: "VIP" | "Thường" | "Mời";
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
      };
    statuses?: {
      id: number
      name: string
      type: string
    }
}