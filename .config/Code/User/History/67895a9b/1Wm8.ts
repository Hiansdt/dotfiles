import { Api } from "@/@core/services/api";
import { inject, injectable } from "tsyringe";
import { IListSessionPayment } from "../entities/sessionPayment";
import { IGlobalResponse } from '@/@core/interfaces/api';

@injectable()
export class SessionPaymentRepository {
  constructor(@inject("ApiService") private api: Api) {}

  async paySessionPayment(
    sessionPaymentId: string,
    paymentMethodId: string,
    currentCashId: string,
  ): Promise<IListSessionPayment> {
    const { data } = await this.api.post<IListSessionPayment>(
      `session/session-payments/${sessionPaymentId}/pay/`,
      {
        payment_method: paymentMethodId,
        cashier: currentCashId,
      },
    );
    return data;
  }

  async getSessionPaymentsByCash(cashId: string): Promise<IGlobalResponse<IListSessionPayment>> {
    const { data } = await this.api.get<IGlobalResponse<IListSessionPayment>>(
      `session/session-payments/?cash=${cashId}`,
    );
    return data;
  }
}
