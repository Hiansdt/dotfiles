<script setup lang="ts">
import { handleErrorMessage, showMessage } from "@/@core/helpers";
import { useSessionController } from "@/sessions/controller/sessionController";
import { ISessionService } from "@/sessions/entities/session";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useDate } from "vuetify";
import AddSessionService from "@/sessions/infra/components/detail/services/AddSessionService.vue";
import RemoveSessionService from "../../components/detail/services/RemoveSessionService.vue";
import CompleteSession from "../../components/detail/CompleteSession.vue";
import CancelSession from "../../components/detail/CancelSession.vue";
import { formatBrl } from "@/@core/helpers/formatters";

const sessionController = useSessionController();

const props = defineProps<{
  id: string;
}>();

const items = computed(() => [
  {
    title: "Sessões",
    disabled: false,
    href: "/sessions",
  },
  {
    title: `${sessionController.currentSession?.title}`,
    disabled: true,
  },
]);

const showEditTitleInput = ref<boolean>(false);
const editTitleInput = ref<string>("");
const activeTab = ref(1);
const activeSessionService = ref<ISessionService | null>(null);
const showAddService = ref(false);
const showRemoveService = ref(false);
const showComplete = ref(false);
const showCancel = ref(false);

const activeSession = computed(
  () =>
    !sessionController.currentSession?.completed &&
    !sessionController.currentSession?.canceled,
);

const toggleEditTitleInput = () => {
  showEditTitleInput.value = !showEditTitleInput.value;
  if (showEditTitleInput.value) {
    editTitleInput.value = sessionController.currentSession?.title || "";
  } else {
    if (editTitleInput.value != sessionController.currentSession?.title) {
      editTitle();
    }
  }
};

const editTitle = async () => {
  try {
    await sessionController.editSession({
      id: props.id,
      title: editTitleInput.value,
    });
    if (sessionController.state.currentSession) {
      sessionController.state.currentSession.title = editTitleInput.value;
    }
    showMessage("Título editado com sucesso", "success");
  } catch (error) {
    handleErrorMessage(error);
  }
};

onMounted(async () => {
  await sessionController.getSessionById(props.id);
});

onUnmounted(async () => {
  sessionController.state.currentSession = null;
});
</script>

