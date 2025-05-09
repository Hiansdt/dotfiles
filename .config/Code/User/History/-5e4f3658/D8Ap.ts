import { IHeader, IPagination } from "@/@core/interfaces/app";
import { IPaymentMethod } from "@/cashier/entities/paymentMethod";
import { ComputedRef } from "vue";

export interface IPaymentMethodState {
  loading: boolean;
  paymentMethods: IPaymentMethod[];
  pagination: IPagination;
  header: IHeader[];
  search: string;
}

export interface IPaymentMethodController {
  state: IPaymentMethodState;
  loading: ComputedRef<boolean>;
  paymentMethods: ComputedRef<IPaymentMethod[]>;
  pagination: ComputedRef<IPagination>;
  header: ComputedRef<IHeader[]>;
  search: ComputedRef<string>;
  getPaymentMethods(): Promise<void>;
  createPaymentMethod(paymentMethod: any): Promise<void>;
  updatePaymentMethod(id: string, paymentMethod: any): Promise<void>;
  deletePaymentMethod(id: string): Promise<void>;
  getPaymentMethodById(id: string): Promise<IPaymentMethod | undefined>;
  searchPaymentMethods(search: string): Promise<IPaymentMethod[]>;
}
