<template>
  <div class="container">
    <draggable
      class="orders-container"
      v-model="reactiveWaitingOrders"
      :sort="false"
      ghost-class="ghost"
      handle-class="handle"
      group="orders"
      item-key="id"
      @add="sortWaitingOrders"
    >
      <template #item="{ element }">
        <oneOrderVue :item="element" :key="element._id"></oneOrderVue>
      </template>
    </draggable>
    <draggable
      class="orders-container"
      v-model="doingOrders"
      ghost-class="ghost"
      group="orders"
      item-key="id"
    >
      <template #item="{ element }">
        <oneOrderVue :item="element" :key="element._id"></oneOrderVue>
      </template>
    </draggable>
    <draggable
      class="orders-container"
      v-model="doneOrders"
      ghost-class="ghost"
      group="orders"
      item-key="id"
    >
      <template #item="{ element }">
        <oneOrderVue :item="element" :key="element._id"></oneOrderVue>
      </template>
    </draggable>
  </div>
</template>

<script>
import dayjs from "dayjs";
import oneOrderVue from "./oneOrder.vue";
import draggable from "vuedraggable";
export default {
  name: "OrderManagement",
  components: {
    draggable,
    oneOrderVue,
  },
  computed: {
    reactiveWaitingOrders() {
      return this.waitingOrders;
    },
  },
  data() {
    return {
      collapsed: false,
      selectedKeys: "",
      waitingOrders: null,
      doingOrders: null,
      doneOrders: null,
      dayjs: dayjs,
    };
  },
  methods: {
    sortWaitingOrders() {
      this.waitingOrders.sort((a, b) => {
        if (this.dayjs(a.arrive_at).diff(this.dayjs(b.arrive_at)) === 0) {
          return this.dayjs(a.created_at).diff(this.dayjs(b.created_at));
        } else {
          return this.dayjs(a.arrive_at).diff(this.dayjs(b.arrive_at));
        }
      });
    },
    getTimeString(string) {
      return this.dayjs(string).format("HH:mm DD/MM/YYYY").toString();
    },
  },
  async created() {
    const res = await this.$axios.get("admin/seeOrders");
    const data = res.data.content;
    this.waitingOrders = data.filter(
      (el) => el.status === "trusted" || el.status === "onSite"
    );
    this.doingOrders = data.filter((el) => el.status === "doing");
    this.doneOrders = data.filter((el) => el.status === "waiting");
  },
  mounted() {
    this.$socket.on("QueueChange", (data) => {
      this.waitingOrders.push(data.content);
      this.sortWaitingOrders();
      console.log(this.waitingOrders);
      this.$notification.success({
        message: `Đã có thêm một đơn hàng `,
        description: `Thời gian nhận đơn: ${this.getTimeString(
          data.content.arrive_at
        )}`,
        placement: "bottomRight",
        duration: null,
      });
    });
  },
};
</script>

<style scoped>
.container {
  background-color: var(--white);
  height: 100%;
  overflow: auto;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 24px;
  column-gap: 30px;
}

.orders-container {
  padding: 20px;
  height: 100%;
  background-color: var(--light-grey);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.ghost {
  border: 4px solid var(--secondary);
  transition: all 500ms;
}
</style>
