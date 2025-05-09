<script setup lang="ts">
import GenericTable from "@/@core/components/generic/GenericTable.vue";
import { handleErrorMessage } from "@/@core/helpers";
import { defaultPagination } from "@/@core/helpers/defaultItems";
import { formatBrl } from "@/@core/helpers/formatters";
import { IHeader, IPagination } from "@/@core/interfaces/app";
import { useReportController } from "@/report/controller/reportController";
import { onMounted, reactive, ref, watch } from "vue";
import { useDate } from "vuetify";

const reportController = useReportController();

const date = reactive<{
  startDate: Date;
  endDate: Date;
}>({
  startDate: new Date(),
  endDate: new Date(),
});

const pagination = ref<IPagination>({
  ...defaultPagination,
});

const headers = ref<IHeader[]>([
  {
    id: 0,
    title: "Serviço",
    value: "service",
    sortable: true,
    isVisible: true,
    sequence: 0,
  },
  {
    id: 1,
    title: "Cliente",
    value: "client",
    sortable: true,
    isVisible: true,
    sequence: 1,
  },
  {
    id: 2,
    title: "Valor",
    value: "price",
    sortable: true,
    isVisible: true,
    sequence: 2,
  },
  {
    id: 3,
    title: "Pendente à",
    value: "created_at",
    sortable: true,
    isVisible: true,
    sequence: 3,
  },
]);

const getReport = async () => {
  try {
    await reportController.getReportSessionPaymentByDateRangeNotPaid(
      date.startDate.toISOString().split("T")[0],
      date.endDate.toISOString().split("T")[0],
    );

    pagination.value = {
      ...pagination.value,
      total: reportController.reportSessionPaymentNotPaid?.count || 0,
      numPages: Math.ceil(
        reportController.reportSessionPaymentNotPaid?.count ||
          0 / pagination.value.pageSize,
      ),
    };
  } catch (error) {
    handleErrorMessage(error);
  }
};

watch(
  () => date.startDate && date.endDate,
  async () => {
    if (date.startDate && date.endDate) {
      await getReport();
    }
  },
);

onMounted(async () => {
  date.startDate = useDate().startOfMonth(new Date()) as Date;
  date.endDate = useDate().endOfMonth(new Date()) as Date;
});
</script>

<template>
  <div
    class="d-flex flex-column px-4"
    v-if="reportController.reportSessionPaymentNotPaid"
  >
    <VRow class="py-2">
      <VCol class="d-flex" cols="12" md="8">
        <p class="ma-0 text-h5">Relatorios de Serviços Não Pagos</p>
      </VCol>

      <VCol class="d-flex" cols="12" md="4">
        <VRow>
          <VCol cols="6">
            <VDateInput
              v-model="date.startDate"
              label="Data Inicial"
              :rules="[(v) => !!v || 'Campo obrigatório']"
              :max="date.endDate"
              prepend-icon=""
            />
          </VCol>
          <VCol cols="6">
            <VDateInput
              v-model="date.endDate"
              label="Data Final"
              :rules="[(v) => !!v || 'Campo obrigatório']"
              :min="date.startDate"
              prepend-icon=""
            />
          </VCol>
        </VRow>
      </VCol>
    </VRow>

    <VDivider class="mb-4" />

    <GenericTable
      key-word="serviços"
      no-items-text="Nenhum serviço encontrado"
      v-model:items="reportController.reportSessionPaymentNotPaid.payments"
      v-model:headers="headers"
      v-model:pagination="pagination"
    >
      <VDataTable
        v-if="reportController.reportSessionPaymentNotPaid?.count"
        :items="reportController.reportSessionPaymentNotPaid?.payments"
        :page="pagination.page"
        :items-per-page="pagination.pageSize"
        :headers="headers.filter((header) => header.isVisible)"
        :loading="reportController.loading"
      >
        <template #item.price="{ item }">
          <p class="ma-0">R$ {{ formatBrl(item.price) }}</p>
        </template>

        <template #item.paid_at="{ item }">
          <p class="ma-0">
            {{ useDate().format(item.paid_at, "keyboardDateTime24h") }}
          </p>
        </template>

        <template #item.created_at="{ item }">
          <p class="ma-0">
            {{
              item.created_at
                ? Math.floor(
                    (new Date().getTime() -
                      new Date(item.created_at).getTime()) /
                      (1000 * 60 * 60 * 24),
                  )
                : "N/A"
            }}
            dias
          </p>
        </template>

        <template #bottom></template>
      </VDataTable>
    </GenericTable>

    <VDivider />

    <VCard class="d-flex justify-space-between pa-2 my-2">
      <p class="ma-0">
        Total de serviços:
        {{ reportController.reportSessionPaymentNotPaid?.count }}
      </p>
      <p class="ma-0">
        Total: R$
        {{ formatBrl(reportController.reportSessionPaymentNotPaid?.total) }}
      </p>
    </VCard>
  </div>
</template>
