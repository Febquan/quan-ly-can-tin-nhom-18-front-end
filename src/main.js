import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Antd from "ant-design-vue";
import Toaster from "@meforma/vue-toaster";
import "ant-design-vue/dist/antd.less";
import "./assets/global.css";
import "./assets/color.css";
import "./assets/font.css";

import { GlobalAxios } from "../plugins/axios";
createApp(App)
  .use(GlobalAxios, {
    baseUrl: "http://localhost:8081/",
  })
  .use(store)
  .use(router)
  .use(Antd)
  .use(Toaster)

  // https://cantinnhom18-backend.herokuapp.com/
  .mount("#app");
