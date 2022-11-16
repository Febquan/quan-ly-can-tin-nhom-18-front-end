import axios from "axios";

export const GlobalAxios = {
  install: (app, options) => {
    app.config.globalProperties.$axios = axios.create({
      baseURL: options.baseUrl,
      headers: {
        Authorization: options.token ? `Bearer ${options.token}` : "",
      },
    });
  },
};

export const ModuleAxios = (options) =>
  axios.create({
    baseURL: options.baseUrl,
    headers: {
      Authorization: options.token ? `Bearer ${options.token}` : "",
    },
  });
