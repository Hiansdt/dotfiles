<script setup lang="ts">
import { IPlanList } from "@/contracts/entities/plan";
import { formatBrl } from "@/@core/helpers/formatters";

import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps<{
  plan: IPlanList;
}>();

const toPlanDetail = (id: string) => {
  router.push({
    name: "plan-detail",
    params: { id },
  });
};
</script>

<template>
  <VCard width="300" class="cursor-pointer" @click="toPlanDetail(props.plan.id)">
    <VCardTitle class="text-h pt-5">
      {{ props.plan.name }}
    </VCardTitle>

    <VCardText>
      <!-- <VList class="d-flex ga-2">
        <VListItem v-for="service in props.plan.services" :key="service.id" class="w-100 px-0">
          <VListItemTitle class="d-flex align-center ga-2">
            <VIcon color="primary"> ri-check-line </VIcon>
            <p class="ma-0">
              <strong>{{ service.quantity }}</strong> -
              {{ service.description }}
            </p>
          </VListItemTitle>
        </VListItem>
      </VList> -->
      <!-- mostre apenas a qtd de serviços -->
      
      <VDivider />
      <p class="text-h6 text-primary font-weight-bold mx-0 mt-5">
        R$ {{ formatBrl(props.plan.price) }} / {{ props.plan.plan_type }}
      </p>
      <p class="text-subtitle-2 mt-5">
        {{ props.plan.services.length }} {{ props.plan.services.length === 1 ? 'serviço cadastrado' : 'serviços cadastrados' }}
      </p>
    </VCardText>
  </VCard>
</template>
