<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useDate } from "vuetify";
import { formatBrl } from "@/@core/helpers/formatters";
import { useClientController } from "@/clients/controller/clientController";
import { IListSessionPayment } from "@/sessions/entities/sessionPayment";
import GenericDeleteDialog from "@/@core/components/generic/GenericDeleteDialog.vue";
import { handleErrorMessage, showMessage } from "@/@core/helpers";
import { useSessionPaymentController } from "@/sessions/controller/sessionPaymentController";
import { IField } from "@/@core/interfaces/genericForms";
import { usePaymentMethodController } from "@/cash/controller/paymentMethodController";

const clientController = useClientController();
const sessionPaymentController = useSessionPaymentController();
const paymentMethodController = usePaymentMethodController();

const activePayment = ref<IListSessionPayment | null>(null);
const showPayModal = ref<boolean>(false);

const togglePayModel = (
  value: boolean,
  item: IListSessionPayment | null = null,
) => {
  showPayModal.value = value;
  activePayment.value = item;
};

const paySessionPayment = async () => {
  if (!activePayment.value?.id) {
    showMessage("Erro ao realizar pagamento", "error");
    return;
  }

  try {
    const sessionPayment = await sessionPaymentController.paySessionPayment(
      activePayment.value.id,
    );
    const index = clientController.currentClient?.session_payments.findIndex(
      (item) => item.id === sessionPayment.id,
    );
    if (index !== undefined && index >= 0) {
      if (clientController.currentClient) {
        clientController.currentClient.session_payments[index] = sessionPayment;
      }
    }
    showMessage("Pagamento realizado com sucesso", "success");
    togglePayModel(false);
  } catch (error) {
    handleErrorMessage(error);
  }
};

const paymentMethods = computed(() =>
  paymentMethodController.paymentMethods.map((paymentMethod) => ({
    name: paymentMethod.description,
    value: paymentMethod.id
  })),
);

const paymentFields = ref<IField[]>([
  {
    label: "Forma de Pagamento",
    md: 12,
    model: "payment_method",
    type: "select",
    rules: [],
    error: "",
    items: paymentMethods.value
  },
]);

const updateFieldPayment = async ({
  field,
  value,
}: {
  field: string;
  value: any;
}) => {
  try {
    paymentFields.value.forEach((f: IField) => {
      if (f.model == field) {
        f.error = "";
      }
    });
  } catch (e) {
    handleErrorMessage(e);
  }
};

onMounted(async () => {
  await paymentMethodController.getPaymentMethods();
});
</script>

<template>
  <VCard class="mt-4">
    <VCardTitle> Pagamentos </VCardTitle>

    <VDivider class="mx-4" />

    <VCardText>
      <VList
        class="d-flex flex-column ga-2 bg-transparent"
        style="max-height: 300px; overflow-y: auto"
      >
        <template
          v-if="clientController.currentClient?.session_payments.length"
        >
          <VListItem
            v-for="payment in clientController.currentClient.session_payments"
            :key="payment.id"
            class="px-0"
          >
            <template #prepend>
              <IconBtn color="warning" class="mr-2" v-if="!payment.paid">
                <VIcon> ri-time-line </VIcon>

                <VTooltip activator="parent" location="bottom">
                  Aguardando pagamento
                </VTooltip>
              </IconBtn>

              <IconBtn color="success" class="mr-2" v-else>
                <VIcon> ri-check-line </VIcon>

                <VTooltip activator="parent" location="bottom"> Pago </VTooltip>
              </IconBtn>
            </template>

            <VListItemTitle>
              {{ payment.service }}
              <VListItemSubtitle>
                {{ payment.session }} -
                {{ useDate().format(payment.date, "keyboardDate") }}
                {{ payment.is_contract ? " - Contrato" : "" }}
              </VListItemSubtitle>
            </VListItemTitle>

            <template #append>
              <div class="d-flex align-center ga-2">
                <span> R$ {{ formatBrl(payment.price) }} </span>
                <IconBtn
                  color="success"
                  v-if="!payment.paid"
                  @click="togglePayModel(true, payment)"
                >
                  <VIcon>ri-check-line</VIcon>
                </IconBtn>
              </div>
            </template>
          </VListItem>
        </template>

        <p v-else class="ma-0 w-100 text-center">Nenhum pagamento pendente</p>
      </VList>
    </VCardText>
  </VCard>

  <GenericForm> </GenericForm>

  <GenericForm
    v-model:isDialogVisible="showPayModal"
    title="Pagar Sessão"
    :fields="paymentFields"
    @submit="paySessionPayment"
    @update-field="updateFieldPayment"
    @update:is-dialog-visible="(v: boolean) => togglePayModel(false, v)"
  />
</template>
