<script setup lang="ts">
import { useCashController } from "@/cash/controller/cashController";
import { useSessionPaymentController } from "@/sessions/controller/sessionPaymentController";
import { onMounted } from "vue";

const props = defineProps({
  cashId: {
    type: String,
    required: true,
  },
});

const cashController = useCashController();
const sessionPayment = useSessionPaymentController();

onMounted(async () => {
  await cashController.
});
</script>

<template>
  <VList>
    
  </VList>
</template>
