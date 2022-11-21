import { createRouter, createWebHistory } from "vue-router";
import WelcomeView from "@/components/views/WelcomeView/WelcomeView.vue";
import RestorePassword from "@/components/views/AuthView/RestorePassword.vue";
import FoodView from "@/components/views/FoodView/FoodView.vue";
import TrackMyOrderView from "@/components/views/OrderView/TrackMyOrderView.vue";
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
