<script setup lang="ts">
import GenericFormFlat from "@/@core/components/generic/GenericFormFlat.vue";
import { handleErrorMessage, showMessage } from "@/@core/helpers";
import { fieldsToData } from "@/@core/helpers/fields";
import { formatBrl, formatBrlToInput, parseFormattedValue } from "@/@core/helpers/formatters";
import { validateFields } from "@/@core/helpers/validate";
import { IField } from "@/@core/interfaces/genericForms";
import { useContractController } from "@/contracts/controller/contractController";
import { usePlanController } from "@/contracts/controller/planController";
import { IPlanService } from "@/contracts/entities/plan";
import { onMounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify";

const planController = usePlanController();
const contractController = useContractController()

const router = useRouter()

const props = defineProps<{
  id: string;
}>();

const { mdAndUp } = useDisplay()

const initialData = {
  start_date: new Date(),
  custom: false,
  observations: ""
};

const customizePlan = ref(false);

const fields = reactive<IField[]>([
  {
    model: "number",
    label: "Número do Contrato",
    type: "text",
    rules: [(v: string) => !!v || "Campo obrigatório"],
    md: 12,
  },
  {
    model: "start_date",
    label: "Data de Início",
    type: "date",
    rules: [(v: string) => !!v || "Campo obrigatório"],
    md: 12,
  },
  {
    model: "end_date",
    label: "Data de Término",
    type: "date",
    rules: [(v: string) => !!v || "Campo obrigatório"],
    md: 12,
  },
  {
    model: "payment_day",
    label: "Dia do Vencimento",
    type: "text",
    rules: [
      (v: string) => !!v || "Campo obrigatório",
      (v: string) => (Number(v) > 0 && Number(v) < 16) || "Dia inválido",
    ],
    md: 12,
    placeholder: "Escolha um dia entre 1 e 15",
  },
  {
    model: "observations",
    label: "Observações",
    type: "textarea",
    md: 12
  },
  {
    model: "custom",
    label: "Personalizar Plano",
    type: "checkbox",
    value: false,
  },
]);

const selectedPlan = reactive<any | null>({
  id: null,
  name: null,
  plan_type: null,
  price: null,
  services: [],
});

const selectPlan = (plan: any) => {
  plan.services = plan.services.map((service: IPlanService) => ({
    ...service,
    price: formatBrl(service.price),
  }));
  Object.assign(selectedPlan, JSON.parse(JSON.stringify(plan)));
}

const createContract = async () => {
  if (!validateFields(fields)) {
    return;
  }
  const data = fieldsToData(fields)
  data.client = props.id
  data.plan = selectedPlan.id
  data.services = selectedPlan.services.map((service: any) => ({
    ...service,
    price: parseFormattedValue(service.price),
  }))
  data.start_date = new Date(data.start_date).toISOString().split("T")[0]
  data.end_date = new Date(data.end_date).toISOString().split("T")[0]
  data.payment_day = Number(data.payment_day)
  try {
    await contractController.createContract(data)
    router.push({
      name: "clients-detail",
      params: {
        id: props.id,
      },
    }).then(() => {
      showMessage("Contrato criado com sucesso", "success")
    })
  } catch(error) {
    handleErrorMessage(error)
  }
}

watch(
  () => fields.at(-1)?.value,
  (newValue: boolean) => {
    customizePlan.value = newValue;
    if (!newValue) {
      const plan = planController.plans.find((plan) => plan.id === selectedPlan?.id);
      if (plan) {
        Object.assign(selectedPlan, JSON.parse(JSON.stringify(plan)));
      }
    }
  },
);

onMounted(async () => {
  await planController.getPlans();
});
</script>

<template>
  <VMain>
    <VRow>
      <VCol cols="12" md="6" class="order-2 order-md-1">
        <VCard variant="text" min-height="80vh" class="border-0">
          <VCardText>
            <div class="d-flex flex-column pa-2 my-5">
              <p class="text-h6">Crie um novo contrato</p>
              <VDivider class="pb-5" />
              <GenericFormFlat
                :fields="fields"
                :initial-data="initialData"
                no-action-buttons
                no-padding
                no-border
              />
            </div>

            <div class="d-flex flex-column pa-2 my-5" v-if="selectedPlan">
              <p class="text-h6">Serviços disponiveis</p>

              <VDivider class="pt-5" />

              <div>
                <VList
                  class="d-flex flex-column ga-2 bg-transparent"
                  v-if="selectedPlan?.services.length"
                >
                  <VListItem
                    v-for="service in selectedPlan?.services"
                    :key="service.id"
                  >
                    <template #prepend>
                      <span v-if="customizePlan">
                        <div class="d-flex align-center flex-column">
                          <VIcon @click="service.quantity++">
                            ri-arrow-drop-up-fill
                          </VIcon>

                          <p class="ma-0">
                            {{ service.quantity }}
                          </p>

                          <VIcon
                            @click="service.quantity--"
                            :disabled="service.quantity <= 1"
                          >
                            ri-arrow-drop-down-fill
                          </VIcon>
                        </div>
                      </span>
                      <span v-else class="d-flex align-center">
                        <p class="text-h6 mb-0">
                          {{ service.quantity }}
                        </p>
                      </span>
                      <VDivider vertical class="mx-4" />
                    </template>

                    <VListItemTitle>
                      {{ service.description }}
                    </VListItemTitle>
                    <VListItemSubtitle v-if="!customizePlan">
                      R$ {{ formatBrl(service.price) }}
                    </VListItemSubtitle>

                    <template #append>
                      <VTextField
                        v-if="customizePlan"
                        width="100"
                        v-model="service.price"
                        type="text"
                        density="compact"
                        suffix="R$"
                        @update:model-value="
                          (value) => (service.price = formatBrlToInput(value))
                        "
                      />
                    </template>
                  </VListItem>
                </VList>
                <p v-else class="text-center my-5">
                  Nenhum serviço disponivel no plano selecionado
                </p>
              </div>
            </div>
          </VCardText>

          <VCardActions>
            <VRow class="px-4">
              <VCol cols="12" md="6">
                <VBtn
                  variant="flat"
                  color="primary"
                  @click="createContract"
                  :disabled="!selectedPlan"
                  block
                >
                  Criar contrato
                </VBtn>
              </VCol>
              <VCol cols="12" md="6">
                <VBtn variant="outlined" color="" @click="$emit('close')" block>
                  Cancelar
                </VBtn>
              </VCol>
            </VRow>
          </VCardActions>
        </VCard>
      </VCol>
      <VCol
        cols="12"
        md="6"
        class="order-1 order-md-2 d-flex align-center justify-center rounded-lg"
        :class="{
          'bg-grey-200': mdAndUp
        }"
      >
        <VCard class="rounded-lg" max-width="600" width="100%">
          <VCardTitle class="bg-primary text-white pa-6">
            Escolha um plano
          </VCardTitle>

          <VCardText>
            <VList
              class="d-flex flex-column ga-4 py-4 overflow-y-auto"
              max-height="70vh"
            >
              <VListItem
                v-for="plan in planController.plans"
                :key="plan.id"
                variant="outlined"
                rounded
                class="py-4 cursor-pointer"
                :class="{
                  'selected-plan': selectedPlan?.id === plan.id,
                }"
                @click="selectPlan(plan)"
              >
                <VListItemTitle>
                  R$ {{ formatBrl(plan.price) }} / {{ plan.plan_type }}
                </VListItemTitle>
                <VListItemSubtitle>
                  {{ plan.name }}
                </VListItemSubtitle>
              </VListItem>
            </VList>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </VMain>
</template>

<style scoped lang="scss">
.selected-plan {
  border: 2px solid rgb(var(--v-theme-primary)) !important;
}
</style>
