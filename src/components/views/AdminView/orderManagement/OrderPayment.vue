<template>
  <div class="container">
    <div class="qr-container">
      <h1>QR SCANNER</h1>
      <div class="qr-reader">
        <QrcodeStream @decode="onDecode" @init="onInit"></QrcodeStream>
      </div>
    </div>
    <div class="order-container">
      <div>
        <a-empty v-if="!order" />
        <a-spin v-if="isLoading" class="spin"></a-spin>

        <a-input-search
          class="search"
          v-model:value="email"
          placeholder="Email search"
          size="large"
          @search="onSearch"
        >
          <template #enterButton>
            <a-button type="primary">Search</a-button>
          </template>
        </a-input-search>
        <div class="orders" v-if="!isLoading && order">
          <oneOrder
            v-for="item in order"
            :item="item"
            :key="item._id"
            class="order"
          ></oneOrder>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { QrcodeStream } from "vue3-qrcode-reader";

import oneOrder from "./oneOrder.vue";
export default {
  name: "OrderPayment",
  components: {
    QrcodeStream,
    oneOrder,
  },
  data() {
    return {
      order: null,
      isLoading: false,
      email: "",
    };
  },
  methods: {
    async onSearch() {
      try {
        this.isLoading = true;
        const res = await this.$axios.post("admin/searchEmailStatus", {
          email: this.email,
          status: "waiting",
        });
        this.order = res.data.content;
        this.$toast.success(`Đã tìm thấy đơn hàng`, {
          position: "bottom",
          duration: 800,
          queue: true,
          max: 0,
          pauseOnHover: false,
        });
        this.isLoading = false;
      } catch (error) {
        this.$toast.error(error.response.data.message, {
          position: "bottom",
          duration: 2000,
          queue: true,
          max: 0,
          pauseOnHover: false,
        });
        this.isLoading = false;
      }
    },
    async onDecode(orderId) {
      try {
        this.isLoading = true;
        const res = await this.$axios.post("admin/seeOneOrder", {
          orderId: orderId,
        });

        this.order = [res.data.content];

        this.$toast.success(`Đã tìm thấy đơn hàng`, {
          position: "bottom",
          duration: 800,
          queue: true,
          max: 0,
          pauseOnHover: false,
        });
        this.isLoading = false;
      } catch (error) {
        this.$toast.error(error.response.data.message, {
          position: "bottom",
          duration: 2000,
          queue: true,
          max: 0,
          pauseOnHover: false,
        });
        this.isLoading = false;
      }
    },
    async onInit(promise) {
      try {
        await promise;
      } catch (error) {
        if (error.name === "NotAllowedError") {
          this.error = "ERROR: you need to grant camera access permission";
        } else if (error.name === "NotFoundError") {
          this.error = "ERROR: no camera on this device";
        } else if (error.name === "NotSupportedError") {
          this.error = "ERROR: secure context required (HTTPS, localhost)";
        } else if (error.name === "NotReadableError") {
          this.error = "ERROR: is the camera already in use?";
        } else if (error.name === "OverconstrainedError") {
          this.error = "ERROR: installed cameras are not suitable";
        } else if (error.name === "StreamApiNotSupportedError") {
          this.error = "ERROR: Stream API is not supported in this browser";
        } else if (error.name === "InsecureContextError") {
          this.error =
            "ERROR: Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.";
        } else {
          this.error = `ERROR: Camera error (${error.name})`;
        }
      }
    },
  },
};
</script>

<style scoped>
.container {
  background-color: var(--white);
  height: 100%;
  overflow: auto;
  display: grid;
  grid-template-columns: 1fr 2fr;
  padding: 24px;
  column-gap: 30px;
  align-content: center;
}
.qr-reader {
  height: 400px;
  width: 400px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 0 10px var(--grey);
}
.qr-container > h1 {
  font-size: 2rem;
  margin-bottom: 8px;
}
.qr-container {
  margin-left: 30px;
}
.order-container {
  box-shadow: 0 0 10px var(--grey);
  border-radius: 20px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 20px;
  max-height: 540px;
}
.order {
  width: 350px;
  border: 2px solid var(--primary-darker);
  padding: 15px;
}
.search {
  width: 50%;
  margin-top: 20px;
  margin-bottom: 20px;
}
.orders {
  max-height: 340px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
.spin {
  scale: 4;
}
</style>
