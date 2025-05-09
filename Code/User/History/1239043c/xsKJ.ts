export interface IListSessionPayment {
    id: string;
    session: string;
    session_id: string;
    session_date: string;
    session_completed: boolean;
    session_canceled: boolean;
    service: string;
    price: string;
    paid: boolean;
    paid_at: string;
    created_at: string;
}