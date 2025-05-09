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

onMounted(async () => {
  await sessionPaymentController.getSessionPaymentsByCash(props.cashId);
});
</script>

<template>
   <GenericTable
    key-word="serviço"
    v-model:headers="headers"
    v-model:items="props.services"
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
