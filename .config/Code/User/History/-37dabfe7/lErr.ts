import { IListSessionPayment } from "../entities/sessionPayment";

export interface ISessionPaymentState {
    sessionPayments: Array
}
export interface ISessionPaymentController {
    paySessionPayment: (sessionPaymentId: string, paymentMethodId: string, currentCashId: string) => Promise<IListSessionPayment>;
}