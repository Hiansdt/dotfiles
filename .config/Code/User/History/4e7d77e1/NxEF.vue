<script setup>
import { ref } from "vue";
import { usePaymentMethodController } from "@/cash/controller/paymentMethodController";
import ListPaymentMethod from "../../components/paymentMethod/ListPaymentMethod.vue";
import DeleteDialog from "@/@templates/components/dialogs/DeleteDialog.vue";
import EditPaymentMethod from "../../components/paymentMethod/EditPaymentMethod.vue";
import CreatePaymentMethod from "../../components/paymentMethod/CreatePaymentMethod.vue";
import GenericDeleteDialog from "@/@core/components/generic/GenericDeleteDialog.vue";
import { parseFormattedValue } from "@/@core/helpers/formatters";

const paymentMethodController = usePaymentMethodController();

const showDeleteDialog = ref(false);
const showEditDialog = ref(false);
const showCreateDialog = ref(false);

const activePaymentMethod = ref({
  id: "",
  description: "",
  is_contract: "",
});

const toggleDeleteDialog = (value, item) => {
  showDeleteDialog.value = value;
  if (value) {
    activePaymentMethod.value = item;
  } else {
    setTimeout(() => {
      activePaymentMethod.value = {
        id: "",
        description: "",
        is_contract: "",
      };
    }, 500);
  }
};

const deletePaymentMethod = async () => {
  try {
    await paymentMethodController.deletePaymentMethod(
      activePaymentMethod.value.id,
    );
    showDeleteDialog.value = false;
  } catch (error) {
    console.error(error);
  }
};

const toggleEditDialog = (item, value) => {
  showEditDialog.value = value;
  if (value) {
    activePaymentMethod.value = item;
  } else {
    setTimeout(() => {
      activePaymentMethod.value = {
        id: "",
        description: "",
        is_contract: "",
      };
    }, 300);
  }
};

const editPaymentMethod = async (value) => {
  try {
    await paymentMethodController.updatePaymentMethod(value.id, {...value, tax_value: parseFormattedValue(value.tax_value)});
    showEditDialog.value = false;
  } catch (error) {
    paymentMethodController.state.loading = false
    console.error(error);
    handleErrorMessage(e)
  }
};
</script>

<template>
  <ListPaymentMethod
    @open:delete-dialog="(item) => toggleDeleteDialog(true, item)"
    @open:edit-dialog="(item) => toggleEditDialog(item, true)"
    @open:create-dialog="showCreateDialog = true"
  />

  <GenericDeleteDialog
    :isDialogVisible="showDeleteDialog"
    keyWord="pagamento"
    :itemName="activePaymentMethod.description"
    @confirm="deletePaymentMethod"
    @cancel="toggleDeleteDialog(false)"
  />
  <EditPaymentMethod
    :is-dialog-visible="showEditDialog"
    :item="activePaymentMethod"
    @cancel-edit="toggleEditDialog(null, false)"
    @update:is-dialog-visible="(val) => (showEditDialog = val)"
    @form-submit="editPaymentMethod"
    :loading="paymentMethodController.loading"
  />

  <CreatePaymentMethod
    v-model:show-modal="showCreateDialog"
    @cancel-create="showCreateDialog = false"
  />
</template>
