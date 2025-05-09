<script setup lang="ts">
import AddDocuments from "@/@core/components/global/AddDocuments.vue";
import { showMessage } from "@/@core/helpers";
import { usePaymentMethodController } from "@/cash/controller/paymentMethodController";
import { useSessionController } from "@/sessions/controller/sessionController";
import { computed, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";

const sessionController = useSessionController();
const paymentMethodController = usePaymentMethodController();
const router = useRouter();

const isDialogVisible = defineModel("isDialogVisible", {
  type: Boolean,
  default: false,
});

const form = ref<any>(null);

const data = reactive({
  observations: "",
  documents: [],
});

const paymentMethods = computed(() => paymentMethodController.paymentMethods.map((paymentMethod) => ({
  name: paymentMethod.description,
  value: paymentMethod.id
})))

console.log(paymentMethods)

const completeSession = async () => {
  try {
    if (!form.value) return;
    const { valid } = await form.value.validate();
    if (!valid) return;

    const formData = new FormData();

    formData.append("evolution", data.observations);
    data.documents.forEach((document: any, index) => {
      formData.append(`document[${index}][description]`, document.description);
      formData.append(`document[${index}][file]`, document.file);
    });

    await sessionController.completeSession(
      sessionController.currentSession?.id as string,
      formData,
    );

    if (sessionController.state.currentSession) {
      sessionController.state.currentSession.completed = true;
    }

    router
      .push({
        name: "sessions",
      })
      .then(() => {
        showMessage("Sessão concluída com sucesso", "success");
      });
  } catch (error) {
    console.error("Error completing session:", error);
  }
};

onMounted(async () => {
  await paymentMethodController.getPaymentMethods();
})
</script>

<template>
  <VDialog max-width="800" v-model="isDialogVisible">
    <VCard>
      <VCardTitle class="d-flex align-center justify-space-between pb-0">
        <p class="ma-0 font-weight-bold">Concluir Sessão</p>

        <IconBtn @click="isDialogVisible = false">
          <VIcon> ri-close-line </VIcon>
        </IconBtn>
      </VCardTitle>

      <VCardSubtitle>
        <p>
          Você tem certeza que deseja concluir a sessão? Essa ação não pode ser
          desfeita.
        </p>
      </VCardSubtitle>

      <VDivider />

      <VCardText>
        <VForm ref="form" @submit.prevent="completeSession">
          <VTextarea
            v-model="data.observations"
            label="Observações"
          />

          <VSelect
            :items=paymentMethods
          >

          </VSelect>

          <AddDocuments v-model:documents="data.documents" />

          <div>
            <VRow>
              <VCol cols="6">
                <VBtn
                  color=""
                  variant="outlined"
                  block
                  @click="isDialogVisible = false"
                >
                  Cancelar
                </VBtn>
              </VCol>
              <VCol cols="6">
                <VBtn variant="flat" block type="submit"> Concluir </VBtn>
              </VCol>
            </VRow>
          </div>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
