<template>
  <a-modal
    :visible="visible"
    title="Đăng ký"
    maskClosable="true"
    :centered="true"
    @cancel="$emit('closeSignUpModal')"
  >
    <template #footer>
      <div class="footer-container">
        <a-spin class="spinner" v-if="isLoading" />
        <a-button
          key="submit"
          type="primary"
          :disabled="!isEqualPass"
          @click="submitSignUp"
          v-if="!isLoading"
          >Submit</a-button
        >
      </div>
    </template>
    <div class="modal-container">
      <a-input v-model:value="name" placeholder="Name" />
      <a-input v-model:value="email" placeholder="Email" />
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
  name: "SignUpModal",
  props: {
    visible: Boolean,
  },

  methods: {
    CheckEqualPassword() {
      if (this.isLoseFocusOne == false) {
        this.isLoseFocusOne = true;
      }
      this.isEqualPass =
        this.password1 === this.password2 &&
        (this.password1 != "" || this.password2 != "");
    },
    async submitSignUp() {
      try {
        this.isLoading = true;

        await this.$axios.post(`user/signup`, {
          name: this.name,
          email: this.email,
          password: this.password1,
        });

        this.isLoading = false;
        this.$toast.success(`Đăng ký thành công !`, {
          position: "bottom",
          duration: 2000,
          queue: true,
          max: 0,
          pauseOnHover: false,
        });
        setTimeout(() => {
          this.$toast.show(`Hãy xác thực email của bạn`, {
            position: "bottom",
            duration: 2000,
            enqueue: true,
            max: 0,
            pauseOnHover: false,
          });
        }, 2000);
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
      name: "",
      email: "",
      password1: "",
      password2: "",
      isEqualPass: false,
      isLoading: false,
      isLoseFocusOne: false,
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
