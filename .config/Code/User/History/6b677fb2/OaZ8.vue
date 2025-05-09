<script setup lang="ts">
import GenericDeleteDialog from "@/@core/components/generic/GenericDeleteDialog.vue";
import GenericTable from "@/@core/components/generic/GenericTable.vue";
import { debounce, handleErrorMessage, handleError } from "@/@core/helpers";
import { formatBrl } from "@/@core/helpers/formatters";
import { router } from "@/@core/plugins/registered/1.router";
import { useCashController } from "@/cashier/controller/cashController";
import { ICash } from "@/cashier/entities/cashier";
import { ref } from "vue";
import { onMounted } from "vue";
import { useDate } from "vuetify";

const cashController = useCashController();
const statusColor = {
  ABERTO: "info",
  APROVADO: "success",
  RECUSADO: "error",
  ANALISE: "warning",
};

const showCreateModal = ref(false)
const closeCashConfirmDialog = ref(false);
const currentCash = ref<Partial<ICash>>({})

const getCashes = async () => {
  await cashController.getMyCashes();
};

const openCloseCashModal = (item: Partial<ICash>) => {
  closeCashConfirmDialog.value = true
  currentCash.value = item
}

const closeCash = async () => {
  try {
    await cashController.closeCash(currentCash.value?.id as string);
    // await getCashes()
    currentCash.value.status = 'PENDENTE'
    currentCash.value = {}
    closeCashConfirmDialog.value = false
  } catch (e) {
    console.log(e);
    handleError(e);
  }
};

const viewCash = (id: string) => {
  router.push({ name: "myCashDetail", params: { id } })
}

const debounceCashes = debounce(getCashes, 500);

const openCash = async () => {
  try {
    await cashController.openCash()
    showCreateModal.value = false
  } catch (e) {
    console.log(e)
    handleErrorMessage(e)
  }
}

onMounted(async () => {
  await getCashes();
});
</script>

<template>
  <GenericTable key-word="Caixa" v-model:headers="cashController.myCashesHeaders" v-model:search="cashController.search"
    v-model:pagination="cashController.myCashesPagination" v-model:items="cashController.myCashes"
    @updateOptions="debounceCashes" @update:search="debounceCashes" @create-item="showCreateModal = true"
    no-items-text="Nenhum caixa encontrado">
    <VDataTable v-if="cashController.myCashes.length"
      :headers="cashController.myCashesHeaders.filter((header) => header.isVisible)" :items="cashController.myCashes"
      :loading="cashController.loading" :items-per-page="cashController.myCashesPagination.page_size"
      :page="cashController.myCashesPagination.page" :search="cashController.search" class="text-no-wrap">
      <template v-slot:header.actions>
        <div class="mx-4" :class="cashController.myCashesHeaders.find((h) => h.value == 'actions')
            ?.sequence ==
            cashController.myCashesHeaders.length - 1
            ? 'text-end'
            : ''
          ">
          Ações
        </div>
      </template>
      <template #item.status="{ item }">
        <VChip :color="statusColor[item.status as keyof typeof statusColor]">
          {{ item.status }}
        </VChip>
      </template>
      <template #item.value="{ item }">
        {{ item.value ? `R$ ${formatBrl(item.value)}` : "Não Informado" }}
      </template>
      <template #item.opened_at="{ item }">
        {{ item.opened_at ? useDate().format(item.opened_at, 'keyboardDateTime24h') : 'Não Informado' }}
      </template>

      <template #item.closed_at="{ item }">
        {{ item.closed_at ? useDate().format(item.closed_at, 'keyboardDateTime24h') : 'Não Informado' }}
      </template>


      <template #item.actions="{ item }">
        <div class="d-flex gap-1 align-center w-10" :class="cashController.myCashesHeaders.find((h) => h.value == 'actions')
            ?.sequence ==
            cashController.myCashesHeaders.length - 1
            ? 'justify-end'
            : ''
          ">
          <VTooltip text="Visualizar">
            <template v-slot:activator="{ props }">
              <IconBtn size="small" @click="viewCash(item.id)" v-bind="props">
                <VIcon icon="ri-eye-line" />
              </IconBtn>
            </template>
          </VTooltip>

          <VTooltip text="Fechar Caixa">
            <template v-slot:activator="{ props }">
              <IconBtn v-if="item.status == 'EM ABERTO'" size="small" @click="openCloseCashModal(item)" v-bind="props">
                <VIcon icon="ri-lock-line" />
              </IconBtn>
            </template>
          </VTooltip>

        </div>
      </template>
      <template #bottom> </template>
    </VDataTable>
  </GenericTable>

  <VDialog v-model="showCreateModal" max-width="500">
    <VCard class="pa-4">
      <VCardTitle class="d-flex flex-column align-center pa-4">
        <VIcon size="80">
          ri-error-warning-line
        </VIcon>
        <p class="ma-0">
          Realmente deseja criar um caixa?
        </p>
      </VCardTitle>

      <VCardActions>
        <VRow>
          <VCol cols="6">
            <VBtn block variant="outlined" color="">
              Cancelar
            </VBtn>
          </VCol>
          <VCol cols="6">
            <VBtn block color="success" variant="flat" @click="openCash">
              Criar
            </VBtn>
          </VCol>
        </VRow>
      </VCardActions>
    </VCard>
  </VDialog>

  <GenericDeleteDialog key-word="caixa" action-verb="fechar" prepend-text="o caixa "
    :item-name="currentCash?.number ?? ''" v-model:isDialogVisible="closeCashConfirmDialog"
    @cancel="closeCashConfirmDialog = false" @confirm="closeCash" />
</template>
