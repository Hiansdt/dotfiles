<script setup lang="ts">
import GenericTable from "@/@core/components/generic/GenericTable.vue";
import { useGateController } from "@/gate/controller/gateController";
import { onMounted } from "vue";
import { debounce } from "@/@core/helpers/timers";

const gateController = useGateController();

const updateOptions = async () => {
  await gateController.getAgendasMadeMovements()
}

const updateSearch = debounce(gateController.getAgendasMadeMovements, 500);

onMounted(() => {
  updateOptions();
});
</script>

<template>
  <VCard>
    <VCardText>
      <p class="ma-0 text-h6">
        Viagens agendadas
      </p>
    </VCardText>
    <VCardSubtitle>
      Aqui você pode visualizar os pedidos previstos para os próximos dias
    </VCardSubtitle>
    <GenericTable
    key-word="pedidos previstos"
    v-model:headers="gateController.agendasMadeHeaders"
    v-model:search="gateController.search"
    v-model:pagination="gateController.pagination"
    v-model:items="gateController.agendasMadeMovements"
    @updateOptions="updateOptions"
    @update:search="updateSearch"
    hide-create
    no-items-text="Nenhum pedido previsto encontrado"
  >
    <VDataTable
      v-if="gateController.agendasMadeMovements.length"
      :headers="gateController.agendasMadeHeaders.filter((header) => header.isVisible)"
      :items="gateController.agendasMadeMovements"
      :loading="gateController.loading"
      :items-per-page="gateController.pagination.page_size"
      :page="gateController.pagination.page"
      :search="gateController.search"
      class="text-no-wrap"
    >
      <template #bottom> </template>
    </VDataTable>
  </GenericTable>
</VCard>
</template>
