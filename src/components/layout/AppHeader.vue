<template>
  <section>
    <div>
      <router-link to="/">
        <div class="logo-container">
          <img class="logo" src="@/assets/image/Logo.png" alt="logo" />
          <h1 class="logo-name">CĂN TIN 18</h1>
        </div>
      </router-link>

      <div>
        <a @click="toggleOrderModal" v-if="isLogin || isGuest">
          <a-badge :count="numberOfCardItem" title="Orders">
            <ShoppingCartOutlined
              style="font-size: 30px; color: var(--white)"
            ></ShoppingCartOutlined>
          </a-badge>
        </a>
        <a-button
          size="medium"
          @click="toggleLogin"
          v-if="!isLogin && !isGuest"
        >
          <template #icon>
            <LoginOutlined />
          </template>
          Login
        </a-button>
        <a-button
          size="medium"
          @click="toggleSignUp"
          v-if="!isLogin && !isGuest"
        >
          <template #icon>
            <UsergroupAddOutlined />
          </template>
          Sign Up
        </a-button>
        <a-button size="medium" @click="logout" v-if="isLogin && !isGuest">
          <template #icon>
            <UsergroupAddOutlined />
          </template>
          Log Out
        </a-button>
      </div>
    </div>
  </section>
  <div class="fake-section"></div>
  <LoginModal
    v-if="!isLogin"
    @closeLoginModal="toggleLogin"
    :visible="showLogin"
  ></LoginModal>
  <SignUpModal
    v-if="!isLogin"
    @closeSignUpModal="toggleSignUp"
    :visible="showSignUp"
  ></SignUpModal>
  <OrderModalVue :visible="showOrderModal" @closeOrderModal="toggleOrderModal">
  </OrderModalVue>
</template>

<script>
import {
  UsergroupAddOutlined,
  ShoppingCartOutlined,
  LoginOutlined,
} from "@ant-design/icons-vue";
import LoginModal from "@/components/views/AuthView/LoginModal.vue";
import SignUpModal from "@/components/views/AuthView/SignUpModal.vue";
import OrderModalVue from "../views/OrderView/OrderModal.vue";
export default {
  components: {
    LoginOutlined,
    UsergroupAddOutlined,
    LoginModal,
    SignUpModal,
    ShoppingCartOutlined,
    OrderModalVue,
  },
  data() {
    return {
      showLogin: false,
      showSignUp: false,
      showOrderModal: false,
    };
  },
  computed: {
    isLogin() {
      return this.$store.getters.getLoginState;
    },
    isGuest() {
      return this.$store.getters.getGuestState;
    },
    numberOfCardItem() {
      return this.$store.getters["cart/getCartNumber"];
    },
  },
  methods: {
    toggleOrderModal() {
      this.showOrderModal = !this.showOrderModal;
    },
    toggleLogin() {
      this.showLogin = !this.showLogin;
    },
    logout() {
      this.$axios.defaults.headers.common["Authorization"] = "";
      this.$store.commit("toggleIsLogin");
      localStorage.clear("token");
      this.$router.replace({ name: "WelcomeView" });
    },
    toggleSignUp() {
      this.showSignUp = !this.showSignUp;
    },
  },
};
</script>

<style scoped>
.fake-section {
  height: 10vh;
}
section {
  position: fixed;
  isolation: isolate;
  z-index: 1000;
  height: 10vh;
  width: 100%;
  background-color: var(--primary);
  border-bottom: 3px solid var(--primary-darker);
  box-shadow: 0px -3px 20px var(--black);
  display: flex;
  justify-content: center;
  align-items: center;
}
section > div {
  display: flex;
  justify-content: space-between;
  width: 60%;
  align-items: center;
}
section > div > div {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo-container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
.logo-name {
  color: var(--white);
  margin: 0;
  font-size: 1.7rem;
  font-weight: 800;
}
.logo {
  height: 8vh;
}
</style>
