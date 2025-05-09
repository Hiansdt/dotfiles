<script setup lang="ts">
import GenericTable from "@/@core/components/generic/GenericTable.vue";
import { formatBrl } from "@/@core/helpers/formatters";
import { IHeader } from "@/@core/interfaces/app";
import { listServicesPaidHeaders } from "@/cash/helpers/cashHeaders";
import { ref } from "vue";

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
</script>

<template>
  <GenericTable
    key-word="serviço"
    v-model:headers="listSessionHeaders"
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
