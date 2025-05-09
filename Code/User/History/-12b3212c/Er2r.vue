<script setup lang="ts">
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
    no-items-text="Nenhum serviço encontrado"
    simple-table
    hide-search
  >
    <VDataTable
      v-if="props.services?.length"
      :headers="headers.filter((header) => header.isVisible)"
      :items="props.services"
    >
    <template #item.value="{ item }">
      {{ item?.value ? `R$ ${formatBrl(item?.value)}` : 'Não informado' }}

      </template>
      <template #bottom></template>
    </VDataTable>
  </GenericTable>
</template>
