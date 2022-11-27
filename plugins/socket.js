import { io } from "socket.io-client";

export const GlobalSocket = {
  install: (app) => {
    const socketConnection = io(process.env.VUE_APP_BACK_END_URL);
    console.log(process.env.VUE_APP_BACK_END_URL);
    app.config.globalProperties.$socket = socketConnection;
  },
};
