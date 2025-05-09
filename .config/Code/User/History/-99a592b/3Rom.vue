<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { useAuthController } from '@/auth/controller/authController';
import { useEmployeeController } from '@/employees/controller/employeeController';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const authController = useAuthController()
const userData = computed<any>(() => authController.userData)


const logout = async () => {
  await authController.logout()
}

const employeeController = useEmployeeController()

const goToCurrentEmployeePage = async () => {
  if (userData.value?.employeeId) {
    await employeeController.currentEmployee
    return {
      path: 'employee-detail',
      params: {
        id: employeeController.currentEmployee?.id,
      },
    }
  }
}
const goPage = (item: any) => {
  if (item.click) {
    item.click()
  }
    router.push(item.to)
}

const userProfileList = [
  { type: 'divider' },
  {
    type: 'navItem',
    icon: 'ri-user-line',
    title: 'Perfil',
    to: goToCurrentEmployeePage(),
    badgeProps: {},
  },
  {
    type: 'navItem',
    icon: 'ri-settings-4-line',
    title: 'Configurações',
    to: { name: 'my-clinic' },
    badgeProps: {},
  },
  { type: 'divider' },

]
</script>

<template>
  <VBadge v-if="userData" dot bordered location="bottom right" offset-x="3" offset-y="3" color="success">
    <VAvatar class="cursor-pointer" size="38" :color="!(userData && userData.avatar) ? 'primary' : undefined"
      :variant="!(userData && userData.avatar) ? 'tonal' : undefined">
      <VImg v-if="userData && userData.avatar" :src="userData.avatar" />
      <VIcon v-else icon="ri-user-line" />
      <!-- SECTION Menu -->
      <VMenu activator="parent" width="230" location="bottom end" offset="15px">
        <VList>
          <VListItem>
            <div class="d-flex gap-2 align-center">
              <VListItemAction>
                <VBadge dot location="bottom right" offset-x="3" offset-y="3" color="success">
                  <VAvatar :color="!(authController.userData?.avatar) ? 'primary' : undefined"
                    :variant="!(authController.userData?.avatar) ? 'tonal' : undefined">
                    <VImg v-if="authController.userData?.avatar" :src="authController.userData?.avatar" />
                    <VIcon v-else icon="ri-user-line" />
                  </VAvatar>
                </VBadge>
              </VListItemAction>

              <div>
                <h6 class="text-h6 font-weight-medium">
                  {{ authController.userData?.name }}
                </h6>
                <VListItemSubtitle class="text-disabled">
                  {{ authController.userData?.email }}
                </VListItemSubtitle>
              </div>
            </div>
          </VListItem>

          <PerfectScrollbar :options="{ wheelPropagation: false }">
            <template v-for="item in userProfileList" :key="item.title">
              <VListItem v-if="item.type === 'navItem'" @click="goPage(item)">
                <template #prepend>
                  <VIcon :icon="item.icon" size="22" />
                </template>

                <VListItemTitle>{{ item.title }}</VListItemTitle>

                <template v-if="item.badgeProps" #append>
                  <VBadge inline v-bind="item.badgeProps" />
                </template>
              </VListItem>

              <VDivider v-else class="my-1" />
            </template>

            <VListItem>
              <VBtn block color="error" size="small" append-icon="ri-logout-box-r-line" @click="logout">
                Sair
              </VBtn>
            </VListItem>
          </PerfectScrollbar>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>

  <VBtn v-else to="login">
      Entrar <VIcon icon="ri-login-box-line" size="20" class="ml-2"/>
  </VBtn>
</template>
