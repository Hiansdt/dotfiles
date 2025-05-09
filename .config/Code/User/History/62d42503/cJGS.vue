<script setup lang="ts">
import GenericDeleteDialog from "@/@core/components/generic/GenericDeleteDialog.vue";
import { handleErrorMessage, showMessage } from "@/@core/helpers";
import { useCashController } from "@/cash/controller/cashController";
import { useSessionController } from "@/sessions/controller/sessionController";
import { useRouter } from "vue-router";

const sessionController = useSessionController();
const cashController = useCashController();

const router = useRouter();

const isDialogVisible = defineModel("isDialogVisible", {
  type: Boolean,
  default: false,
});

const toggleDialog = (value: boolean) => {
  isDialogVisible.value = value;
};

const getOrOpenCash = async () => {
  await cashController.getCashesByStatus("ABERTO");
  if (!cashController.cashes.length) {
    await cashController.openCash();
    await cashController.getCashesByStatus("ABERTO");
  }
  return cashController.cashes[0]
}

const cancelSession = async () => {
  try {
    const cash = await getOrOpenCash();
    await sessionController.cancelSession(
      sessionController.currentSession?.id as string,
      cash.id
    );
    toggleDialog(false);
    router
      .push({
        name: "sessions",
      })
      .then(() => {
        showMessage("Sessão cancelada com sucesso", "warning");
      });
  } catch (error) {
    handleErrorMessage(error);
  }
};
</script>

<template>
  <GenericDeleteDialog
    key-word="sessão"
    :item-name="sessionController.currentSession?.title ?? ''"
    action-verb="cancelar"
    :is-dialog-visible="isDialogVisible"
    @update:is-dialog-visible="toggleDialog"
    @cancel="toggleDialog(false)"
    @confirm="cancelSession"
  />
</template>
