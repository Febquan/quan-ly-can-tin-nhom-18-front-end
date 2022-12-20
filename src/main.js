import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Antd from "ant-design-vue";
import Toaster from "@meforma/vue-toaster";

// export const SocketInstance = io(process.env.VUE_APP_BACK_END_URL);

import "ant-design-vue/dist/antd.less";
import "./assets/global.css";
import "./assets/color.css";
import "./assets/font.css";

import { GlobalAxios } from "../plugins/axios";
import { GlobalSocket } from "../plugins/socket";
import { Notification } from "../plugins/notification";
createApp(App)
  .use(GlobalAxios, {
    baseUrl: process.env.VUE_APP_BACK_END_URL,
  })
  .use(GlobalSocket)
  .use(Notification)
  .use(store)
  .use(router)
  .use(Antd)
  .use(Toaster)
  // https://cantinnhom18-backend.herokuapp.com/
  .mount("#app");
