import { notification } from "ant-design-vue";

export const Notification = {
  install: (app) => {
    app.config.globalProperties.$notification = notification;
  },
};
