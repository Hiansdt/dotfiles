<script setup lang="ts">
import { useCashController } from "@/cash/controller/cashController";
import { onMounted } from "vue";

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
  await 
});
</script>

<template>
  <VList>
    
  </VList>
</template>
