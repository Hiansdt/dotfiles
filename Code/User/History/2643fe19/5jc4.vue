<script setup lang="ts">
import GenericForm from '@/@core/components/generic/GenericForm.vue';
import { handleErrorMessage } from '@/@core/helpers';
import { parseFormattedValue } from '@/@core/helpers/formatters';
import { IField } from '@/@core/interfaces/genericForms';
import { useServiceController } from '@/clinic/controller/serviceController';
import { useServiceTypeController } from '@/clinic/controller/serviceTypeController';
import { reactive } from 'vue';

const serviceController = useServiceController()

const showDialog = defineModel("showDialog", {
    default: false,
    type: Boolean,
})

const fields = reactive<IField[]>([
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
    },
    {
        model: "service_type",
        label: "Tipo de Serviço",
        type: "searchAutocomplete",
        md: 12,
        rules: [
            (v: string) => !!v || "Campo obrigatório",
        ],
        itemValue: "id",
        itemTitle: "description",
        searchFunction: useServiceTypeController().searchServiceTypes
    }
])

const create = async (data: any) => {
    try {
        data.price = parseFormattedValue(data.price)
        await serviceController.createService(data);
        await serviceController.getServices();
        showDialog.value = false;
    } catch (error) {
        handleErrorMessage(error);
    }
}
</script>

<template>
    <GenericForm
        title="Criar Serviço"
        v-model:is-dialog-visible="showDialog"
        :fields="fields"
        @submit="create"
    />
</template>