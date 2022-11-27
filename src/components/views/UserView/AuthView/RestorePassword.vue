<template>
  <a-modal
    class="restore"
    :visible="true"
    :centered="true"
    :closable="false"
    :maskStyle="{ color: 'red' }"
    title="Đặt lại mật khẩu"
  >
    <template #footer>
      <div class="footer-container">
        <a-spin class="spinner" v-if="isLoading" />
        <a-button
          key="submit"
          type="primary"
          :disabled="!isEqualPass"
          @click="submitChangePassword"
          v-if="!isLoading"
          >Submit</a-button
        >
      </div>
    </template>
    <div class="modal-container">
      <a-input-password
        v-model:value="password1"
        placeholder="Password"
        @blur="CheckEqualPassword"
      />
      <a-input-password
        @blur="CheckEqualPassword"
        v-model:value="password2"
        placeholder="Confirm password"
      />
      <span class="pas-noti" v-if="!isEqualPass && isLoseFocusOne"
        >Mật khẩu không giống nhau !</span
      >
    </div>
  </a-modal>
</template>

<script>
export default {
  name: "RestorePassword",
  methods: {
    CheckEqualPassword() {
      if (this.isLoseFocusOne == false) {
        this.isLoseFocusOne = true;
      }
      this.isEqualPass =
        this.password1 === this.password2 &&
        (this.password1 != "" || this.password2 != "");
    },
    async submitChangePassword() {
      try {
        this.isLoading = true;
        const token = this.$route.params.token;

        const res = await this.$axios.post(`user/restorePassword`, {
          token: token,
          password: this.password1,
        });
        this.isLoading = false;
        this.$router.push({ name: "WelcomeView" });
        this.$toast.success(`${res.data.message}`, {
          position: "bottom",
          duration: 2000,
          queue: true,
          max: 0,
          pauseOnHover: false,
        });
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
      password1: "",
      password2: "",
      isLoading: false,
      isEqualPass: false,
      isLoseFocusOne: false,
    };
  },
};
</script>
<style>
/* .ant-modal-wrap {
  background-color: rgb(0, 0, 0, 0.9);
} */
</style>
<style scoped>
.modal-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
}

.ant-input-password {
  width: 70%;
}
.footer-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.pas-noti {
  color: var(--primary);
}
</style>
