<script setup lang="ts">
import { onMounted, ref } from "vue";
import { handleErrorMessage, showMessage } from "@/@core/helpers";
import GenericTable from "@/@core/components/generic/GenericTable.vue";
import GenericDeleteDialog from "@/@core/components/generic/GenericDeleteDialog.vue";
import EditService from "@/clinic/infra/components/services/services/EditService.vue";
import { useServiceTypeController } from "@/clinic/controller/serviceTypeController";
import { IListServiceType } from "@/clinic/entities/service_type";
import { IListService } from "@/clinic/entitites/service";
import CreateServiceType from "./CreateServiceType.vue";

const serviceTypeController = useServiceTypeController();

const showCreateDialog = ref(false);
const showDeleteDialog = ref(false);
const showEditDialog = ref(false);
const activeServiceType = ref<IListServiceType | null>(null);

const updateOptions = async () => {
  await serviceTypeController.getServiceTypes();
};

const deleteServiceType = async () => {
  try {
    await serviceTypeController.deleteServiceType(activeServiceType.value?.id as string);
    const index = serviceTypeController.serviceTypes.findIndex((item) => item.id === activeServiceType.value?.id);
    if (index !== -1) {
      serviceTypeController.state.serviceTypes.splice(index, 1);
      serviceTypeController.state.pagination.total -= 1;
      serviceTypeController.state.pagination.numPages = Math.ceil(serviceTypeController.state.pagination.total / serviceTypeController.state.pagination.pageSize);
    }
    showMessage("Serviço excluído com sucesso", "success");
    toggleDeleteDialog(false);
  } catch(error) {
    handleErrorMessage(error)
  }
};

const toggleDeleteDialog = (value: boolean, service: IListServiceType | null = null) => {
  showDeleteDialog.value = value;
  activeServiceType.value = service;
}

const toggleEditDialog = (value: boolean, service: IListServiceType | null = null) => {
  showEditDialog.value = value;
  activeServiceType.value = service;
}

onMounted(async () => {
  await updateOptions();
});
</script>

<template>
  <GenericTable
    key-word="tipo de serviço"
    no-items-text="Nenhum tipo de serviço encontrado"
    v-model:items="serviceTypeController.serviceTypes"
    v-model:pagination="serviceTypeController.pagination"
    v-model:headers="serviceTypeController.headers"
    v-model:search="serviceTypeController.search"
    @update-options="updateOptions"
    @create-item="showCreateDialog = true"
  >
    <VDataTable
      v-if="serviceTypeController.serviceTypes?.length"
      :items="serviceTypeController.serviceTypes"
      :headers="serviceTypeController.headers.filter((header) => header.isVisible)"
      :items-per-page="serviceTypeController.pagination.pageSize"
      :page="serviceTypeController.pagination.page"
    >
      <template #item.actions="{ item }">
        <div class="d-flex ga-2">
          <IconBtn @click="toggleEditDialog(true, item)">
            <VIcon> ri-pencil-line </VIcon>
          </IconBtn>
          <IconBtn @click="toggleDeleteDialog(true, item)">
            <VIcon> ri-delete-bin-line </VIcon>
          </IconBtn>
        </div>
      </template>
      <template #bottom></template>
    </VDataTable>
  </GenericTable>

  <CreateServiceType v-model:show-dialog="showCreateDialog" />

  <EditService v-model:show-dialog="showEditDialog" v-model:active-service="activeServiceType as IListService" />

  <GenericDeleteDialog 
    :is-dialog-visible="showDeleteDialog"
    key-word="serviço"
    :item-name="activeServiceType?.description ?? ''"
    @update:is-dialog-visible="toggleDeleteDialog"
    @cancel="toggleDeleteDialog(false)"
    @confirm="deleteServiceType"
  />
</template>
