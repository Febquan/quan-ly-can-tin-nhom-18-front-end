<template>
  <!-- <a-modal
    :visible="visible"
    title="Các đơn hàng của bạn"
    maskClosable="true"
    :centered="true"
    :footer="null"
    @cancel="$emit('closeTrackMyOrderModal')"
  > -->
  <!-- <a-spin class="spinner" v-if="isLoading" /> -->
  <div class="modal-container" v-if="!isLoading">
    <div class="order-container left">
      <h1 class="order-title">
        <a-badge color="yellow" status="processing" />
        Đơn hàng đang làm
      </h1>
      <OrderItem :source="getDoingOrder" @openQrModal="handleQr"></OrderItem>
    </div>
    <div class="order-container">
      <h1 class="order-title">
        <a-badge color="#87d068" status="processing" />
        Đơn hàng đã xong
      </h1>
      <span>Xin vui lòng đến nhận tại quầy</span>
      <OrderItem
        class="is-done-order"
        @openQrModal="handleQr"
        :source="getDoneOrder"
      ></OrderItem>
    </div>
  </div>
  <a-modal :centered="true" v-model:visible="visible" title="QR code">
    <template #footer> </template>
    <div class="model-container">
      <QrcodeVue :value="Qrcode" :size="300"></QrcodeVue>
    </div>
  </a-modal>
</template>

<script>
import OrderItem from "./OrderItem.vue";
import QrcodeVue from "qrcode.vue";
export default {
  name: "TrackMyOrderAuth",

  components: {
    OrderItem,
    QrcodeVue,
  },
  data() {
    return {
      visible: false,
      Qrcode: "",
    };
  },
  // async mounted() {
  //   await this.$store.dispatch("orders/fetchOrders", {});
  // },
  computed: {
    getDoneOrder() {
      return this.$store.getters["orders/getDoneOrders"];
    },
    getDoingOrder() {
      return this.$store.getters["orders/getDoingOrders"];
    },
  },
  methods: {
    handleQr(qr) {
      this.visible = true;
      this.Qrcode = qr;
    },
  },
};
</script>

<style scoped>
.order-title {
  font-size: 1.7rem;
  color: var(--primary);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
.modal-container {
  margin: auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 87vh;
  width: 90%;
  padding: 40px;
  justify-items: center;
  align-content: center;
}

.order-container {
  width: 100%;
}
.order-container.left {
  border-right: 2px solid var(--grey);
}
.model-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
