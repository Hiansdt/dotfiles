<script setup lang="ts">
import { reactive, watch } from "vue";
import { IField } from "@/@core/interfaces/genericForms";
import GenericForm from "@/@core/components/generic/GenericForm.vue";
import { usePaymentMethodController } from "@/cash/controller/paymentMethodController";
import { handleErrorMessage, showMessage } from "@/@core/helpers";
import { parseFormattedValue } from "@/@core/helpers/formatters";

const paymentMethodController = usePaymentMethodController();

const emits = defineEmits(["cancel-create"]);

const showModal = defineModel("showModal", { default: true });

const createFields = reactive<IField[]>([
  {
    label: "Descrição",
    model: "description",
    type: "text",
    value: null,
    autofocus: true,
    rules: [(v: string) => !!v || "Campo obrigatório"],
    md: 12,
    error: "",
  }
]);

const initialData = {
  description: "",
  is_contract: false,
  has_addition: false,
  addition_type: null,
  addition_value: null,
};

const handleModal = (val: boolean) => {
  if (!val) {
    emits("cancel-create");
    setTimeout(() => {
      createFields.forEach((field: IField) => {
        field.value = null;
        field.error = "";
      });
    }, 500);
  }
};

const createPaymentMethod = async (data: any) => {
  try {
    await paymentMethodController.createPaymentMethod({
      ...data,
      tax_value: parseFormattedValue(data.tax_value),
    });
    showMessage("Forma de pagamento criada com sucesso!", "success");
    handleModal(false);
  } catch (error: any) {
    paymentMethodController.state.loading = false;
    handleErrorMessage(error, createFields);
    handleModal(error);
  }
};

watch(
  () => createFields[3]?.value,
  async (newValue) => {
    if (newValue === "FIXO") {
      createFields[4].maskType = "brl";
      createFields[4].prefix = "R$";
      createFields[4].suffix = "";
    } else {
      createFields[4].maskType = "brl";
      createFields[4].prefix = "";
      createFields[4].suffix = "%";
    }
  },
);
</script>

<template>
  <GenericForm
    :is-dialog-visible="showModal"
    :fields="createFields"
    :initial-data="initialData"
    :loading="paymentMethodController.loading"
    :max-width="'600'"
    title="Adicionar forma de pagamento"
    @update:is-dialog-visible="(val: boolean) => handleModal(val)"
    @submit="createPaymentMethod"
  />
</template>
