<template>
  <AppHeader></AppHeader>

  <router-view style="min-height: 87vh" />
  <AppFooter></AppFooter>
</template>

<script>
import AppHeader from "@/components/layout/AppHeader.vue";
import AppFooter from "@/components/layout/AppFooter.vue";

export default {
  components: {
    AppHeader,
    AppFooter,
  },
  async mounted() {
    await this.autoLogin();
  },
  methods: {
    async autoLogin() {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          this.$axios.defaults.headers.common["Authorization"] =
            "Bearer " + token;
          if (!localStorage.getItem("admin")) {
            await this.$axios.get("user/CheckAutoLogin");
            this.$router.replace({ name: "FoodView" });
          } else {
            await this.$axios.get("admin/CheckAutoLogin");
            this.$router.replace({ name: "AdminMainView" });
            this.$socket.on("connect", () => {
              console.log(this.$socket.id);
              this.$socket.emit("adminConnect", this.$socket.id);
            });
          }
          this.$store.commit("toggleIsLogin");
        }
      } catch (err) {
        this.$store.commit("setLogin", false);
        this.$axios.defaults.headers.common["Authorization"] = "";
        localStorage.clear("token");
      }
    },
  },
};
</script>
