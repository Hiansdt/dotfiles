<script lang="ts" setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { IField } from "@/@core/interfaces/genericForms";
import GenericFormFlat from "@/@core/components/generic/GenericFormFlat.vue";
import GenericAddressFlat from "@/@core/components/generic/GenericAddressFlat.vue";
import { validateFields } from "@/@core/helpers/validate";
import { handleErrorMessage } from "@/@core/helpers";
import { useClientController } from "@/clients/controller/clientController";

defineProps({
  variant: {
    type: String,
    default: "outlined",
  },
});

const router = useRouter();

const clientController = useClientController();

const fields = reactive<IField[]>([
  {
    model: "name",
    label: "Nome",
    type: "text",
    rules: [
      (v: string) => {
        return !!v || "Campo Obrigatório!";
      },
    ],
    md: 6,
  },
  {
    model: "occupation",
    label: "Ocupação",
    type: "text",
    rules: [
      (v: string) => {
        return !!v || "Campo Obrigatório!";
      },
    ],
    md: 6,
  },
  {
    model: "email",
    label: "E-mail",
    type: "text",
    rules: [
      (v: string) => {
        return !!v || "Campo Obrigatório!";
      },
      (v: string) => {
        return /.+@.+\..+/.test(v) || "E-mail inválido!";
      },
    ],
    md: 6,
  },
  {
    model: "phone",
    label: "Telefone",
    type: "text",
    rules: [
      (v: string) => {
        return !!v || "Campo Obrigatório!";
      },
    ],
    md: 6,
    maskType: "phone",
  },
  {
    model: "cpf",
    label: "CPF",
    type: "text",
    rules: [
      (v: string) => {
        return !!v || "Campo Obrigatório!";
      },
    ],
    md: 6,
    maskType: "cpf",
  },
  {
    model: "birthdate",
    label: "Data de Nascimento",
    type: "date",
    rules: [
      (v: string) => {
        return !!v || "Campo Obrigatório!";
      },
      (v: string) => {
        return new Date(v) < new Date() || "Data inválida!";
      }
    ],
  },
  {
    model: "knows_pilates",
    label: "Conhece os Serviços Prestados?",
    type: "checkbox",
    value: false
  }
]);

const address = ref({});

const fieldsToData = () => {
  const data: any = {};
  fields.forEach((field) => {
    if (field.model) {
      data[field.model] = field.value;
    }
  });
  return data;
}

const createClient = async () => {
  if (!validateFields(fields)) {
    return;
  }
  const data = fieldsToData();
  const client = {
    ...data,
    address: address.value,
    cpf: data.cpf.replace(/\D/g, ""),
    phone: data.phone.replace(/\D/g, ""),
    birthdate: new Date(data.birthdate).toISOString().split("T")[0],
    knows_pilates: data.knows_pilates ? true : false,
  }
  try {
    await clientController.createClient(client)
    router.push({ name: "clients" });
  } catch(error) {
    handleErrorMessage(error);
  }
}
</script>

<template>
  <VMain>
    <VBreadcrumbs
      class="px-0 text-body-2"
      :items="[
        {
          title: 'Clientes',
          disabled: false,
          to: { name: 'clients' },
        },
        {
          title: 'Adicionar Cliente',
          disabled: true,
        },
      ]"
    ></VBreadcrumbs>

    <VDivider />

    <div class="d-flex flex-column ga-4 my-4">
      <VCard variant="text" class="border-0">
        <VCardTitle class="pl-3">
          Preencha as Informações do Cliente
        </VCardTitle>
        <GenericFormFlat :fields="fields" no-border no-padding no-action-buttons :initial-data="{
          knows_pilates: false,
        }" />
      </VCard>
      <VCard variant="text" class="border-0">
        <VCardTitle class="pl-3">
          Informações Adicionais
        </VCardTitle>
        <GenericAddressFlat v-model:value="address" no-border no-padding />
      </VCard>
      <div class="w-100 px-2">
        <VBtn block @click="createClient" color="primary" class="mt-3" variant="flat">
          Salvar
        </VBtn>
      </div>
    </div>
  </VMain>
</template>
