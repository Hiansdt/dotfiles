import { computed, reactive } from "vue";
import { defineStore } from "pinia";
import { container } from "tsyringe";

import { IEmployee } from "../entities/employee";
import { IEmployeeState, IEmployeeController } from "../interfaces/employee";
import { EmployeeRepository } from "../repository/employeeRepository";

import { useRouter } from "vue-router";
import { showMessage } from "@/@core/helpers";
import { defaultPagination } from "@/@core/helpers/defaultItems";


export const useEmployeeController = defineStore<"employees", IEmployeeController>(
  "employees",
  () => {
    const state = reactive<IEmployeeState>({
      employees: [],
      currentEmployee: null,
      pagination: {
        ...defaultPagination,
      },
      headers: [
        {
          id: 0,
          title: "Nome",
          value: "name",
          sequence: 0,
          sortable: true,
          isVisible: true,
        },
        {
          id: 1,
          title: "Email",
          value: "email",
          sequence: 1,
          sortable: true,
          isVisible: true,
        },
        {
          id: 2,
          title: "CPF",
          value: "cpf",
          sequence: 2,
          sortable: true,
          isVisible: true,
        },
        {
          id: 3,
          title: "Ações",
          value: "actions",
          sequence: 3,
          sortable: false,
          isVisible: true,
        }
      ],
      loading: false,
      search: "",
      sort: "",
    });

    const employeeRepository = container.resolve(EmployeeRepository);
    const currentEmployee = computed(() => state.currentEmployee);
    const employees = computed(() => state.employees);
    const pagination = computed({
      get: () => state.pagination,
      set: (value) => {
        state.pagination = value;
      },
    })
    const headers = computed({
      get: () => state.headers,
      set: (value) => {
        state.headers = value;
      },
    })
    const loading = computed(() => state.loading);
    const search = computed({
      get: () => state.search,
      set: (value) => {
        state.search = value;
      },
    })
    const sort = computed(() => state.sort);

    const router = useRouter()

    const getEmployees = async () => {
      state.loading = true;

      try {
        const data = await employeeRepository.getEmployees(state.pagination.page, state.pagination.pageSize, '');
        state.employees = data.results;
        state.pagination = {
          ...state.pagination,
          total: data.total,
          numPages: data.num_pages,
          pageSize: data.page_size,
          page: data.page_number,
        }
      } catch (error) {
        console.log(error)
      } finally {
        state.loading = false;
      }

    };

    const searchEmployees = async (search: string) => {
      const data = await employeeRepository.searchEmployees(
        search,
      );
      return data.results
    };

    const addEmployee = async (employee: IEmployee) => {
      state.loading = true;
      console.log(employee);
      await employeeRepository.addEmployee(employee);
      await getEmployees();
      state.loading = false;
    };

    const updateEmployee = async (employee: IEmployee) => {
      state.loading = true;
      try {
        console.log(employee);
        await employeeRepository.updateEmployee(employee);
        await getEmployees();
        showMessage('Funcionario atualizado com sucesso!', 'success');
      } catch (error) {
        showMessage('Ocorreu um erro ao atualizar o funcionario', 'error');
        console.error(error);
      } finally {
        state.loading = false;
      }
    };

    const updateUserEmployee = async (employee: IEmployee) => {
      state.loading = true;
      try {
        await employeeRepository.updatePutEmployee(employee);
      } catch (error) {
        console.error(error);
      } finally {
        // user.updateUserState(employee);
      }
    };

    const getEmployeeById = async (id: string) => {
      const data = await employeeRepository.getEmployeeById(id);
      state.currentEmployee = data;
    };

    const deleteEmployee = async (employeeId: string) => {
      state.loading = true;
      try {
        await employeeRepository.deleteEmployee(employeeId);
        await getEmployees();
      } catch (error) {
        console.error(error);
      } finally {
        router.push("/employees");
        state.loading = false;
      }
    };


    return {
      state,
      employees,
      currentEmployee,
      loading,
      pagination,
      headers,
      search,
      sort,
      getEmployees,
      updateUserEmployee,
      searchEmployees,
      addEmployee,
      updateEmployee,
      getEmployeeById,
      deleteEmployee,
    };
  }
);
