import { IListSessionPayment } from "@/sessions/entities/sessionPayment";

export interface IReportSessionPayment {
    total: number;
    count: number;
    payments: IListSessionPayment[];
    sessions?: any
    clients?: any
}