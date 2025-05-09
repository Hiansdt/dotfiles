<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import GenericForm from "@/@core/components/generic/GenericForm.vue";
import ListServicesPaid from "@/cash/infra/components/cash/ListServicesPaid.vue";
import ExtractTotals from "@/cash/infra/components/cash/ExtractTotals.vue";
import { IField } from "@/@core/interfaces/genericForms";
import { formatBrl } from "@/@core/helpers/formatters";
import GenericDeleteDialog from "@/@core/components/generic/GenericDeleteDialog.vue";
import { handleError } from "@/@core/helpers";
import { useCashController } from "@/cash/controller/cashController";
import EntrancesDepartures from "@/cash/infra/components/cash/check/EntrancesDepartures.vue";
import { ICash } from "@/cash/entities/cash";
import { useRouter } from "vue-router";

const cashController = useCashController();
const router = useRouter()
const id = computed<string>(() => router.currentRoute.value.params?.id as string)

const movementTab = ref();
const tabs = [
  { icon: "ri-cash-line", title: "Informações do caixa" },
  { icon: "ri-login-box-line", title: "Sessões" },
];
const fieldsDissaprove = reactive<IField[]>([
  {
    label: "Justificativa",
    model: "justification",
    type: "text",
    value: "",
    md: 12,
  },
]);
const cash = ref<Partial<ICash>>({
  number: ''
});
const breadcrumbs = computed(() => [
  {
    title: "Caixas",
    to: "/cash-register",
  },
  {
    title: `Pedido N° ${cash.value?.number}`,
    disabled: true,
  },
]);
const closeCashConfirmDialog = ref(false);

const showDissaprove = ref(false);
// const showCloseCashBtn = computed(() => {
//   if (cash.value.status == "EM ABERTO") {
//     if (cash.value.employee_id == authController.currentEmployeeId) {
//       return true;
//     } else if (can("manage", "cash")) {
//       return true;
//     }
//   }
//   return false;
// })

const updateDissaprove = (value: boolean) => {
  showDissaprove.value = value;
};

const closeCash = async () => {
  try {
    await cashController.closeCash(id.value);
    cash.value.status = "PENDENTE";
    closeCashConfirmDialog.value = false
  } catch (e) {
    handleError(e);
  }
};

watch(
  () => id.value,
  async () => {
    cash.value = await cashController.getCashById(id.value);
  },
);

onMounted(async () => {
  cash.value = await cashController.getCashById(id.value);
});
</script>

<template>
  <div class="d-flex flex-column ga-4">
    <VBreadcrumbs :items="breadcrumbs" class="pa-0 ma-0"></VBreadcrumbs>

    <VRow>
      <VCol cols="6">
        <h1 class="text-h5 my-1">Resumo - Envelope N° {{ cash?.number }}</h1>
      </VCol>

      <VCol class="d-flex align-center justify-end">
        <VChip>
          {{ cash?.status }}
        </VChip>
      </VCol>
    </VRow>

    <VCol cols="12">
      <VTabs v-model="movementTab" class="pa-0 ma-0" density="comfortable">
        <VTab v-for="tab in tabs" :key="tab.icon" class="mr-2">
          <VIcon start :icon="tab.icon" />
          <span>{{ tab.title }}</span>
        </VTab>
      </VTabs>
    </VCol>

    <VCol cols="12" class="pa-0">
      <VWindow
        v-model="movementTab"
        class="disable-tab-transition"
        :touch="false"
        cols="12"
      >
        <VWindowItem>
          <ListServicesPaid :services="cash?.services ?? []" />
        </VWindowItem>
        <VWindowItem>
          <EntrancesDepartures :cash-id="id" :hide-create="cash?.status != 'EM ABERTO'" />
        </VWindowItem>
      </VWindow>
    </VCol>

    <VCard class="pa-4">
      <VRow>
        <VCol v-for="paymentMethod in cash?.payment_methods">
          <VCard class="pa-2" variant="outlined">
            <VCardTitle>
              {{ paymentMethod.method }}
            </VCardTitle>
            <VCardSubtitle>
              {{
                paymentMethod.value
                  ? `R$ ${formatBrl(paymentMethod.value)}`
                  : "Não informado"
              }}
            </VCardSubtitle>
          </VCard>
        </VCol>
      </VRow>
    </VCard>

    <GenericForm
      v-model:isDialogVisible="showDissaprove"
      title="Reprovar Caixa"
      :fields="fieldsDissaprove"
      @update:is-dialog-visible="updateDissaprove"
    />

    <ExtractTotals :isExtract="false" :data="cash ?? {}" />

    <VRow class="pa-2 mt-2" col="12">
      <VCol col="12">
        <VBtn
          block
          variant="flat"
          color="success"
          @click="closeCashConfirmDialog = true"
          v-if="cash.status !== 'FECHADO' && cash.status !== 'PENDENTE'"
        >
          Fechar Caixa
        </VBtn>
      </VCol>
    </VRow>
  </div>

  <GenericDeleteDialog
    key-word="caixa"
    action-verb="fechar"
    prepend-text="o caixa "
    :item-name="cash?.number ?? ''"
    v-model:isDialogVisible="closeCashConfirmDialog"
    @cancel="closeCashConfirmDialog = false"
    @confirm="closeCash"
  />
</template>
