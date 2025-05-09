import { inject, injectable } from "tsyringe";

import { IEmployeeRepository } from "../interfaces/employeeRepository";
import { IEmployee } from "../entities/employee";


import { Api } from "@/@core/services/api";
import { IGlobalResponse } from "@/@core/interfaces/api";


@injectable()
export class EmployeeRepository implements IEmployeeRepository {
  constructor(@inject("ApiService") private api: Api) {}

  async getEmployees(
    page: number,
    itemsPerPage: number,
    sort: string = ""
  ): Promise<IGlobalResponse<IEmployee>> {
    const { data } = await this.api.get<IGlobalResponse<IEmployee>>(
      `/employees/?page_size=${itemsPerPage}&page=${page}&sort=${sort}`
    );
    return data;
  }

  async searchEmployees(
    search: string,
  ): Promise<IGlobalResponse<IEmployee>> {
    const { data } = await this.api.get<IGlobalResponse<IEmployee>>(
      `/employees/?page_size=${20}&page=${1}&search=${search}`
    );
    return data;
  }

  async addEmployee(employee: IEmployee): Promise<IGlobalResponse<IEmployee>> {
    const { data } = await this.api.post<IGlobalResponse<IEmployee>>(
      "/employees/",
      employee
    );
    return data;
  }

  async updatePutEmployee(
    employee: IEmployee
  ): Promise<IGlobalResponse<IEmployee>> {
    const { data } = await this.api.patch<IGlobalResponse<IEmployee>>(
      `/employees/`,
      employee
    );
    return data;
  }

  async updateEmployee(
    employee: IEmployee
  ): Promise<IGlobalResponse<IEmployee>> {
    const { data } = await this.api.patch<IGlobalResponse<IEmployee>>(
      `/employees/${employee.id}/`,
      employee
    );
    return data;
  }

  async deleteEmployee(
    employeeId: string
  ): Promise<IGlobalResponse<IEmployee>> {
    const { data } = await this.api.delete<IGlobalResponse<IEmployee>>(
      `/employees/${employeeId}/`
    );
    return data;
  }

  async getEmployeeById(id: string): Promise<IEmployee> {
    const { data } = await this.api.get<IEmployee>(
      `/employees/${id}/`
    );
    return data;
  }


}
