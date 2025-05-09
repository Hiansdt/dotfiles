<script lang="ts" setup>
// import navItems from '@templates/navigation/vertical'
// @ts-ignore
import { themeConfig } from "@themeConfig";
import { layoutConfig } from '@/@templates/@layouts'
import { VNodeRenderer } from "@/@templates/@layouts/components/VNodeRenderer";
// Components
import Footer from "@templates/layouts/components/Footer.vue";
import NavbarThemeSwitcher from "@templates/layouts/components/NavbarThemeSwitcher.vue";
import UserProfile from "@templates/layouts/components/UserProfile.vue";
import NavBarI18n from "@core/components/I18n.vue";
import { HorizontalNav } from "@/@templates/@layouts/components";

// @layouts plugin
import { HorizontalNavLayout } from "@layouts";
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
  <HorizontalNavLayout :nav-items="menus" class="layout-horizontal-nav">
    <!-- 👉 navbar -->
    <template #navbar>
      <RouterLink
        to="/"
        class="d-flex align-center gap-x-4"
      >
        <VNodeRenderer :nodes="layoutConfig.app.logo" />

        <h1 class="leading-normal text-xl text-uppercase">
          {{ themeConfig.app.title }}
        </h1>
      </RouterLink>
      <div class="ml-5 pl-5 horizontal-nav-content-container">
        <HorizontalNav :nav-items="menus" />
      </div>
      <VSpacer />

      <!-- <NavSearchBar /> -->

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
    </template>

    <!-- 👉 Pages -->
    <slot />

    <!-- 👉 Footer -->
    <template #footer>
      <Footer />
    </template>

    <!-- 👉 Customizer -->
    <TheCustomizer />
  </HorizontalNavLayout>
</template>


<style lang="scss">
@use "@configured-variables" as variables;
@use "@layouts/styles/placeholders";
@use "@layouts/styles/mixins";

.layout-page-content {
  margin: 20px;
}

.footer-content-container {
  display: flex;
  align-items: center;
  justify-content: end;

  > p {
    margin: 0 !important;
    > a {
      font-weight: bold;
    }
  }
}

.layout-wrapper {
  &.layout-nav-type-horizontal {
    display: flex;
    flex-direction: column;

    // // TODO(v2): Check why we need height in vertical nav & min-height in horizontal nav
    // min-height: 100%;
    min-block-size: 100dvh;

    .layout-navbar-and-nav-container {
      z-index: 1;
    }

    .layout-navbar {
      z-index: variables.$layout-horizontal-nav-layout-navbar-z-index;
      block-size: variables.$layout-horizontal-nav-navbar-height;

      // ℹ️ For now we are not independently managing navbar and horizontal nav so we won't use below style to avoid conflicting with combo style of navbar and horizontal nav
      // If we add independent style of navbar & horizontal nav then we have to add :not for avoiding conflict with combo styles
      // .layout-navbar-sticky & {
      //   @extend %layout-navbar-sticky;
      // }

      // ℹ️ For now we are not independently managing navbar and horizontal nav so we won't use below style to avoid conflicting with combo style of navbar and horizontal nav
      // If we add independent style of navbar & horizontal nav then we have to add :not for avoiding conflict with combo styles
      // .layout-navbar-hidden & {
      //   @extend %layout-navbar-hidden;
      // }
    }

    // 👉 Navbar
    .navbar-content-container {
      @include mixins.boxed-content;
    }

    // 👉   Content height fixed
    &.layout-content-height-fixed {
      max-block-size: 100dvh;

      .layout-page-content {
        overflow: hidden;

        > :first-child {
          max-block-size: 100%;
          overflow-y: auto;
        }
      }
    }

    // 👉 Footer
    // Boxed content
    .layout-footer {
      .footer-content-container {
        @include mixins.boxed-content;
      }
    }
  }

  // If both navbar & horizontal nav sticky
  &.layout-navbar-sticky.horizontal-nav-sticky {
    .layout-navbar-and-nav-container {
      position: sticky;
      inset-block-start: 0;
      will-change: transform;
    }
  }

  &.layout-navbar-hidden.horizontal-nav-hidden {
    .layout-navbar-and-nav-container {
      display: none;
    }
  }
}

// 👉 Horizontal nav nav
.layout-horizontal-nav {
  z-index: variables.$layout-horizontal-nav-z-index;

  // .horizontal-nav-sticky & {
  //   width: 100%;
  //   will-change: transform;
  //   position: sticky;
  //   top: 0;
  // }

  // .horizontal-nav-hidden & {
  //   display: none;
  // }

  .horizontal-nav-content-container {
    @include mixins.boxed-content(true);
  }
}
</style>