<script setup lang="ts">
import { formatBrl, formatToBrazilian } from "@/@core/helpers/formatters";
import { useSessionPaymentController } from "@/sessions/controller/sessionPaymentController";
import { computed } from "vue";

const sessionPaymentController = useSessionPaymentController();

defineProps({
  isExtract: {
    type: Boolean,
    default: true,
  },
  data: {
    type: Object,
    default: () => ({}),
  },
});

const totalCash = computed(() =>
  sessionPaymentController.sessionPayments.filter((sessionPayment) => sessionPayment.paid).reduce(
    (a, b) => a + Number(b.price),
    0,
  ),
);
</script>

<template>
  <VCard class="my-4">
    <VCardTitle class="my-4"><h1 class="text-h5">Totais</h1></VCardTitle>
    <VCardText class="my-6">
      <VRow class="d-flex justify-space-between align-center px-3">
        <div>
          <h4 class="text-body-1">Total de Serviços</h4>
        </div>
        <p class="text-green text-body-1">
          + R$ {{ formatBrl(data?.services_value) }}
        </p>
      </VRow>
      <VRow class="d-flex justify-space-between align-center px-3">
        <div>
          <h4 class="text-body-1">Total de Serviços Cancelados</h4>
        </div>
        <p class="text-red text-body-1">
          R$ {{ formatBrl(data?.canceled_services_value) }}
        </p>
      </VRow>
      <VRow class="d-flex justify-space-between align-center px-3">
        <div>
          <h4 class="text-body-1">Total de Acrescimos</h4>
        </div>
        <p class="text-green text-body-1">
          + R$ {{ formatBrl(data?.tax_value) }}
        </p>
      </VRow>
      <VRow class="d-flex justify-space-between align-center px-3">
        <div>
          <h4 class="text-body-1">Total em Caixa</h4>
        </div>
        <p class="text-green text-body-1">+ R$ {{ formatToBrazilian(totalCash) }}</p>
      </VRow>
    </VCardText>
  </VCard>
</template>
