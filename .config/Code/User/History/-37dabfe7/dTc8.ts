import { IListSessionPayment } from "../entities/sessionPayment";

export interface ISessionPaymentController {
    paySessionPayment: (sessionPaymentId: string, paymentMethodId: string, currentCashId: string) => Promise<IListSessionPayment>;
}