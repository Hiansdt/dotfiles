<script setup lang="ts">
import GenericTable from "@/@core/components/generic/GenericTable.vue";
import { handleErrorMessage } from "@/@core/helpers";
import { defaultPagination } from "@/@core/helpers/defaultItems";
import { formatBrl } from "@/@core/helpers/formatters";
import { IHeader, IPagination } from "@/@core/interfaces/app";
import { useReportController } from "@/report/controller/reportController";
import { IReportSessionPayment } from "@/report/entities/report";
import { onMounted, reactive, ref } from "vue";
import { useDate } from "vuetify";

const reportController = useReportController();

const breadcrumbs = [
  {
    title: "Financeiro",
    disabled: false,
  },
  {
    title: "Serviços",
    disabled: true,
  },
];

const reportSessionPayments = ref<IReportSessionPayment>({
    count: 0,
    total: 0,
    payments: [],
});

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
    title: "Pago em",
    value: "paid_at",
    sortable: true,
    isVisible: true,
    sequence: 3,
  }
]);

const getReport = async () => {
  try {
    reportSessionPayments.value =
      await reportController.getReportSessionPaymentByDateRange(
        date.startDate.toISOString().split("T")[0],
        date.endDate.toISOString().split("T")[0],
      );

    pagination.value = {
      ...pagination.value,
      total: reportSessionPayments.value?.count,
      numPages: Math.ceil(
        reportSessionPayments.value?.count / pagination.value.pageSize,
      ),
    };
  } catch (error) {
    handleErrorMessage(error);
  }
};

onMounted(async () => {
  date.startDate = useDate().startOfMonth(new Date()) as Date;
  date.endDate = useDate().endOfMonth(new Date()) as Date;

  await getReport();
});
</script>

<template>
  <VBreadcrumbs :items="breadcrumbs" />

  <div class="d-flex flex-column px-4">
    <VRow class="py-2">
      <VCol class="d-flex" cols="12" md="8">
        <p class="ma-0 text-h5">Relatorios de serviços</p>
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
      v-model:items="reportSessionPayments.payments"
      v-model:headers="headers"
      v-model:pagination="pagination"
    >
      <VDataTable
        v-if="reportSessionPayments?.count"
        :items="reportSessionPayments?.payments"
        :page="pagination.page"
        :items-per-page="pagination.pageSize"
        :headers="headers.filter((header) => header.isVisible)"
      >
        <template #item.price="{ item }">
          <p class="ma-0">
            R$ {{ formatBrl(item.price) }}
          </p>
        </template>

        <template #item.paid_at="{ item }">
          <p class="ma-0">
            {{ useDate().format(item.paid_at, 'keyboardDateTime24h') }}
          </p>
        </template>

        <template #bottom></template>
      </VDataTable>
    </GenericTable>
    
    <VDivider />

    <div class="d-flex justify-space-between pa-2">
        <p class="ma-0">
            Total de serviços: {{ reportSessionPayments?.count }}
        </p>
        <p class="ma-0">
            Total: R$ {{ formatBrl(reportSessionPayments?.total) }}
        </p>
    </div>
  </div>
</template>
