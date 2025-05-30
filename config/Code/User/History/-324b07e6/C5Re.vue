<script setup lang="ts">
import GenericFormFlat from '@/@core/components/generic/GenericFormFlat.vue';
import { handleErrorMessage } from '@/@core/helpers';
import { parseFormattedValue } from '@/@core/helpers/formatters';
import { IField } from '@/@core/interfaces/genericForms';
import { useServiceController } from '@/clinic/controller/serviceController';
import { IListService } from '@/clinic/entities/service';
import { PropType, reactive, ref } from 'vue';

const serviceController = useServiceController()

const showDialog = defineModel("showDialog", {
  default: false,
  type: Boolean,
})
const activeService = defineModel("activeService", {
  default: null,
  type: Object as PropType<IListService | null>,
})

const fields = reactive<IField[]>([
  {
    label: "ID",
    model: "id",
    type: "text",
    md: 12,
    condition: [() => false],
  },
  {
    label: "Descrição",
    model: "description",
    type: "text",
    md: 12,
    rules: [
      (v: string) => !!v || "Campo obrigatório",
    ],
  },
  {
    model: "price",
    label: "Preço",
    type: "text",
    md: 12,
    rules: [
      (v: string) => !!v || "Campo obrigatório",
    ],
    maskType: "brl"
  }
])


const activeTab = ref(0)

const tabs = [
  {
    title: "Geral",
    value: 0,
  },
  {
    title: "Preços",
    value: 1,
  }
]

const edit = async (data: any) => {
  try {
    data.price = parseFormattedValue(data.price)
    const service = await serviceController.editService(data);
    const index = serviceController.services.findIndex((item) => item.id === data.id);
    if (index != -1) {
      serviceController.services[index] = service
    }
    showDialog.value = false;
  } catch (error) {
    handleErrorMessage(error);
  }
}
</script>

<template>
  <VTabs v-model="activeTab">
    <VTab v-for="tab in tabs" :key="tab.value" :value="tab.value">
      {{ tab.title }}
    </VTab>
  </VTabs>

  <VTabsWindow v-model="activeTab">
    <VTabsWindowItem>
      <GenericFormFlat title="Editar Serviço" v-model:is-dialog-visible="showDialog" :fields="fields"
        :initial-data="activeService ?? {}" @submit="edit" />

    </VTabsWindowItem>
    <VTabsWindowItem>
    </VTabsWindowItem>
  </VTabsWindow>

</template>
