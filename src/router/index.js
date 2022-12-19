import { createRouter, createWebHistory } from "vue-router";
import WelcomeView from "@/components/views/WelcomeView/WelcomeView.vue";
import RestorePassword from "@/components/views/UserView/AuthView/RestorePassword.vue";
import FoodView from "@/components/views/UserView/FoodView/FoodView.vue";
import TrackMyOrderView from "@/components/views/UserView/OrderView/TrackMyOrderView.vue";
import TrackMyOrderViewAuth from "@/components/views/UserView/OrderView/TrackMyOrderViewAuth.vue";
import AdminMainView from "@/components/views/AdminView/AdminMainView.vue";
import OrderManagement from "@/components/views/AdminView/orderManagement/OrderManagement.vue";
import OrderPayment from "@/components/views/AdminView/orderManagement/OrderPayment.vue";
import OrderManipulate from "@/components/views/AdminView/orderManagement/OrderManipulate.vue";
import StorageManagement from "@/components/views/AdminView/storageManagement/StorageManagement.vue";
import StorageInput from "@/components/views/AdminView/storageManagement/StorageInput.vue";
import StorageChange from "@/components/views/AdminView/storageManagement/StorageChange.vue";
import MenuManagement from "@/components/views/AdminView/menuManagement/menuManagement.vue";
import MenuInput from "@/components/views/AdminView/menuManagement/menuInput.vue";
import MenuChange from "@/components/views/AdminView/menuManagement/menuChange.vue";
import DailyAmount from "@/components/views/AdminView/sellManagement/DailyAmountManagement.vue";
import DailyBusiness from "@/components/views/AdminView/sellManagement/DailyBusiness.vue";
import BusinessReport from "@/components/views/AdminView/sellManagement/BusinessReport.vue";
import store from "@/store";
const routes = [
  {
    path: "/",
    name: "WelcomeView",
    component: WelcomeView,
  },
  {
    path: "/user/restorePassword/:token",
    name: "restorePassword",
    component: RestorePassword,
  },
  {
    path: "/user/FoodView",
    name: "FoodView",
    component: FoodView,
    meta: { requiresAuth: true },
  },
  {
    path: "/user/TrackMyOrder",
    name: "TrackMyOrderViewAuth",
    component: TrackMyOrderViewAuth,
    meta: { requiresAuth: true },
  },
  {
    path: "/user/TrackMyOrder/:email",
    name: "TrackMyOrderView",
    component: TrackMyOrderView,
  },
  {
    path: "/admin",
    name: "AdminMainView",
    component: AdminMainView,
    meta: { requiresAdminAuth: true },
    children: [
      {
        path: "orderManagement",
        name: "OrderManagement",
        component: OrderManagement,
      },
      {
        path: "orderPayment",
        name: "OrderPayment",
        component: OrderPayment,
      },
      {
        path: "orderManipulate",
        name: "OrderManipulate",
        component: OrderManipulate,
      },
      {
        path: "storageManagement",
        name: "StorageManagement",
        component: StorageManagement,
      },
      {
        path: "storageInput",
        name: "StorageInput",
        component: StorageInput,
      },
      {
        path: "storageChange",
        name: "StorageChange",
        component: StorageChange,
      },
      {
        path: "menuManagement",
        name: "MenuManagement",
        component: MenuManagement,
      },
      {
        path: "menuInput",
        name: "MenuInput",
        component: MenuInput,
      },
      {
        path: "menuChange",
        name: "MenuChange",
        component: MenuChange,
      },
      {
        path: "dailyAmount",
        name: "DailyAmount",
        component: DailyAmount,
      },
      {
        path: "dailyBusiness",
        name: "DailyBusiness",
        component: DailyBusiness,
      },
      {
        path: "businessReport",
        name: "BusinessReport",
        component: BusinessReport,
      },
    ],
  },
  // {
  //   path: "/about",
  //   name: "about",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  // },
];
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(function (to, _, next) {
  if (
    to.meta.requiresAuth &&
    !store.getters.getLoginState &&
    !store.getters.getGuestState
  ) {
    next("/");
  }
  if (
    to.meta.requiresAdminAuth &&
    !store.getters.getLoginState &&
    !store.getters.getAdminState
  ) {
    next("/");
  } else {
    next();
  }
});
export default router;
