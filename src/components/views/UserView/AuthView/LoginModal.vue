<template>
  <a-modal
    :visible="visible"
    title="Đăng nhập"
    maskClosable="true"
    :centered="true"
    @cancel="$emit('closeLoginModal')"
  >
    <template #footer>
      <div class="footer-container">
        <a-spin class="spinner" v-if="isLoading" />
        <a-button
          key="submit"
          type="primary"
          @click="submitLogin"
          v-if="!isLoading"
          >Submit</a-button
        >
      </div>
    </template>
    <div class="modal-container">
      <a-input v-model:value="email" placeholder="Email" />
      <a-input-password v-model:value="password" placeholder="Password" />
      <div class="link-container">
        <a-checkbox v-model:checked="isAdmin">Tài khoản admin</a-checkbox>
        <a-button type="link" @click="toggleResPas"
          >Bạn quên mật khẩu ?</a-button
        >
      </div>
    </div>
  </a-modal>
  <sendEmailRestorePasswordModal
    :visible="openResPas"
    @closeResPasModal="toggleResPas"
  ></sendEmailRestorePasswordModal>
</template>

<script>
// import { io } from "socket.io-client";
// const socket = io("http://localhost:8081");
// socket.on("connection", () => {
//   console.log("helo");
// });
import sendEmailRestorePasswordModal from "./sendEmailRestorePassword.vue";
export default {
  name: "LoginModal",
  props: {
    visible: Boolean,
  },
  components: {
    sendEmailRestorePasswordModal,
  },
  methods: {
    toggleResPas() {
      this.openResPas = !this.openResPas;
      this.$emit("closeLoginModal");
    },
    async submitLogin() {
      try {
        this.isLoading = true;

        const res = await this.$axios.post(
          `/${this.isAdmin ? "admin" : "user"}/login`,
          {
            email: this.email,
            password: this.password,
          }
        );

        const token = res.data.token;
        this.$axios.defaults.headers.common["Authorization"] =
          "Bearer " + token;
        localStorage.setItem("token", token);
        this.isLoading = false;
        this.$toast.success(`Đăng nhập thành công !`, {
          position: "bottom",
          duration: 2000,
          queue: true,
          max: 0,
          pauseOnHover: false,
        });

        this.$emit("closeLoginModal");

        this.$store.commit("toggleIsLogin");
        if (!this.isAdmin) {
          this.$router.replace({ name: "FoodView" });
        }
        if (this.isAdmin) {
          this.$store.commit("setAdmin", true);
          this.$router.replace({ name: "AdminMainView" });
          localStorage.setItem("admin", true);
          console.log(this.$socket.id);
          this.$socket.emit("adminConnect", this.$socket.id);
        }
      } catch (error) {
        this.isLoading = false;
        this.$toast.error(error.response.data.message, {
          position: "bottom",
          duration: 1500,
          enqueue: true,
          max: 0,
          pauseOnHover: false,
        });
      }
    },
  },
  data() {
    return {
      email: "",
      password: "",
      openResPas: false,
      isAdmin: false,
      isLoading: false,
    };
  },
};
</script>

<style scoped>
.modal-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
}

.ant-input {
  width: 70%;
}
.ant-input-password {
  width: 70%;
}
.router-link-active {
  align-self: start;
}
.link-container {
  width: 70%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.footer-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
