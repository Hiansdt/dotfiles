<script lang="ts" setup>
// import navItems from '@templates/navigation/vertical'
// @ts-ignore
import { themeConfig } from "@themeConfig";

// Components
import Footer from "@templates/layouts/components/Footer.vue";
import NavbarThemeSwitcher from "@templates/layouts/components/NavbarThemeSwitcher.vue";
import UserProfile from "@templates/layouts/components/UserProfile.vue";
import NavBarI18n from "@core/components/I18n.vue";

// @layouts plugin
import { VerticalNavLayout } from "@layouts";
import TheCustomizer from '@/@core/components/TheCustomizer.vue'


import menus from "@/@templates/menus";

// import { IMenu } from "@/profile/entities/menu";
// import { useRouter } from "vue-router";
// import { showMessage } from "@/@core/helpers/toastify";

// const devMenus: Partial<IMenu> = {
//   title: "Dev",
//   icon: "ri-tools-line",
//   children: [
//   ],
// };
// const router = useRouter();
 

</script>

<template>
  <VerticalNavLayout :nav-items="menus">
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <IconBtn
          id="vertical-nav-toggle-btn"
          class="ms-n2 d-lg-none"
          @click="toggleVerticalOverlayNavActive(true)"
        >
          <VIcon icon="ri-menu-line" />
        </IconBtn>
        <!-- <NavSearchBar class="ms-lg-n2" /> -->

        <VSpacer />

        <NavBarI18n
          v-if="
            themeConfig.app.i18n.enable &&
            themeConfig.app.i18n.langConfig?.length
          "
          :languages="themeConfig.app.i18n.langConfig"
        />
        <NavbarThemeSwitcher class="px-5 mx-5"/>
        <!-- <NavbarShortcuts /> -->
        <UserProfile />
      </div>
    </template>

    <!-- 👉 Pages -->
    <slot />

    <!-- 👉 Footer -->
    <template #footer>
      <Footer />
    </template>

    <!-- 👉 Customizer -->
    <TheCustomizer />
  </VerticalNavLayout>
</template>
