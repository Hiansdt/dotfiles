import { reactive, computed } from "vue";
import { defineStore } from "pinia";
import { container } from "tsyringe";


import { ClientRepository } from "../repository/clientRepository";
import { IClientState, IClientController } from "../interfaces/client";
import { IListClient } from "../entities/client";
import { useRouter } from "vue-router";
import { showMessage } from "@/@core/helpers";
import { defaultPagination } from "@/@core/helpers/defaultItems";
import { IHeader, IPagination } from "@/@core/interfaces/app";


export const useClientController = defineStore<"clients", IClientController>("clients", () => {
  const state = reactive<IClientState>({
    clients: [],
    birthdayClients: [],
    currentClient: null,
    loading: false,
    pagination: {
      ...defaultPagination
    },
    headers: [
      {
        id: 0,
        title: "Nome",
        value: "name",
        sequence: 0,
        isVisible: true,
        sortable: true,
      },
      {
        id: 1,
        title: "Email",
        value: "email",
        sequence: 1,
        isVisible: true,
        sortable: true,
      },
      {
        id: 2,
        title: "Telefone",
        value: "phone",
        sequence: 2,
        isVisible: true,
        sortable: true,
      },
      {
        id: 3,
        title: "Ações",
        value: "actions",
        sequence: 3,
        isVisible: true,
        sortable: false,
      }
    ],
    search: "",
  });

  const router = useRouter()
  const clientRepository = container.resolve(ClientRepository);
  const clients = computed(() => state.clients);
  const currentClient = computed(() => state.currentClient);
  const pagination = computed({
    get: () => state.pagination,
    set: (value: IPagination) => {
      state.pagination = value;
    }
  });
  const headers = computed({
    get: () => state.headers.sort((a, b) => a.sequence - b.sequence),
    set: (value: IHeader[]) => {
      state.headers = value;
    }
  })
  const search = computed({
    get: () => state.search,
    set: (value: string) => {
      state.search = value;
    }
  });
  const loading = computed(() => state.loading);
  const birthdayClients = computed(() => state.birthdayClients);

  const getClients = async () => {
    state.loading = true;
    const data = await clientRepository.getClients(state.pagination.page, state.pagination.pageSize, "");
    state.clients = data.results;
    state.pagination = {
      ...state.pagination,
      total: data.total,
      numPages: data.num_pages,
      page: data.page_number,
      pageSize: data.page_size
    }
    state.loading = false;
  };

  const createClient = async (client: IListClient) => {
    state.loading = true;
    await clientRepository.createClient(client);
    state.loading = false;
  };

  const updateClient = async (client: IListClient) => {
    state.loading = true;

    try {
      await clientRepository.updateClient(client);
      showMessage(
        "Cliente atualizado com sucesso!",
        "success",
      );
    } catch (error: any) {
      console.log(error)
      showMessage(
        "Ocorreu um erro ao atualizar o cliente",
        "error",
      );
    } finally {
      state.loading = false;
    }
  };

  const getClientById = async (id: string) => {
      const data = await clientRepository.getClientById(id);
      state.currentClient = data;
  };

  const deleteClient = async (clientId: number) => {
    state.loading = true;
    try {
      await clientRepository.deleteClient(clientId);
    } catch (error: any) {
      showMessage(
        "Ocorreu um erro ao deletar o cliente",
        "error",
      );
    } finally {
      state.loading = false;
      router.push("/clients");
      showMessage(
        "Cliente deletado com sucesso!",
        "warning",
      );
    }
  };

  const searchClients = async (search: any) => {
    const data = await clientRepository.getClients(1, 20, search);
    return data.results;
  };

  const getBirthdayWeek = async (): Promise<IListClient[]> => {
      const data = await clientRepository.getBirthdayWeek();
      state.birthdayClients = data;
      return data;
  };

  return {
    state,
    currentClient,
    clients,
    loading,
    pagination,
    headers,
    search,
    birthdayClients,
    getClients,
    createClient,
    updateClient,
    getClientById,
    getBirthdayWeek,
    deleteClient,
    searchClients,
  };
});
