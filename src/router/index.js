import { createRouter, createWebHistory } from "vue-router";
import WelcomeView from "@/components/views/WelcomeView/WelcomeView.vue";
import RestorePassword from "@/components/views/UserView/AuthView/RestorePassword.vue";
import FoodView from "@/components/views/UserView/FoodView/FoodView.vue";
import TrackMyOrderView from "@/components/views/UserView/OrderView/TrackMyOrderView.vue";
import AdminMainView from "@/components/views/AdminView/AdminMainView.vue";
import OrderManagement from "@/components/views/AdminView/orderManagement/OrderManagement.vue";
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
    name: "TrackMyOrderView",
    component: TrackMyOrderView,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin",
    name: "AdminMainView",
    component: AdminMainView,
    meta: { requiresAuth: true },
    children: [
      {
        path: "orderManagement",
        name: "OrderManagement",
        component: OrderManagement,
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
  } else {
    next();
  }
});
export default router;
