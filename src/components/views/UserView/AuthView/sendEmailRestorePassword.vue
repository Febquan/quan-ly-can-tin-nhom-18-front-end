<template>
  <a-modal
    :visible="visible"
    title="Quên mật khẩu"
    maskClosable="true"
    :centered="true"
    @cancel="$emit('closeResPasModal')"
  >
    <template #footer>
      <div class="footer-container">
        <a-spin class="spinner" v-if="isLoading" />
        <a-button
          key="submit"
          type="primary"
          @click="submitResPas"
          v-if="!isLoading"
          >Submit</a-button
        >
      </div>
    </template>
    <div class="modal-container">
      <a-input v-model:value="email" placeholder="Email" />
    </div>
  </a-modal>
</template>

<script>
export default {
  name: "sendEmailRestorePasswordModal",
  props: {
    visible: Boolean,
  },
  methods: {
    async submitResPas() {
      try {
        this.isLoading = true;

        const a = await this.$axios.post(`user/sendEmailRestorePassword`, {
          email: this.email,
        });
        console.log(a);
        this.isLoading = false;
        this.$toast.success(`Đã gửi email đến ${this.email} !`, {
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
      email: "",
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
.footer-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
