export interface Vouchers {
    id: number;
    creator_id: number;
    event_id: number;
    status: string;
    code: string;
    description: string | null;
    discount_type: "fixed" | "percentage";
    discount_value: number;
    min_order_value: number;
    max_order_value: number;
    issue_quantity: number;
    start_time: string;
    end_time: string;
    used_limit: number;
  }