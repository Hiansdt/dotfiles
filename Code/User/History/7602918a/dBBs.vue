<script setup lang="ts">
import GenericForm from "@/@core/components/generic/GenericForm.vue";
import { IField } from "@/@core/interfaces/genericForms";
import { IPaymentMethod } from "@/cash/entities/paymentMethod";
import { computed, PropType, reactive, watch } from "vue";

const props = defineProps({
  item: {
    type: Object as PropType<IPaymentMethod>,
    required: true,
  },
  loading: Boolean,
  isDialogVisible: Boolean,
});

const emits = defineEmits([
  "update:isDialogVisible",
  "formSubmit",
  "cancel-edit",
]);

const initialData = computed(() => {
  return {
    ...props.item,
    has_addition: props.item.tax_type && props.item.tax_value ? true : false,
  };
});



const editFields = reactive<IField[]>([
  {
    label: "Descrição",
    model: "description",
    type: "text",
    value: null,
    rules: [(v: string) => !!v || "Campo obrigatório"],
    md: 12,
    error: "",
  },
  {
    label: "É convênio?",
    model: "is_contract",
    type: "checkbox",
    value: null,
    md: 6,
  },
  {
    label: "Tem Acréscimo?",
    model: "has_addition",
    type: "checkbox",
    value: false,
    md: 6,
  },
  {
    label: "Tipo de acréscimo",
    model: "tax_type",
    type: "select",
    items: [
      { text: "PERCENTUAL", value: "PERCENTUAL" },
      { text: "FIXO", value: "FIXO" },
    ],
    value: props.item.tax_type,
    rules: [(v: string) => !!v || "Campo obrigatório"],
    md: 6,
    error: "",
    condition: [(): boolean => editFields[2].value],
  },
  {
    label: "Valor do acréscimo",
    model: "tax_value",
    type: "text",
    value: props.item.tax_value,
    maskType: "brl",
    rules: [(v: string) => !!v || "Campo obrigatório"],
    md: 6,
    error: "",
    condition: [(): boolean => editFields[2].value],
    prefix: "",
    suffix: "",
  },
  {
    label: "ID",
    model: "id",
    type: "text",
    value: null,
    md: 12,
    disabled: true,
    condition: [() => false],
  },
]);

watch(
  () => editFields[3]?.value,
  async (newValue) => {
    if (newValue === "FIXO") {
      editFields[4].prefix = "R$";
      editFields[4].suffix = "";
    } else {
      editFields[4].prefix = "";
      editFields[4].suffix = "%";
    }
  },
);

const dialogVisibleUpdate = (val: boolean) => {
  emits("update:isDialogVisible", val);
};

watch(
  () => initialData.value.tax_type,
  () => {
    if (
      initialData.value.tax_type == "FIXO" ||
      initialData.value.tax_type == "PERCENTUAL"
    ) {
      editFields[2].value = true;
    }
  },
);

watch(
  () => initialData.value.tax_type,
  () => {
    if (
      initialData.value.tax_type == "FIXO" ||
      initialData.value.tax_type == "PERCENTUAL"
    ) {
      editFields[2].value = true;
    }
  },
);
</script>

<template>
  <GenericForm
    title="Editar forma de pagamento"
    v-model:isDialogVisible="props.isDialogVisible"
    :initial-data="initialData"
    @update:is-dialog-visible="dialogVisibleUpdate"
    :fields="editFields"
    :loading="props.loading"
    @submit="(value) => emits('formSubmit', value)"
    @cancel="emits('cancel-edit')"
  />
</template>
