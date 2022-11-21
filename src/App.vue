<template>
  <AppHeader></AppHeader>

  <router-view />
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
  created() {
    const token = localStorage.getItem("token");
    if (token) {
      this.$axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      this.$store.commit("toggleIsLogin");
      this.$router.replace({ name: "FoodView" });
    }
  },
};
</script>
