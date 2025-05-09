<script setup>
import GenericTable from "@/@core/components/generic/GenericTable.vue";
import { debounce } from "@/@core/helpers/timers";
import { usePaymentMethodController } from "@/cashier/controller/paymentMethodController";
import { onMounted, ref } from "vue";

const paymentMethodController = usePaymentMethodController();

const search = ref("");

const emits = defineEmits([
  "open:deleteDialog",
  "open:createDialog",
  "open:editDialog",
]);

const updateOptions = async () => {
  await paymentMethodController.getPaymentMethods();
};

const updateSearch = debounce(paymentMethodController.getPaymentMethods, 500);

onMounted(async () => {
  await updateOptions();
});
</script>

<template>
  <GenericTable key-word="formas de pagamento" v-model:headers="paymentMethodController.header"
    v-model:pagination="paymentMethodController.pagination" v-model:items="paymentMethodController.paymentMethods"
    v-model:search="paymentMethodController.search" @updateOptions="updateOptions"
    @createItem="emits('open:createDialog')" @update:search="updateSearch"
    no-items-text="Nenhuma forma de pagamento encontrada">
    <VDataTable v-if="paymentMethodController.paymentMethods.length" :headers="paymentMethodController.header.filter((header) => header.isVisible)
      " :items="paymentMethodController.paymentMethods" :items-per-page="paymentMethodController.pagination.page_size"
      :loading="paymentMethodController.loading" :page="paymentMethodController.pagination.page">
      <template #item.is_contract="{ item }">
        <span>{{ item.is_contract ? "Sim" : "Não" }}</span>
      </template>

      <template #item.actions="{ item }">
        <div class="d-flex gap-1">
          <VTooltip text="Editar">
            <template v-slot:activator="{ props }">
              <IconBtn size="small" @click="emits('open:editDialog', item)" v-bind="props">
                <VIcon icon="ri-pencil-line" />
              </IconBtn>
            </template>
          </VTooltip>
          <VTooltip text="Excluir">
            <template v-slot:activator="{ props }">
              <IconBtn size="small" @click="emits('open:deleteDialog', item)" v-bind="props">
                <VIcon icon="ri-delete-bin-line" />
              </IconBtn>
            </template>
          </VTooltip>

        </div>
      </template>

      <template #bottom></template>
    </VDataTable>
  </GenericTable>
</template>
