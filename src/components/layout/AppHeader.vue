<template>
  <section>
    <div>
      <router-link to="/user/FoodView">
        <div class="logo-container">
          <img class="logo" src="@/assets/image/Logo.png" alt="logo" />
          <h1 class="logo-name">CĂN TIN 18</h1>
        </div>
      </router-link>

      <div>
        <a @click="toggleOrderModal" v-if="(isLogin || isGuest) && !isAdmin">
          <a-badge :count="numberOfCardItem" title="Orders">
            <ShoppingCartOutlined
              style="font-size: 30px; color: var(--white)"
            ></ShoppingCartOutlined>
          </a-badge>
        </a>
        <a @click="ShowTrackMyOrder" v-if="isLogin && !isGuest && !isAdmin">
          <a-badge :count="getDoneOrdersNumber" title="Orders">
            <NotificationFilled
              style="font-size: 30px; color: var(--white)"
            ></NotificationFilled>
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
          <span class="span">Login</span>
        </a-button>
        <a-button
          size="medium"
          @click="toggleSignUp"
          v-if="!isLogin && !isGuest"
        >
          <template #icon>
            <UsergroupAddOutlined />
          </template>
          <span class="span">Sign Up</span>
        </a-button>
        <a-button size="medium" @click="logout" v-if="isLogin && !isGuest">
          <template #icon>
            <UsergroupAddOutlined />
          </template>
          <span class="span">Log Out</span>
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
  NotificationFilled,
} from "@ant-design/icons-vue";
import LoginModal from "@/components/views/UserView/AuthView/LoginModal.vue";
import SignUpModal from "@/components/views/UserView/AuthView/SignUpModal.vue";
import OrderModalVue from "../views/UserView/OrderView/OrderModal.vue";

export default {
  components: {
    LoginOutlined,
    UsergroupAddOutlined,
    LoginModal,
    SignUpModal,
    ShoppingCartOutlined,
    OrderModalVue,

    NotificationFilled,
  },
  data() {
    return {
      showLogin: false,
      showSignUp: false,
      showOrderModal: false,
      showTrackMyOrderModal: false
    };
  },
  computed: {
    isLogin() {
      return this.$store.getters.getLoginState;
    },
    isGuest() {
      return this.$store.getters.getGuestState;
    },
    isAdmin() {
      return this.$store.getters.getAdminState;
    },
    numberOfCardItem() {
      return this.$store.getters["cart/getCartNumber"];
    },
    getDoneOrdersNumber() {
      return this.$store.getters["orders/getDoneOrdersNumber"];
    },
  },
  methods: {
    toggleOrderModal() {
      this.showOrderModal = !this.showOrderModal;
    },
    toggleLogin() {
      this.showLogin = !this.showLogin;
    },
    ShowTrackMyOrder() {
      this.$router.push({ name: "TrackMyOrderViewAuth" });
    },
    logout() {
      this.$axios.defaults.headers.common["Authorization"] = "";
      this.$store.commit("toggleIsLogin");
      this.$store.commit("setAdmin", false);
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
span{
  display: block;
}
@media only screen and (min-width:577px) and (max-width:992px){
  section>div{
    width: 80%;
  }
}
@media only screen and (max-width: 576px) {
  .logo-name {
    font-size: 1.4rem;
    font-weight: 800;
  }

  .logo {
    height: 7vh;
  }

  section>div {
    width: 90%;
  }

  #login-btn,#signup-btn {
    display: none;
  }
  #nav-btn{
  display: block !important;
  }
  #navbar {
    display: block;
    list-style: none;
    text-align: center;
    background-color: var(--primary-darker);
    width: 70%;
    padding-top: 10vh;
    height: 100vh;
  }

  #navbar-nav {
    list-style: none;
    padding: 0;

  }

  #navbar-nav a {
    color: snow;
    font-size: 1.4rem;
  }

  #navbar .logo-container {
    width: 100%;
    flex-direction: column;
    height: auto;
  }

  #navbar .logo {
    height: 15vh;
  }

  #navbar .logo-name {
    font-size: 2rem;
  }
  .close-nav{
    position: absolute;
    right: 0;
    width: 15%;
    top: 2%;
  }
  .close-nav i{
    font-size: 1.4rem;
    color: var(--white);
  }
  .span{
    display: none;
  }
}
</style>
