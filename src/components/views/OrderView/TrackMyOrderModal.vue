<template>
  <a-modal
    :visible="visible"
    title="Các đơn hàng của bạn"
    maskClosable="true"
    :centered="true"
    :footer="null"
    @cancel="$emit('closeTrackMyOrderModal')"
  >
    <div class="modal-container">
      <h2 class="order-title">
        Đơn hàng đang làm <a-badge color="yellow" status="processing" />
      </h2>
      <OrderItem :source="getDoingOrder"></OrderItem>
      <h2 class="order-title">
        Đơn hàng đã xong <a-badge color="#87d068" status="processing" />
      </h2>
      <OrderItem class="is-done-order" :source="getDoneOrder"></OrderItem>
    </div>
  </a-modal>
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
  watch: {
    visible(next) {
      if (next == true) {
        this.$store.dispatch("orders/fetchOrders");
      }
    },
  },

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
}
.is-done-order {
  background-color: rgba(125, 255, 197, 0.229);
  border-radius: 20px;
}
</style>
