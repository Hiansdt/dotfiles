<script setup lang="ts">
import GenericEditAddress from "@/@core/components/generic/GenericEditAddress.vue";
import GenericFormFlat from "@/@core/components/generic/GenericFormFlat.vue";
import { handleErrorMessage, showMessage } from "@/@core/helpers";
import { fieldsToData } from "@/@core/helpers/fields";
import { validateFields } from "@/@core/helpers/validate";
import { IField } from "@/@core/interfaces/genericForms";
import { useAuthController } from "@/auth/controller/authController";
import { useClinicController } from "@/clinic/controller/clinicController";
import { onMounted, onUnmounted, reactive } from "vue";

const authController = useAuthController()
const clinicController = useClinicController()

const fields = reactive<IField[]>([
  {
    model: "name",
    label: "Nome",
    type: "text",
    rules: [(v: string) => !!v || "Campo obrigatório"],
    placeholder: "Nome da empresa",
    md: 4,
  },
  {
    model: "trade_name",
    label: "Nome Fantasia",
    type: "text",
    rules: [(v: string) => !!v || "Campo obrigatório"],
    placeholder: "Nome da fantasia empresa",
    md: 4,
  },
  {
    model: "phone",
    label: "Telefone",
    type: "text",
    rules: [(v: string) => !!v || "Campo obrigatório"],
    placeholder: "(xx) xxxxx-xxxx",
    md: 4,
    maskType: "phone",
  },
  {
    model: "cnpj",
    label: "CNPJ",
    type: "text",
    rules: [(v: string) => !!v || "Campo obrigatório"],
    placeholder: "CNPJ da empresa",
    md: 5,
    disabled: true,
    maskType: "cnpj",
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
    md: 7,
  },
]);

const updateClinic = async () => {
  if (!validateFields(fields)) {
    return
  }
  const fieldsData = fieldsToData(fields)
  const clinicData = {
    ...clinicController.currentClinic,
    ...fieldsData,
  };
  try {
    await clinicController.updateClinic(clinicData.id, clinicData);
    showMessage("Clínica atualizada com sucesso", "success");
  } catch (error) {
    console.error("Error updating clinic:", error);
    handleErrorMessage(error);
  }
};

onMounted(async () => {
  await clinicController.getClinic(authController.currentTenant.id)
})

onUnmounted(() => {
  clinicController.state.currentClinic = null
})
const breadcrums = [
  {
    title: "Gestão",
    disabled: false,
  },
  {
    title: "Minha Clinica",
    disabled: true,
  }
];
</script>

<template>
  <VBreadcrumbs class="px-0 text-body-2" :items="breadcrums" />
  <VMain v-if="clinicController.currentClinic">
    <VRow>
      <VCol cols="12">
        <p class="text-h5 ma-0">Perfil da Empresa</p>
      </VCol>

      <VCol class="d-flex flex-column ga-6 pr-5" cols="12" md="2">
          <VCardText class="d-flex flex-column ga-4 align-center px-0 py-5">
            <VAvatar size="150" class="ma-2">
              <VImg
                src="https://cdn.vuetifyjs.com/images/lists/1.jpg"
                aspect-ratio="1"
              />
            </VAvatar>
            <div class="d-flex flex-column align-center">
              <VBtn variant="tonal" color="primary" class="ma-2" width="200">
                Alterar Foto
              </VBtn>
              <VBtn
                prepend-icon="ri-delete-bin-line"
                variant="tonal"
                color="red"
                class="ma-2"
                width="200"
              >
                Remover Foto
              </VBtn>
            </div>
          </VCardText>
          
      </VCol>
      <VCol cols="12" md="10" class="px-0 py-5 my-5">
        <GenericFormFlat class="pa-5 mb-5" :initial-data="clinicController.currentClinic" :fields="fields" no-padding no-action-buttons />
        <GenericEditAddress
          :initial-data="clinicController.currentClinic.address"
          :item-id="clinicController.currentClinic.id"
          :edit-function="updateClinic"
        />
      </VCol>
    </VRow>
    <VSpacer />
    <VRow>
      <VCol cols="12">
        <VBtn block variant="flat" @click="updateClinic"> Salvar </VBtn>
      </VCol>
    </VRow>
  </VMain>
</template>