<template>
  <VMain>
    <VBreadcrumbs class="px-0 text-body-2" :items="items"></VBreadcrumbs>

    <VRow class="pa-4">
      <VCol cols="12">
        <VRow>
          <VCol
            cols="12"
            :md="activeSession ? 8 : 12"
            class="d-flex align-center position-relative ga-4"
          >
            <VChip
              color="success"
              v-if="sessionController.currentSession?.completed"
            >
              <VIcon> ri-check-line </VIcon>
              Concluída
            </VChip>
            <VChip
              color="error"
              v-if="sessionController.currentSession?.canceled"
            >
              <VIcon> ri-close-line </VIcon>
              Cancelada
            </VChip>
            <p class="text-h4 ma-0" v-if="!showEditTitleInput">
              {{ sessionController.currentSession?.title }}
            </p>

            <VTextField
              v-else
              label="Título"
              class="mr-2"
              v-model="editTitleInput"
            />

            <IconBtn
              @click="toggleEditTitleInput"
              class="position-absolute right-0"
              :disabled="sessionController.currentSession?.completed"
            >
              <VIcon v-if="!showEditTitleInput"> ri-pencil-line </VIcon>
              <VIcon v-else> ri-check-line </VIcon>
            </IconBtn>
          </VCol>
          <VCol cols="12" md="4" v-if="activeSession">
            <VRow>
              <VCol cols="12" md="6">
                <VBtn
                  color="success"
                  width="50%"
                  block
                  @click="showComplete = true"
                >
                  <VIcon class="mr-2" size="20"> ri-check-line </VIcon>
                  <p class="ma-0">Concluir</p>
                </VBtn>
              </VCol>
              <VCol cols="12" md="6">
                <VBtn
                  color="error"
                  width="50%"
                  block
                  @click="showCancel = true"
                >
                  <VIcon class="mr-2" size="20"> ri-close-line </VIcon>
                  <p class="ma-0">Cancelar</p>
                </VBtn>
              </VCol>
            </VRow>
          </VCol>
        </VRow>
      </VCol>

      <VDivider class="my-4" />

      <VCol cols="12">
        <VCard>
          <VCardText>
            <VRow>
              <VCol cols="12" sm="6">
                <div class="d-flex flex-column">
                  <p class="ma-0">
                    <strong>Data de Início:</strong>
                    {{
                      useDate().format(
                        sessionController.currentSession?.start_date,
                        sessionController.currentSession?.all_day
                          ? "keyboardDate"
                          : "keyboardDateTime24h",
                      )
                    }}
                  </p>
                </div>
              </VCol>

              <VCol cols="12" sm="6">
                <div class="d-flex flex-column">
                  <p class="ma-0">
                    <strong>Data de Fim:</strong>
                    {{
                      useDate().format(
                        sessionController.currentSession?.end_date,
                        sessionController.currentSession?.all_day
                          ? "keyboardDate"
                          : "keyboardDateTime24h",
                      )
                    }}
                  </p>
                </div>
              </VCol>

              <VCol
                cols="12"
                sm="6"
                v-if="sessionController.currentSession?.description"
              >
                <div class="d-flex flex-column">
                  <p class="ma-0">
                    {{ sessionController.currentSession.description }}
                  </p>
                </div>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12">
        <VCard class="pa-4 pb-0">
          <VCardText class="px-2 py-0">
            <VTabs v-model="activeTab" class="v-tabs-pill" density="compact">
              <VTab :value="1" class="mx-2">
                <VIcon size="20" v-bind="props" class="mr-3"> ri-run-line </VIcon>
                Serviços
              </VTab>
              <VTab :value="2" class="mx-2">
                <VIcon size="20" v-bind="props" class="mr-3"> ri-group-2-line </VIcon>
                Participantes
              </VTab>
            </VTabs>
            <VTabsWindow v-model="activeTab">
              <VTabsWindowItem :value="1">
                <div class="d-flex flex-column py-2 px-2">
                  <VList class="d-flex flex-column ga-2">
                    <template
                      v-if="sessionController.currentSession?.services.length"
                    >
                      <VListItem
                        v-for="service in sessionController.currentSession
                          ?.services"
                        :key="service.id"
                        variant="outlined"
                        class="rounded"
                      >
                        <VListItemTitle>
                          {{ service.description }}
                        </VListItemTitle>

                        <template #append>
                          R$ {{ formatBrl(service.price) }}
                        </template>
                      </VListItem>

                      <VDivider />

                      <div class="d-flex justify-space-between">
                        <p class="ma-0">
                          <strong>Total:</strong>
                        </p>
                        <p class="ma-0">
                          R$
                          {{
                            formatBrl(
                              sessionController.currentSession?.services.reduce(
                                (acc, service) => acc + service.price,
                                0,
                              ),
                            )
                          }}
                        </p>
                      </div>
                    </template>

                    <p v-else class="w-100 text-center">
                      Nenhum Serviço Adicionado
                    </p>
                  </VList>
                </div>
              </VTabsWindowItem>

              <VTabsWindowItem :value="2">
                <div class="d-flex flex-column py-2 px-2">
                  <VList class="d-flex flex-column ga-2">
                    <VListItem
                      variant="outlined"
                      v-for="employee in sessionController.currentSession
                        ?.physiotherapists"
                      :key="employee.id"
                      class="rounded"
                    >
                      <template #prepend>
                        <VAvatar color="grey-200" size="30">
                          <VIcon size="20"> ri-user-line </VIcon>
                        </VAvatar>
                      </template>
                      <VListItemTitle>
                        {{ employee.name }}
                      </VListItemTitle>
                      <VListItemSubtitle> Funcionário </VListItemSubtitle>
                    </VListItem>

                    <VListItem
                      variant="outlined"
                      v-for="contract in sessionController.currentSession
                        ?.contracts"
                      :key="contract.id"
                    >
                      <template #prepend>
                        <VAvatar color="grey-200" size="30">
                          <VIcon size="20"> ri-user-line </VIcon>
                        </VAvatar>
                      </template>
                      <VListItemTitle>
                        {{ contract.client.name }}
                      </VListItemTitle>
                      <VListItemSubtitle> Cliente </VListItemSubtitle>
                    </VListItem>
                  </VList>
                </div>
              </VTabsWindowItem>
            </VTabsWindow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </VMain>

  <AddSessionService v-model:is-dialog-visible="showAddService" />

  <RemoveSessionService
    v-model:is-dialog-visible="showRemoveService"
    v-model:active-service="activeSessionService"
  />

  <CompleteSession v-model:is-dialog-visible="showComplete" />
  <CancelSession v-model:is-dialog-visible="showCancel" />
</template>
