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
          <a-spin v-if="isLoading" class="spin"></a-spin>
          <div class="order-wrap">
            <oneOrder
              v-for="item in order"
              :item="item"
              :key="item._id"
              class="order"
              :isPayment="true"
              @openPaymentModal="openPaymentModal"
            ></oneOrder>
          </div>
        </div>
      </div>
    </div>
    <a-modal
      v-model:visible="visible"
      title="Thanh toán đơn hàng"
      :centered="true"
    >
      <template #footer>
        <div class="footer-container">
          <a-spin class="spinner" v-if="isLoading" />
          <a-button
            key="submit"
            type="primary"
            @click="setPaymentDone"
            v-if="!isLoading"
            :disabled="extraMoney == 0 && cost != givenMoney"
            >Thanh toán xong</a-button
          >
        </div>
      </template>
      <div class="modal-container">
        <h1>Tổng thanh toán: {{ this.convertVND(this.cost) }}</h1>
        <div>
          <span>Khách đưa: </span>
          <a-input-number
            class="input-pay"
            :default-value="cost"
            :formatter="
              (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            "
            :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
            :step="1000"
            v-model:value="givenMoney"
          />
          VNĐ
        </div>
        <h3>Tiền thối : {{ this.convertVND(this.extraMoney) }}</h3>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { QrcodeStream } from "vue3-qrcode-reader";
import convertVND from "@/util/moneyformat";
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
      visible: false,
      cost: 0,
      givenMoney: 0,
      convertVND: convertVND,
      orderId: "",
    };
  },
  computed: {
    extraMoney() {
      const sub = this.givenMoney - this.cost;
      if (sub < 0) {
        return 0;
      }
      return sub;
    },
  },
  methods: {
    openPaymentModal({ cost, orderId }) {
      this.visible = true;
      this.cost = cost;
      this.orderId = orderId;
    },
    async setPaymentDone() {
      try {
        this.isLoading = true;
        await this.$axios.put(`admin/paidOrder/${this.orderId}`);
        this.$toast.success(`Thanh toán thành công`, {
          position: "bottom",
          duration: 800,
          queue: true,
          max: 0,
          pauseOnHover: false,
        });
        this.isLoading = false;

        const id = this.order.findIndex((el) => el._id == this.orderId);
        this.order[id].status = "paid";
        this.visible = false;
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
  border: 4px solid var(--primary);

  border-radius: 20px;
  display: grid;
  grid-template-columns: 1fr;
  justify-content: center;
  align-items: center;

  padding: 20px;
  height: 600px;
  max-height: 540px;
}
.order {
  width: 450px;
  box-shadow: 0 0 10px var(--grey);
  padding: 25px;
}
.order:hover {
  border-radius: 20px;
  box-shadow: 0 0 20px var(--grey);
  transition: box-shadow 200ms ease;
}
.order-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.search {
  width: 50%;
  margin-top: 20px;
  margin-bottom: 20px;
}
.orders {
  padding: 20px;
  max-height: 340px;
  overflow-y: auto;
}
.input-pay {
  width: max-content;
}
.spin {
  scale: 4;
}
.modal-container {
  display: flex;
  gap: 10px;
  flex-direction: column;
}
</style>
