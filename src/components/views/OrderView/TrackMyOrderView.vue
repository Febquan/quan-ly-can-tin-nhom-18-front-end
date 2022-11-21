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
      <h2 class="order-title">
        <a-badge color="yellow" status="processing" />
        Đơn hàng đang làm
      </h2>
      <OrderItem :source="getDoingOrder"></OrderItem>
    </div>
    <div class="order-container">
      <h2 class="order-title">
        <a-badge color="#87d068" status="processing" />
        Đơn hàng đã xong
      </h2>
      <span>Xin vui lòng đến nhận tại quầy</span>
      <OrderItem class="is-done-order" :source="getDoneOrder"></OrderItem>
    </div>
  </div>
  <!-- </a-modal> -->
</template>

<script>
import OrderItem from "./OrderItem.vue";
export default {
  name: "TrackMyOrderModal",
  props: {
    visible: Boolean,
  },
  components: {
    OrderItem,
  },
  data() {
    return {
      // isLoading: true,
    };
  },
  // async created() {
  //   await this.$store.dispatch("orders/fetchOrders");
  //   this.isLoading = false;
  // },
  computed: {
    getDoneOrder() {
      return this.$store.getters["orders/getDoneOrders"];
    },
    getDoingOrder() {
      return this.$store.getters["orders/getDoingOrders"];
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
</style>
