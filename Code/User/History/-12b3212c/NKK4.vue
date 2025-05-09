<script setup lang="ts">
import { useCashController } from "@/cash/controller/cashController";
import { useSessionController } from "@/sessions/controller/sessionController";
import { useSessionPaymentController } from "@/sessions/controller/sessionPaymentController";
import { onMounted } from "vue";

const props = defineProps({
  cashId: {
    type: String,
    required: true,
  },
});

const cashController = useCashController();
const sessionPaymentController = useSessionPaymentController();

onMounted(async () => {
});
</script>

<template>
  <VList>
    
  </VList>
</template>
