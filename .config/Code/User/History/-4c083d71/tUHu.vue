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
  sessionPaymentController.sessionPayments.filter((sessionPayment) => sessionPayment.paid && sessionPayment.session_completed).reduce(
    (a, b) => a + Number(b.price),
    0,
  ),
);

const totalServices =  computed(() =>
  sessionPaymentController.sessionPayments.reduce(
    (a, b) => a + Number(b.price),
    0,
  ),
);

const canceledServices =  computed(() =>
  sessionPaymentController.sessionPayments.filter((sessionPayment) => sessionPayment.session_canceled && !sessionPayment.paid).reduce(
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
          <h4 class="text-body-1">Total de Serviços Completos</h4>
        </div>
        <p class="text-green text-body-1">
          R$ {{ formatBrl(totalServices) }}
        </p>
      </VRow>
      <VRow class="d-flex justify-space-between align-center px-3">
        <div>
          <h4 class="text-body-1">Total de Serviços Cancelados</h4>
        </div>
        <p class="text-red text-body-1">
          R$ {{ formatBrl(canceledServices) }}
        </p>
      </VRow>
      <VRow class="d-flex justify-space-between align-center px-3">
        <div>
          <h4 class="text-body-1">Total em Caixa</h4>
        </div>
        <p class="text-green text-body-1">R$ {{ formatToBrazilian(totalCash.toString()) }}</p>
      </VRow>
    </VCardText>
  </VCard>
</template>
