<script setup lang="ts">
import GenericEditAddress from "@/@core/components/generic/GenericEditAddress.vue";
import GenericFormFlat from "@/@core/components/generic/GenericFormFlat.vue";
import { handleErrorMessage, showMessage } from "@/@core/helpers";
import { validateFields } from "@/@core/helpers/validate";
import { IField } from "@/@core/interfaces/genericForms";
import { useTenantController } from "@/tenant/controller/tenantController";
import { computed, onMounted, onUnmounted, reactive } from "vue";
import { useDisplay } from 'vuetify'

const { mdAndUp } = useDisplay()

const tenantController = useTenantController();

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const items = computed(() => [
  {
    title: "Empresas",
    disabled: false,
    href: "/tenants",
  },
  {
    title: `Empresa ${tenantController.currentTenant?.name}`,
    disabled: true,
  },
]);

const fields = reactive<IField[]>([
  {
    model: "name",
    label: "Nome",
    type: "text",
    rules: [(v: string) => !!v || "Campo obrigatório"],
    placeholder: "Nome da empresa",
    md: 12,
  },
  {
    model: "trade_name",
    label: "Nome Fantasia",
    type: "text",
    rules: [(v: string) => !!v || "Campo obrigatório"],
    placeholder: "Nome da fantasia empresa",
    md: 12,
  },
  {
    model: "cnpj",
    label: "CNPJ",
    type: "text",
    rules: [(v: string) => !!v || "Campo obrigatório"],
    placeholder: "CNPJ da empresa",
    md: 12,
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

const updateClinic = async () => {
  if (!validateFields(fields)) {
    return;
  }
  
  try {
    // await clinicController.updateClinic(clinicData.id, clinicData);
    showMessage("Empresa atualizada com sucesso", "success");
  } catch (error) {
    console.error("Error updating clinic:", error);
    handleErrorMessage(error);
  }
};

onMounted(async () => {
  await tenantController.getTenantById(props.id);
});

onUnmounted(() => {
  tenantController.state.currentTenant = null
})
</script>

<template>
  <VMain v-if="tenantController.currentTenant">
    <VBreadcrumbs class="px-0 text-body-2" :items="items"></VBreadcrumbs>
    <VRow>
      <VCol cols="12">
        <p class="text-h5 ma-0">Perfil da Empresa</p>
      </VCol>

      <VCol class="d-flex flex-column ga-6" cols="12" md="6">
        <VCard variant="text" class="d-flex flex-column ga-2">
          <VCardTitle class="pa-0 font-weight-bold">
            Foto de Perfil da Empresa
          </VCardTitle>

          <VCardText class="d-flex ga-4 align-center flex-wrap pa-0" :class="{ 'justify-center': !mdAndUp }">
            <VAvatar size="150" class="ma-2">
              <VImg
                src="https://cdn.vuetifyjs.com/images/lists/1.jpg"
                aspect-ratio="1"
              />
            </VAvatar>
            <div class="d-flex flex-column align-center">
              <VBtn color="primary" class="ma-2" width="200">
                Alterar Foto
              </VBtn>
              <VBtn
                prepend-icon="ri-delete-bin-line"
                variant="outlined"
                color="red"
                class="ma-2"
                width="200"
              >
                Remover Foto
              </VBtn>
            </div>
          </VCardText>
        </VCard>

        <VCard variant="text" class="d-flex flex-column ga-4 pa-0">
          <VCardText class="pa-0">
            <GenericFormFlat
              :initial-data="tenantController.currentTenant"
              :fields="fields"
              no-padding
              no-action-buttons
            />
          </VCardText>
          <VCardActions>
            <VBtn block variant="flat" @click="updateClinic"> Salvar </VBtn>
          </VCardActions>
        </VCard>
      </VCol>

      <VCol cols="12" md="6">
        <GenericEditAddress
          :initial-data="tenantController.currentTenant.address"
          :item-id="tenantController.currentTenant.id"
          :edit-function="updateClinic"
        />
      </VCol>
    </VRow>
  </VMain>
</template>
