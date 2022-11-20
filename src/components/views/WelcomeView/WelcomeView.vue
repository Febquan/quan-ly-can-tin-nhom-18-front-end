<template>
  <div class="home">
    <div>
      <h1 v-if="!isLogin">Chào mừng đến với căn tin HCMUS !</h1>
    </div>
    <a-button size="large" type="primary" @click="toggleGuest" v-if="!isLogin">
      <template #icon>
        <LoginOutlined />
      </template>
      Join as guest
    </a-button>
  </div>
</template>

<script>
export default {
  name: "WelcomeView",
  computed: {
    isLogin() {
      return this.$store.getters.getLoginState;
    },
  },
  methods: {
    toggleLogin() {
      this.$store.commit("toggleIsLogin");
      this.$router.replace({ name: "FoodView" });
    },
    toggleGuest() {
      this.$store.commit("toggleIsGuest");
      this.$router.replace({ name: "FoodView" });
    },
  },
};
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 10vh;
  font-size: 1.2rem;
  user-select: none;
  height: 84vh;
}
</style>
