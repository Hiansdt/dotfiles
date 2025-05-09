import { Api } from "@/@core/services/api";
import { inject, injectable } from "tsyringe";
import { IListSessionPayment } from "../entities/sessionPayment";

@injectable()
export class SessionPaymentRepository {
    constructor(@inject("ApiService") private api: Api) {}

    async paySessionPayment(sessionPaymentId: string, paymentMethodId: string): Promise<IListSessionPayment> {
        const { data } = await this.api.post<IListSessionPayment>(`session/session-payments/${sessionPaymentId}/pay/`, {})
        return data
    }
}