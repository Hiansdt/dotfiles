import { IListSessionPayment } from "../entities/sessionPayment";

export interface ISessionPaymentState {
    sessionPayments: IListSessionPayment
}
export interface ISessionPaymentController {
    paySessionPayment: (sessionPaymentId: string, paymentMethodId: string, currentCashId: string) => Promise<IListSessionPayment>;
}