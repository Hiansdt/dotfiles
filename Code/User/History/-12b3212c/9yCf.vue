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
{{ sessionPaymentController.sessionPayments }}    
</template>
