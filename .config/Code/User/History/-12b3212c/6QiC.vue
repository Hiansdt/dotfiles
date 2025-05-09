<script setup lang="ts">
import GenericForm from "@/@core/components/generic/GenericForm.vue";
import GenericTable from "@/@core/components/generic/GenericTable.vue";
import { handleErrorMessage } from "@/@core/helpers";
import { formatBrl, parseFormattedValue } from "@/@core/helpers/formatters";
import { IHeader } from "@/@core/interfaces/app";
import { IField } from "@/@core/interfaces/genericForms";
import { useCashController } from "@/cashier/controller/cashController";
import { usePaymentMethodController } from "@/cashier/controller/paymentMethodController";
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
  <VCard>
    <VCardText>
      <VRow>
        <VCol>
          <VChipGroup v-model="typeFilter" column @update:model-value="updateOptions">
            <VChip text="TODOS" variant="outlined" value="" filter />
            <VChip text="ENTRADAS" variant="outlined" value="ENTRADA" filter />
            <VChip
              text="SAÍDAS"
              variant="outlined"
              value="SAÍDA"
              filter
            />
          </VChipGroup>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
  <GenericTable
    key-word="movimentação"
    v-model:headers="headers"
    v-model:pagination="cashController.cashLogsPagination"
    v-model:items="cashController.cashLogs"
    @updateOptions="updateOptions"
    @create-item="showCreateModal = true"
    no-items-text="Nenhuma movimentação encontrada"
    :hide-create="props.hideCreate"
    hide-search
  >
    <VDataTable
      v-if="cashController.cashLogs.length"
      :headers="headers.filter((header) => header.isVisible)"
      :items="cashController.cashLogs"
      :items-per-page="cashController.cashLogsPagination.page_size"
      :loading="cashController.loading"
      :page="cashController.cashLogsPagination.page"
    >
      <template #item.value="{ item }">
        {{ item.value ? `R$ ${formatBrl(item.value)}` : "Não Infomado" }}
      </template>
      <template #item.registered_at="{ item }">
        {{
          item.registered_at
            ? `${useDate().format(item.registered_at, "keyboardDateTime24h")}`
            : "Não Infomado"
        }}
      </template>
      <template #item.cashier_log_type="{ item }">
        <VChip
          :color="item.cashier_log_type == 'ENTRADA' ? 'success' : 'error'"
        >
          {{ item.cashier_log_type }}
        </VChip>
      </template>
      <template #bottom></template>
    </VDataTable>
  </GenericTable>

  <GenericForm
    title="Adicionar movimentacao manual"
    v-model:is-dialog-visible="showCreateModal"
    :fields="fieldsToAddEntrance"
    @submit="createEntrance"
  />
</template>
