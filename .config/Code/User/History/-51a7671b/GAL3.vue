<script setup lang="ts">
import GenericFormFlat from "@/@core/components/generic/GenericFormFlat.vue";
import { IField } from "@/@core/interfaces/genericForms";
import { useEmployeeController } from "@/employees/controller/employeeController";
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import DocumentsSection from "../../components/detail/DocumentsSection.vue";
import GenericEditAddress from "@/@core/components/generic/GenericEditAddress.vue";
import { IEmployee, IEmployeeDetail } from "@/employees/entities/employee";
import { fieldsToData } from "@/@core/helpers/fields";

const props = defineProps<{
  id: string;
}>();

const employeeController = useEmployeeController();

const items = computed(() => [
  {
    title: "Funcionários",
    disabled: false,
    href: "/employees",
  },
  {
    title: `${employeeController.currentEmployee?.name}`,
    disabled: true,
  },
]);

const tabs = reactive([
  {
    title: "Dados Pessoais",
    icon: "ri-user-line",
    value: "1",
  },
  {
    title: "Documentos",
    icon: "ri-file-text-line",
    value: "2",
  },
]);

const activeTab = ref("1");

const fields = reactive<IField[]>([
  {
    model:"id",
    label: "ID",
    type: "text",
    condition: [ () => false]
  },
  {
    model: "name",
    label: "Nome",
    type: "text",
    rules: [(v: string) => !!v || "Campo obrigatório"],
    md: 12,
  },
  {
    model: "cpf",
    label: "CPF",
    type: "text",
    rules: [(v: string) => !!v || "Campo obrigatório"],
    md: 12,
    disabled: true,
    maskType: "cpf",
  },
  {
    model: "email",
    label: "E-mail",
    type: "text",
    rules: [
      (v: string) => !!v || "Campo obrigatório",
      (v: string) => /.+@.+\..+/.test(v) || "E-mail inválido",
    ],
    placeholder: "E-mail da empresa",
    md: 12,
  },
  {
    model: "phone",
    label: "Telefone",
    type: "text",
    rules: [(v: string) => !!v || "Campo obrigatório"],
    placeholder: "(xx) xxxxx-xxxx",
    md: 12,
    maskType: "phone",
  },
]);

onMounted(async () => {
  await employeeController.getEmployeeById(props.id);
});

onUnmounted(() => {
  employeeController.state.currentEmployee = null;
});

const updateEmployee = async () => {
  const updated = fieldsToData(fields);
  await employeeController.updateEmployee(updated as IEmployee);
};


const handleFieldUpdate = (field: IField, value: any) => {
  if (employeeController.currentEmployee) {
    const key = field.model as keyof IEmployeeDetail;
    (employeeController.currentEmployee as any)[key] = value;
  }
};

</script>

<template>
  <VMain v-if="employeeController.currentEmployee">
    <VBreadcrumbs class="px-0 text-body-2" :items="items"></VBreadcrumbs>
    <VDivider class="mb-4" />
    <VRow>
      <VCol cols="12" md="8">
        <VCard class="d-flex flex-column">
          <VAvatar class="mx-6 my-4" size="150" color="grey-200">
            <VIcon> ri-user-line </VIcon>
          </VAvatar>

          <div class="d-flex justify-space-between align-end flex-wrap">
            <VCardTitle class="px-6 py-0">
                <p class="ma-0">
                  {{ employeeController.currentEmployee.name }}
                </p>
                <VCardSubtitle class="pa-0">
                  <p class="ma-0">
                    {{ employeeController.currentEmployee.email }}
                  </p>
                </VCardSubtitle>
              </VCardTitle>

              <VTabs class="mx-6" v-model="activeTab" density="compact">
                <VTab v-for="tab in tabs" :key="tab.value" :value="tab.value">
                  <VIcon>
                    {{ tab.icon }}
                  </VIcon>
                </VTab>
              </VTabs>
          </div>

          <VCardText>
            <VTabsWindow v-model="activeTab">
              <VTabsWindowItem value="1">
                <GenericFormFlat
                  :fields="fields"
                  :initial-data="employeeController.currentEmployee"
                  no-action-buttons
                  no-padding
                  @updateField="handleFieldUpdate($event.field, $event.value)"
                />
                <VCardActions>
                  <VBtn @click="updateEmployee()" variant="flat" block> Salvar </VBtn>
                </VCardActions>
              </VTabsWindowItem>
              <VTabsWindowItem value="2">
                <DocumentsSection />
              </VTabsWindowItem>
            </VTabsWindow>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" md="4">
        <GenericEditAddress
          :initial-data="employeeController.currentEmployee.address"
          :item-id="employeeController.currentEmployee.id"
          :edit-function="() => console.log('a')"
        />
      </VCol>
    </VRow>
  </VMain>
</template>
