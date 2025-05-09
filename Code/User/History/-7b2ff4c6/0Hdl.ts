import { IGlobalResponse } from "@/@core/interfaces/api";
import { IPaymentMethod } from "@/cashier/entities/paymentMethod";

export interface IPaymentMethodRepository {
  getPaymentMethods(
    page: number,
    page_size: number,
    search: string,
  ): Promise<IGlobalResponse<IPaymentMethod>>;
  createPaymentMethod(paymentMethod: any): Promise<IPaymentMethod>;
  updatePaymentMethod(id: string, paymentMethod: any): Promise<IPaymentMethod>;
  deletePaymentMethod(id: string): Promise<IPaymentMethod>;
  getPaymentMethodById(id: string): Promise<IPaymentMethod | undefined>;
}
