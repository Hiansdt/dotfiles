<script setup lang="ts">
import GenericForm from '@/@core/components/generic/GenericForm.vue';
import { handleErrorMessage } from '@/@core/helpers';
import { parseFormattedValue } from '@/@core/helpers/formatters';
import { IField } from '@/@core/interfaces/genericForms';
import { useServiceController } from '@/clinic/controller/serviceController';
import { IListService } from '@/clinic/entities/service';
import { PropType, reactive } from 'vue';

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
    <GenericForm
        title="Editar Serviço"
        v-model:is-dialog-visible="showDialog"
        :fields="fields"
        :initial-data="activeService ?? {}"
        @submit="edit"
    />
</template>