import { defineStore } from "pinia";
import { computed, reactive } from "vue";
import { IHeader, IPagination } from "@/@core/interfaces/app";
import {
  ICashController,
  ICashState,
} from "../interfaces/cashController";
import { container } from "tsyringe";
import { CashRepository } from "../repository/cashRepository";
import { listCashesHeaders, listCheckedCashesHeaders, listMyCashesHeaders, listPendingCashesHeaders } from "../helpers/cashHeaders";
import { useAuthController } from "@/auth/controller/authController";
import { IGlobalResponse } from "@/@core/interfaces/api";

export const useCashController = defineStore<"cash", ICashController>(
  "cash",
  () => {
    const state = reactive<ICashState>({
      loading: false,
      cashes: [],
      myCashes: [],
      pagination: {
        page: 1,
        page_size: 10,
        total: 0,
        num_pages: 0,
        sortBy: [""],
        sortDesc: [false],
      },
      headers: [
        ...listCashesHeaders
      ],
      pendingHeaders: [
        ...listPendingCashesHeaders
      ],
      checkedHeaders: [
        ...listCheckedCashesHeaders
      ],
      myCashesHeaders: [
        ...listMyCashesHeaders
      ],
      myCashesPagination: {
        page: 1,
        page_size: 10,
        total: 0,
        num_pages: 0,
        sortBy: [""],
        sortDesc: [false],
      },
      extractServicesPagination: {
        page: 1,
        page_size: 10,
        total: 0,
        num_pages: 0,
        sortBy: [""],
        sortDesc: [false],
      },
      search: "",
      cashLogs: [],
      cashLogsPagination: {
        page: 1,
        page_size: 10,
        total: 0,
        num_pages: 0,
        sortBy: [""],
        sortDesc: [false],
      }
    });

    const cashRepository = container.resolve(CashRepository);
    const authController = useAuthController()
    const loading = computed(() => state.loading);
    const cashes = computed(() => state.cashes);
    const myCashes = computed(() => state.myCashes)
    const pagination = computed({
      get: () => state.pagination,
      set: (value: IPagination) => (state.pagination = value),
    });
    const myCashesPagination = computed({
      get: () => state.myCashesPagination,
      set: (value: IPagination) => (state.myCashesPagination = value),
    });
    const extractServicesPagination = computed({
      get: () => state.extractServicesPagination,
      set: (value: IPagination) => (state.extractServicesPagination = value),
    });
    const cashLogsPagination = computed({
      get: () => state.cashLogsPagination,
      set: (value: IPagination) => (state.cashLogsPagination = value),
    });
    const headers = computed({
      get: () => {
        const paymentMethods = [...new Set(state.cashes.map((cash) => cash.payment_methods).map((item) => item.map((payment) => payment.method)).flat())];
        const paymentHeaders = paymentMethods.map((method, index) => {
          return {
            id: 3 + index,
            title: method,
            value: method,
            sequence: 2 + index,
            isVisible: true,
            sortable: true,
          }
        })
        const headers = [...state.headers, ...paymentHeaders];
        return headers.sort((a, b) => a.sequence - b.sequence)
      },
      set: (value: IHeader[]) => (state.headers = value),
    });
    const pendingHeaders = computed({
      get: () => {
        const paymentMethods = [...new Set(state.cashes.map((cash) => cash.payment_methods).map((item) => item.map((payment) => payment.method)).flat())];
        const paymentHeaders = paymentMethods.map((method, index) => {
          return {
            id: 3 + index,
            title: method,
            value: method,
            sequence: 2 + index,
            isVisible: true,
            sortable: true,
          }
        })
        const pendingHeaders = [...state.pendingHeaders, ...paymentHeaders];
        return pendingHeaders.sort((a, b) => a.sequence - b.sequence)
      },
      set: (value: IHeader[]) => (state.pendingHeaders = value),
    });
    const search = computed({
      get: () => state.search,
      set: (value) => (state.search = value),
    });
    const checkedHeaders = computed({
      get: () => {
        const paymentMethods = [...new Set(state.cashes.map((cash) => cash.payment_methods).map((item) => item.map((payment) => payment.method)).flat())];
        const paymentHeaders = paymentMethods.map((method, index) => {
          return {
            id: 5 + index,
            title: method,
            value: method,
            sequence: 4 + index,
            isVisible: true,
            sortable: true,
          }
        })
        const headers = [...state.checkedHeaders, ...paymentHeaders];
        return headers.sort((a, b) => a.sequence - b.sequence)
      },
      set: (value: IHeader[]) => (state.checkedHeaders = value),
    });
    const myCashesHeaders = computed({
      get: () => state.myCashesHeaders.sort((a, b) => a.sequence - b.sequence),
      set: (value) => (state.myCashesHeaders = value),
    });
    const cashLogs = computed(() => state.cashLogs)

    const getCashesByStatus = async (status: string) => {
      state.loading = true;
      const parking_id = authController.currentParking?.id
      const data = await cashRepository.getCashesByStatus(
        status,
        state.pagination.page,
        state.pagination.page_size,
        parking_id
      );
      state.cashes = data.results;
      state.pagination = {
        ...state.pagination,
        page: data.page_number,
        page_size: data.page_size,
        total: data.total,
        num_pages: data.num_pages,
      };
      state.loading = false;
    }

    const getMyCashes = async () => {
      state.loading = true
      const employee_id = authController.currentEmployeeId
      const parking_id = authController.currentParking?.id
      const data = await cashRepository.getCashes(employee_id, parking_id, state.myCashesPagination.page, state.myCashesPagination.page_size)
      state.myCashesPagination = {
        ...state.myCashesPagination,
        page: data.page_number,
        num_pages: data.num_pages,
        page_size: data.page_size,
        total: data.total
      }
      state.myCashes = data.results
      state.loading = false
    }

    const getCashById = async (id: string) => {
      state.loading = true
      const data = await cashRepository.getCashById(id)
      state.loading = false
      return data
    }

    const closeCash = async (cashId: string) => {
      state.loading = true
      await cashRepository.closeCash(cashId)
      state.loading = false
    }

    const approveCash = async (cashId: string) => {
      state.loading = true
      const employeeId = authController.currentEmployeeId
      await cashRepository.approveCash(cashId, employeeId)
      state.loading = false
    }

    const rejectCash = async (cashId: string) => {
      state.loading = true
      const employeeId = authController.currentEmployeeId
      await cashRepository.rejectCash(cashId, employeeId)
      state.loading = false
    }

    const recheckCash = async (cashId: string) => {
      state.loading = true
      await cashRepository.recheckCash(cashId)
      state.loading = false
    }

    const concludeCash = async (cashId: string) => {
      state.loading = true
      await cashRepository.concludeCash(cashId)
      state.loading = false
    }

    const editCash = async (cashId: string, cashData: any) => {
      state.loading = true
      await cashRepository.editCash(cashId, cashData)
      state.loading = false
    }

    const getCashStatement = async (cashId: string) => {
      state.loading = true
      const data = await cashRepository.getCashStatement(cashId)
      state.loading = false
      return data
    }

    const getCashStatementServices = async (cashId: string) => {
      state.loading = true
      const data: IGlobalResponse<IExtractService> = await cashRepository.getCashStatementServices(cashId, state.extractServicesPagination.page, state.extractServicesPagination.page_size)
      state.extractServicesPagination = {
        ...state.extractServicesPagination,
        page: data.page_number,
        num_pages: data.num_pages,
        page_size: data.page_size,
        total: data.total
      }
      state.loading = false
      return data.results
    }

    const openCash = async () => {
      const parkingId = authController.currentParking?.id
      const employeeId = authController.currentEmployeeId

      await cashRepository.openCash(parkingId, employeeId)
      await getMyCashes()
    }

    const getCashesLogsManual = async (cashId: string, typeFilter: string) => {
      state.loading = true
      const data = await cashRepository.getCashesLogsManual(cashId, state.cashLogsPagination.page, state.cashLogsPagination.page_size, typeFilter)
      state.cashLogsPagination = {
        ...state.cashLogsPagination,
        page: data.page_number,
        num_pages: data.num_pages,
        page_size: data.page_size,
        total: data.total
      }
      state.cashLogs = data.results
      state.loading = false
    }

    const postCashLogManual = async (cashLogData: any, typeFilter: string) => {
      const data = await cashRepository.postCashLogManual(cashLogData)
      await getCashesLogsManual(data.cash, typeFilter)
    }

    return {
      state,
      loading,
      cashes,
      myCashes,
      pagination,
      headers,
      search,
      checkedHeaders,
      myCashesPagination,
      extractServicesPagination,
      myCashesHeaders,
      cashLogs,
      cashLogsPagination,
      pendingHeaders,
      getCashesByStatus,
      getMyCashes,
      getCashById,
      closeCash,
      approveCash,
      rejectCash,
      recheckCash,
      concludeCash,
      editCash,
      getCashStatement,
      getCashStatementServices,
      openCash,
      getCashesLogsManual,
      postCashLogManual
    };
  },
);
