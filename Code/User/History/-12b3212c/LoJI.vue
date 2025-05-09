<script setup lang="ts">
import { formatBrl, formatDate } from "@/@core/helpers/formatters";
import { useSessionPaymentController } from "@/sessions/controller/sessionPaymentController";
import { onMounted } from "vue";

const props = defineProps({
  cashId: {
    type: String,
    required: true,
  },
});

const sessionPaymentController = useSessionPaymentController();

const listSessionHeaders = [
    {
      id: 1,
      sequence: 0,
      isVisible: true,
      sortable: true,
      title: "Preço",
      value: "price",
    },
    {
      id: 2,
      sequence: 1,
      isVisible: true,
      sortable: true,
      title: "Sessão",
      value: "session",
    },
    {
      id: 3,
      sequence: 2,
      isVisible: true,
      sortable: true,
      title: "Data de pagamento",
      value: "paid_at",
    },
  ]

onMounted(async () => {
  await sessionPaymentController.getSessionPaymentsByCash(props.cashId);
});
</script>

<template>
   <GenericTable
    key-word="serviço"
    v-model:headers="listSessionHeaders"
    v-model:items="sessionPaymentController.sessionPayments"
    no-items-text="Nenhuma sessão encontrada"
    simple-table
    hide-search
  >
    <VDataTable
      v-if="sessionPaymentController.sessionPayments?.length"
      :headers="listSessionHeaders.filter((header) => header.isVisible)"
      :items="sessionPaymentController.sessionPayments"
    >
    <template #item.price="{ item }">
      {{ item?.price ? `R$ ${formatBrl(item?.price)}` : 'Não informado' }}

      </template>
      
      <template #item.session="{item}">
        {{ item.session }} - {{ formatDate(item.session_date) }}
      </template>
      <template #bottom></template>
    </VDataTable>
  </GenericTable>
</template>
