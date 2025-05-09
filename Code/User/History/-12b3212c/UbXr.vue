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

onMounted(async () => {
  await updateOptions();
});
</script>

<template>
  <VList>
    
  </VList>
</template>
