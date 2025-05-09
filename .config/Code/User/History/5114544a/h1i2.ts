import { IGlobalResponse } from "@/@core/interfaces/api";
import { Api } from "@/@core/services/api";
import { inject, injectable } from "tsyringe";
import { IPaymentMethod } from "../entities/paymentMethod";
import { IPaymentMethodRepository } from "../interfaces/paymentMethodRepository";

@injectable()
export class PaymentMethodRepository implements IPaymentMethodRepository {
  constructor(@inject("ApiService") private api: Api) {}

  async getPaymentMethods(
    page: number,
    page_size: number,
    search: string,
  ): Promise<IGlobalResponse<IPaymentMethod>> {
    const { data } = await this.api.get<IGlobalResponse<IPaymentMethod>>(
      `/cashier/payment-methods/?page=${page}&page_size=${page_size}&search=${search}`,
    );
    return data;
  }

  async createPaymentMethod(paymentMethod: any): Promise<IPaymentMethod> {
    const { data } = await this.api.post<IPaymentMethod>(
      "/cashier/payment-methods/",
      paymentMethod,
    );
    return data;
  }

  async updatePaymentMethod(
    id: string,
    paymentMethod: any,
  ): Promise<IPaymentMethod> {
    const { data } = await this.api.patch<IPaymentMethod>(
      `/cashier/payment-methods/${id}/`,
      paymentMethod,
    );
    return data;
  }

  async deletePaymentMethod(id: string): Promise<IPaymentMethod> {
    const { data } = await this.api.delete<IPaymentMethod>(
      `/cashier/payment-methods/${id}/`,
    );
    return data;
  }

  async getPaymentMethodById(id: string): Promise<IPaymentMethod> {
    const { data } = await this.api.get<IPaymentMethod>(
      `/cashier/payment-methods/${id}/`,
    );
    return data;
  }

  async searchPaymentMethods(search: string, isContract: boolean): Promise<IGlobalResponse<IPaymentMethod>> {
    const { data } = await this.api.get<IGlobalResponse<IPaymentMethod>>(
      `/cashier/payment-methods/?search=${search}&is_contract=${isContract}`,
    );
    // &is_contract=${isContract}
    return data;
  }
}
