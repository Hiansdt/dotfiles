import { IHeader, IPagination } from "@/@core/interfaces/app";
import { ICash, IExtractService } from "@/cashier/entities/cashier";
import { ComputedRef } from "vue";

export interface ICashState {
  loading: boolean;
  cashes: ICash[];
  myCashes: ICash[];
  pagination: IPagination;
  headers: IHeader[];
  pendingHeaders: IHeader[];
  checkedHeaders: IHeader[];
  myCashesHeaders: IHeader[];
  myCashesPagination: IPagination;
  extractServicesPagination: IPagination;
  search: string;
  cashLogs: any[]
  cashLogsPagination: IPagination
}

export interface ICashController {
  state: ICashState;
  loading: ComputedRef<boolean>;
  cashes: ComputedRef<ICash[]>;
  myCashes: ComputedRef<ICash[]>;
  pagination: ComputedRef<IPagination>;
  myCashesPagination: ComputedRef<IPagination>;
  headers: ComputedRef<IHeader[]>;
  pendingHeaders: ComputedRef<IHeader[]>;
  checkedHeaders: ComputedRef<IHeader[]>;
  myCashesHeaders: ComputedRef<IHeader[]>;
  extractServicesPagination: ComputedRef<IPagination>;
  search: ComputedRef<string>;
  cashLogs: ComputedRef<any[]>
  cashLogsPagination: ComputedRef<IPagination>
  getCashesByStatus(status: string): Promise<void>;
  getMyCashes(): Promise<void>,
  getCashById(id: string): Promise<ICash>,
  closeCash(cashId: string): Promise<void>,
  approveCash(cashId: string): Promise<void>,
  rejectCash(cashId: string): Promise<void>,
  recheckCash(cashId: string): Promise<void>,
  concludeCash(cashId: string): Promise<void>,
  editCash(cashId: string, cashData: Partial<ICash>): Promise<void>
  getCashStatement(cashId: string): Promise<ICash>;
  getCashStatementServices(cashId: string): Promise<IExtractService[]>;
  openCash(): Promise<void>
  getCashesLogsManual(cashId: string, typeFilter: string): Promise<void>
  postCashLogManual(cashLogData: any, typeFilter: string): Promise<void>
}
