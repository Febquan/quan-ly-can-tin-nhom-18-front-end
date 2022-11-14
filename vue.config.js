const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,

  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            "primary-color": "#FE724C",
            "link-color": "#E38B29",
            "text-color": "#272D2F",
            "border-radius-base": "5px",
          },
          javascriptEnabled: true,
        },
      },
    },
  },
});
