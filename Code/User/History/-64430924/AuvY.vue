<script setup lang="ts">
import GenericForm from "@/@core/components/generic/GenericForm.vue";
import SearchAutocomplete from "@/@core/components/inputs/SearchAutocomplete.vue";
import { handleErrorMessage, showMessage } from "@/@core/helpers";
import {
  formatBrl,
  formatBrlToInput,
  parseFormattedValue,
} from "@/@core/helpers/formatters";
import { IField } from "@/@core/interfaces/genericForms";
import { useServiceController } from "@/clinic/controller/serviceController";
import { ICreateService } from "@/clinic/entities/service";
import { usePlanController } from "@/contracts/controller/planController";
import { reactive, ref, watch } from "vue";

const planController = usePlanController();

const isDialogVisible = defineModel("isDialogVisible", {
  type: Boolean,
  default: false,
});

const fields = reactive<IField[]>([
  {
    label: "Nome",
    model: "name",
    type: "text",
    rules: [(value: string) => !!value || "Campo obrigatório"],
    md: 12,
  },
  {
    label: "Descrição",
    model: "description",
    type: "textarea",
    rules: [(value: string) => !!value || "Campo obrigatório"],
    md: 12,
  },
  {
    label: "Tipo",
    model: "plan_type",
    type: "select",
    rules: [(value: string) => !!value || "Campo obrigatório"],
    md: 12,
    items: [
      {
        text: "Mensal",
        value: 1,
      },
      {
        text: "Trimestral",
        value: 2,
      },
      {
        text: "Semestral",
        value: 6,
      },
      {
        text: "Anual",
        value: 12,
      },
    ],
  },
  // {
  //   label: "Valor",
  //   model: "price",
  //   type: "text",
  //   rules: [(value: string) => !!value || "Campo obrigatório"],
  //   md: 12,
  //   maskType: "brl",
  // },
]);

const createPlan = async (data: any) => {
  if (!selectedServices.value.length) {
    showMessage("Selecione pelo menos um serviço", "warning");
    return;
  }
  try {
    data.services = selectedServices.value.map((service) => ({
      ...service,
      price: parseFormattedValue(service.price),
    }));
    await planController.createPlan(data);
    showMessage("Plano criado com sucesso", "success");
    isDialogVisible.value = false;
    await planController.getPlans();
  } catch (error) {
    handleErrorMessage(error);
  }
};

const services = ref<ICreateService[]>([]);
const service = ref<ICreateService | null>(null);
const selectedServices = ref<any[]>([]);

const selectService = (value: any) => {
  if (value) {
    if (!selectedServices.value.map((i) => i.id).includes(value.id)) {
      selectedServices.value.push({
        ...value,
        price: formatBrl(value.price),
        quantity: 1,
      });
    }
    service.value = null;
  }
};

const addServiceQuantity = (service: ICreateService) => {
  const index = selectedServices.value.findIndex(
    (item) => item.id === service.id,
  );
  if (index !== -1) {
    selectedServices.value[index].quantity++;
  }
};

const subtractServiceQuantity = (service: ICreateService) => {
  const index = selectedServices.value.findIndex(
    (item) => item.id === service.id,
  );
  if (index !== -1) {
    if (selectedServices.value[index].quantity > 1) {
      selectedServices.value[index].quantity--;
    } else {
      selectedServices.value.splice(index, 1);
    }
  }
};

watch(() => isDialogVisible.value, () => {
  selectedServices.value = []
})
</script>

<template>
  <GenericForm
    title="Criar Plano"
    :fields="fields"
    v-model:is-dialog-visible="isDialogVisible"
    @submit="createPlan"
  >
    <template #custom>
      <VList class="px-2 d-flex flex-column ga-2">
        <div>
          <SearchAutocomplete
            v-model:value="service"
            v-model:items="services"
            :autofocus="false"
            label="Serviços"
            item-title="description"
            item-value="id"
            :search-function="useServiceController().searchServices"
            :multiple="false"
            :chips="false"
            :return-object="true"
            :second-param="null"
            :create-data="null"
            :exclude="() => selectedServices.map((item: ICreateService) => item.id)"
            placeholder="Selecione um serviço"
            :item-component="null"
            :errors="''"
            :disabled="false"
            @update:value="selectService"
          />
        </div>

        <VListItem
          v-if="selectedServices.length"
          v-for="service in selectedServices"
          :key="service.id"
        >
          <template #prepend>
            <div class="d-flex align-center flex-column">
              <VIcon @click="addServiceQuantity(service)">
                ri-arrow-drop-up-fill
              </VIcon>

              <p class="ma-0">
                {{ service.quantity }}
              </p>

              <VIcon @click="subtractServiceQuantity(service)">
                ri-arrow-drop-down-fill
              </VIcon>
            </div>
          </template>

          <VListTitle class="mx-4">
            {{ service.description }}
          </VListTitle>

          <template #append>
            <VTextField
              width="100"
              v-model="service.price"
              type="text"
              density="compact"
              suffix="R$"
              @update:model-value="
                (value) => (service.price = formatBrlToInput(value))
              "
            />
          </template>
        </VListItem>

        <p v-else class="text-center my-1">Nenhum serviço selecionado</p>

        <p v-if="selectedServices.length" class="text-center ma-0">
          Valor total do plano:
          <strong
            >R$
            {{
              selectedServices.reduce((acc, service) => {
                return (
                  acc + parseFormattedValue(service.price) * service.quantity
                );
              }, 0)
            }}</strong
          >
        </p>
      </VList>
    </template>
  </GenericForm>
</template>
