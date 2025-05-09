<script setup lang="ts">
import GenericTable from "@/@core/components/generic/GenericTable.vue";
import { formatBrl } from "@/@core/helpers/formatters";
import { IHeader } from "@/@core/interfaces/app";
import { listServicesPaidHeaders } from "@/cashier/helpers/cashHeaders";
import { ref } from "vue";

interface IServiceItem {
  value: number;
  description: string;
}

const props = defineProps<{
  services: IServiceItem[];
}>();

const headers = ref<IHeader[]>([
  ...listServicesPaidHeaders
]);
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
