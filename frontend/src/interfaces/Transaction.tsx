export interface Transaction  {
    id: number;
    event_name: string | null;
    total_amount: number;
    payment_method: string;
    status: string;
    created_at: string | null;
}