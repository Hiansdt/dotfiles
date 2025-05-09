import { defineStore } from "pinia";
import {
  IPaymentMethodController,
  IPaymentMethodState,
} from "../interfaces/paymentMethod/paymentMethodController";
import { computed, reactive } from "vue";
import { IHeader, IPagination } from "@/@core/interfaces/app";
import { container } from "tsyringe";
import { PaymentMethodRepository } from "../repository/paymentMethodRepository";
import { IPaymentMethod } from "../entities/paymentMethod";

export const usePaymentMethodController = defineStore<
  "paymentMethod",
  IPaymentMethodController
>("paymentMethod", () => {
  const state = reactive<IPaymentMethodState>({
    loading: false,
    paymentMethods: [],
    pagination: {
      page: 1,
      page_size: 10,
      total: 0,
      num_pages: 0,
      sortBy: [""],
      sortDesc: [false],
    },
    header: [
      {
        id: 1,
        title: "Descrição",
        value: "description",
        sequence: 0,
        isVisible: true,
        sortable: true,
      },
      {
        id: 2,
        title: "Contrato",
        value: "is_contract",
        sequence: 1,
        isVisible: true,
        sortable: true,
      },
      {
        id: 3,
        title: "Ações",
        value: "actions",
        sequence: 5,
        isVisible: true,
        sortable: true,
      },
    ],
    search: "",
  });

  const paymentMethodRepository = container.resolve(PaymentMethodRepository);

  const loading = computed(() => state.loading);
  const paymentMethods = computed(() => state.paymentMethods);
  const pagination = computed({
    get: () => state.pagination,
    set: (value: IPagination) => (state.pagination = value),
  });
  const header = computed({
    get: () => state.header.sort((a, b) => a.sequence - b.sequence),
    set: (value: IHeader[]) => (state.header = value),
  });
  const search = computed({
    get: () => state.search,
    set: (value) => (state.search = value),
  });

  const getPaymentMethods = async () => {
    try {
      state.loading = true;
      const data = await paymentMethodRepository.getPaymentMethods(
        state.pagination.page,
        state.pagination.page_size,
        state.search,
      );
      state.pagination = {
        ...state.pagination,
        page: data.page_number,
        page_size: data.page_size,
        total: data.total,
        num_pages: data.num_pages,
      };
      state.paymentMethods = data.results;
    } catch (error) {
      console.error(error);
    } finally {
      state.loading = false;
    }
  };

  const createPaymentMethod = async (paymentMethod: any) => {
    try {
      state.loading = true;
      await paymentMethodRepository.createPaymentMethod(paymentMethod);
      await getPaymentMethods();
    } catch (error) {
      console.error(error);
    } finally {
      state.loading = false;
    }
  };

  const updatePaymentMethod = async (id: string, paymentMethod: any) => {
    try {
      state.loading = true;
      await paymentMethodRepository.updatePaymentMethod(id, paymentMethod);
      await getPaymentMethods();
    } catch (error) {
      console.error(error);
    } finally {
      state.loading = false;
    }
  };

  const deletePaymentMethod = async (id: string) => {
    try {
      state.loading = true;
      await paymentMethodRepository.deletePaymentMethod(id);
      await getPaymentMethods();
    } catch (error) {
      console.error(error);
    } finally {
      state.loading = false;
    }
  };

  const getPaymentMethodById = async (
    id: string,
  ): Promise<IPaymentMethod | undefined> => {
    try {
      state.loading = true;
      const data = await paymentMethodRepository.getPaymentMethodById(id);
      return data;
    } catch (error) {
      console.error(error);
      return undefined;
    } finally {
      state.loading = false;
    }
  };

  const searchPaymentMethods = async (search: string, withContract = true) => {
    const data = await paymentMethodRepository.searchPaymentMethods(search, withContract);
    return data.results;
  }

  return {
    state,
    loading,
    paymentMethods,
    pagination,
    header,
    getPaymentMethods,
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    getPaymentMethodById,
    searchPaymentMethods,
    search,
  };
});
