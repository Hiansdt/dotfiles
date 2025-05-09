import { inject, injectable } from "tsyringe";
import { Api } from "@/@core/services/api";

@injectable()
export class CashRepository {

  constructor(@inject('ApiService') private api: Api) {}

  async getCashes(page: number, pageSize: number) {
    const { data } = await this.api.get(`cashier/cashiers/?&page_number=${page}&page_size=${pageSize}`)
    return data
  }

  async getCashById(id: string) {
    const { data } = await this.api.get(`cashier/cashiers/${id}`)
    return data
  }

  async getCashesByStatus(status: string, page: number, page_size: number) {
    const { data } = await this.api.get(`cashier/cashiers/?status=${status}&page=${page}&page_size=${page_size}`)
    return data
  }

  async closeCash(cashId: string) {
    const { data } = await this.api.post(`cashier/cashiers/${cashId}/close/`, {})
    return data
  }

  async approveCash(cashId: string, employeeId: string) {
    const { data } = await this.api.post(`cashier/cashiers/${cashId}/approve/`, { employee: employeeId })
    return data
  }

  async rejectCash(cashId: string, employeeId: string) {
    const { data } = await this.api.post(`cashier/cashiers/${cashId}/reject/`, { employee: employeeId })
    return data
  }

  async recheckCash(cashId: string) {
    const { data } = await this.api.post(`cashier/cashiers/${cashId}/recheck/`, {})
    return data
  }

  async concludeCash(cashId: string) {
    const { data } = await this.api.post(`cashier/cashiers/${cashId}/conclude/`, {})
    return data
  }

  async editCash(cashId: string, cashData: any) {
    const { data } = await this.api.patch(`cashier/cashiers/${cashId}/`, cashData)
    return data
  }

  async getCashStatement(cashId: string) {
    const { data } = await this.api.get(`cashier/cashiers/${cashId}/get-statement/`)
    return data
  }

  async getCashStatementServices(cashId: string, page: number, pageSize: number) {
    const { data } = await this.api.get(`cashier/cashiers/${cashId}/get-statement-services/?page=${page}&page_size=${pageSize}`)
    return data
  }

  async openCash() {
    const { data } = await this.api.post("cashier/cashiers/open/", {})
    return data
  }

  async getCashesLogsManual(cashId: string, page: number, page_size: number, typeFilter: string) {
    const { data } = await this.api.get(`cashier/cashier-logs/?cashier=${cashId}&manual=true&cashier_log_type=${typeFilter}&page=${page}&page_size=${page_size}`)
    return data
  }

  async postCashLogManual(cashLogData: any) {
    const { data } = await this.api.post(`cashier/cashier-logs/`, cashLogData)
    return data
  }
}
