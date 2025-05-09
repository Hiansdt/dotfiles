<script setup lang="ts">
import GenericTable from "@/@core/components/generic/GenericTable.vue";
import { maskCpf } from "@/@core/helpers/formatters";
import { useGroupController } from "@/profile/controller/groupController";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import AddEmployeesGroup from "./AddEmployeesGroup.vue";
import GenericDeleteDialog from "@/@core/components/generic/GenericDeleteDialog.vue";
import { IGroup } from "@/profile/entities/group";
import { handleError } from "@/@core/helpers/exceptions";
import { getTextColor } from "@/@core/helpers/colors";

interface IProps {
  groupId: string;
  groupName: string;
  groupEmployees: string[];
}

const props = defineProps<IProps>();
const router = useRouter();
const groupController = useGroupController();
const search = ref();
const showAddModal = ref(false);
const showRemoveDialog = ref(false);
const activeEmployee = ref<any>({});

const updateOptions = async () => {
  await groupController.getEmployeesByGroup(props.groupId);
};

const removeEmployee = async () => {
  const groupEmployees = props.groupEmployees.filter(
    (employee) => employee !== activeEmployee.value.id,
  )
  const group: Partial<IGroup> = {
    id: props.groupId,
    employees: groupEmployees,
  }
  try {
    await groupController.editGroup(group as IGroup);
    await groupController.getEmployeesByGroup(props.groupId);
    activeEmployee.value = {};
    showRemoveDialog.value = false;
  } catch (error) {
    handleError(error);
  }
};

const viewUser = (id: string | number) => {
  router.push("/employees/" + id);
};

const goToGroup = (id: string) => {
  router.push({
    name: "group-details",
    params: {
      id,
    },
    force: true,
  }).then(() => {
    window.location.reload();
  });
};

onMounted(async () => {
  await updateOptions();
});
</script>

<template>
  <VCard class="w-100 pa-2">
    <VCardTitle>
      Funcionarios do Grupo <a>"{{ props.groupName }}"</a>
    </VCardTitle>

    <VCardSubtitle> Gerencie seus funcionarios </VCardSubtitle>

    <VCardText class="px-0">
      <GenericTable
        key-word="funcionario"
        v-model:headers="groupController.employeesDetailHeader"
        v-model:search="search"
        v-model:pagination="groupController.employeesDetailPagination"
        v-model:items="groupController.employeesDetail"
        @createItem="showAddModal = true"
        @update-options="updateOptions"
        no-items-text="Nenhum funcionario encontrado"
      >
        <VDataTable
          v-if="groupController.employeesDetail.length"
          :headers="
            groupController.employeesDetailHeader.filter(
              (header) => header.isVisible,
            )
          "
          :items="groupController.employeesDetail"
          :items-per-page="groupController.employeesDetailPagination.pageSize"
          :page="groupController.employeesDetailPagination.page"
          :search="search"
          class="text-no-wrap"
          :loading="groupController.loading"
        >
          <template v-slot:header.actions>
            <div class="text-end mx-4">Ações</div>
          </template>

          <template #item.document_number="{ item }">
            {{ maskCpf(item.document_number) }}
          </template>

          <template #item.groups="{item}">
            <VChipGroup>
              <VChip
                v-for="group in item.groups"
                :style="`background-color: ${group.color ?? '#dddddd'}; color: ${getTextColor(group.color ?? '#dddddd')}`"
                @click="goToGroup(group.id)"
              >
                {{ group.name }}
              </VChip>
            </VChipGroup>
          </template>

          <template #item.actions="{ item }">
            <div class="d-flex gap-1 align-center justify-end w-10">
              <IconBtn
                size="small"
                @click="item.id !== undefined && viewUser(item.id)"
              >
                <VIcon icon="ri-eye-line" />
              </IconBtn>

              <IconBtn
                size="small"
                @click="
                  () => ((showRemoveDialog = true), (activeEmployee = item))
                "
              >
                <VIcon icon="ri-delete-bin-line" />
              </IconBtn>
            </div>
          </template>
          <template #bottom> </template>
        </VDataTable>
      </GenericTable>
    </VCardText>
  </VCard>
  <AddEmployeesGroup
    v-model:show-modal="showAddModal"
    :group-employees="props.groupEmployees"
    :group-id="groupId"
  ></AddEmployeesGroup>
  <GenericDeleteDialog
    v-if="props.groupId"
    v-model:isDialogVisible="showRemoveDialog"
    @confirm="removeEmployee"
    keyWord="Funcionario"
    :itemName="activeEmployee?.name"
    actionVerb="remover"
    appendText=" do grupo"
    @cancel="showRemoveDialog = false"
  />
</template>
