import { ComputedRef } from "vue";
import { IListSessionPayment } from "../entities/sessionPayment";

export interface ISessionPaymentState {
    sessionPayments: IListSessionPayment[]
}
export interface ISessionPaymentController {
    sessionPayments: ComputedRef<IListSessionPayment[]>
    paySessionPayment: (sessionPaymentId: string, paymentMethodId: string, currentCashId: string) => Promise<IListSessionPayment>;
    getSessionPaymentsByCash: (cashId: string) => Promise<void>
}