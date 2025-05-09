import { IRoutes } from "@/@core/interfaces/router";

const routes: IRoutes[] = [
  {
    path: "/cash/services",
    name: "cash-services",
    component: () => import("@/cash/infra/pages/cashServices/index.vue"),
  },
  {
    path: "/cash-register",
    name: "cash-register",
    component: () => import("@/cash/infra/pages/cashRegister/index.vue"),
  },
];

export default routes;