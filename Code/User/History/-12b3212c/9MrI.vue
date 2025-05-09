<script setup lang="ts">
import GenericForm from "@/@core/components/generic/GenericForm.vue";
import GenericTable from "@/@core/components/generic/GenericTable.vue";
import { handleErrorMessage } from "@/@core/helpers";
import { formatBrl, parseFormattedValue } from "@/@core/helpers/formatters";
import { IHeader } from "@/@core/interfaces/app";
import { IField } from "@/@core/interfaces/genericForms";
import { useCashController } from "@/cash/controller/cashController";
import { usePaymentMethodController } from "@/cash/controller/paymentMethodController";
import { reactive, ref } from "vue";
import { onMounted } from "vue";
import { useDate } from "vuetify";

const props = defineProps({
  cashId: {
    type: String,
    required: true,
  },
  hideCreate: {
    type: Boolean,
    default: false
  }
});

const cashController = useCashController();
const paymentMethodController = usePaymentMethodController();

const emits = defineEmits(["open:deleteDialog", "open:createDialog"]);

const headers = ref<IHeader[]>([
  {
    id: 1,
    sequence: 0,
    isVisible: true,
    sortable: true,
    title: "Descrição",
    value: "description",
  },
  {
    id: 2,
    sequence: 1,
    isVisible: true,
    sortable: true,
    title: "Valor",
    value: "value",
  },
  {
    id: 3,
    sequence: 2,
    isVisible: true,
    sortable: true,
    title: "Registrado em",
    value: "registered_at",
  },
  {
    id: 4,
    sequence: 3,
    isVisible: true,
    sortable: true,
    title: "Tipo",
    value: "cashier_log_type",
  },
]);
const fieldsToAddEntrance = reactive<IField[]>([
  {
    label: "Descricao",
    model: "description",
    type: "text",
    md: 12,
    rules: [(v: string) => !!v || "Campo Obrigatorio"],
  },
  {
    label: "Tipo",
    model: "cashier_log_type",
    type: "select",
    items: [
      { text: "ENTRADA", value: "ENTRADA" },
      { text: "SAIDA", value: "SAIDA" },
    ],
    md: 12,
    rules: [(v: string) => !!v || "Campo Obrigatorio"],
  },
  {
    label: "Método de Pagamento",
    placeholder: "Selecione um método de pagamento",
    model: "payment_method",
    type: "searchAutocomplete",
    md: 12,
    searchFunction: paymentMethodController.searchPaymentMethods,
    itemTitle: "description",
    itemValue: "id",
    rules: [(v: string) => !!v || "Campo Obrigatorio"],
  },
  {
    label: "Valor",
    model: "value",
    type: "text",
    maskType: "brl",
    md: 12,
    rules: [(v: string) => !!v || "Campo Obrigatorio"],
  },
]);

const showCreateModal = ref(false);
const typeFilter = ref('');

const createEntrance = async (value: any) => {
  try {
    const cashLogData = {
      ...value,
      value: parseFormattedValue(value.value),
      cashier: props.cashId,
      registered_at: new Date(),
      is_manual: true,
    };

    await cashController.postCashLogManual(cashLogData, typeFilter.value);
    showCreateModal.value = false;
  } catch (e) {
    handleErrorMessage(e, fieldsToAddEntrance);
  }
};

const updateOptions = async () => {
  await cashController.getCashesLogsManual(props.cashId, typeFilter.value);
};

onMounted(async () => {
  await updateOptions();
});
</script>

<template>
  <VList>
    
  </VList>
</template>
