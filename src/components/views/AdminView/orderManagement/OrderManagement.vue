<template>
  <div class="container">
    <div>
      <h1 class="container-title">Đơn hàng trong hàng đợi</h1>
      <draggable
        class="orders-container"
        v-model="reactiveWaitingOrders"
        :sort="false"
        ghost-class="ghost"
        group="waiting-orders"
        @add="sortWaitingOrders"
        @remove="trigger"
      >
        <template #item="{ element }">
          <oneOrderVue :item="element" :key="element._id"></oneOrderVue>
        </template>
      </draggable>
    </div>
    <div>
      <h1 class="container-title">Đơn hàng đang làm</h1>
      <draggable
        class="orders-container"
        v-model="doingOrders"
        ghost-class="ghost"
        :sort="false"
        :group="{
          name: 'doing-orders',
          put: ['waiting-orders'],
        }"
        @change="setDoingOrder"
      >
        <template #item="{ element }">
          <oneOrderVue :item="element" :key="element._id"></oneOrderVue>
        </template>
      </draggable>
    </div>
    <div>
      <h1 class="container-title">Đơn hàng đã làm xong</h1>
      <draggable
        class="orders-container"
        v-model="doneOrders"
        ghost-class="ghost"
        :group="{
          name: 'done-orders',
          put: ['waiting-orders', 'doing-orders'],
        }"
        :sort="false"
        @change="setDoneOrder"
      >
        <template #item="{ element }">
          <oneOrderVue :item="element" :key="element._id"></oneOrderVue>
        </template>
      </draggable>
    </div>
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
    reactiveWaitingOrders: {
      get() {
        return this.waitingOrders;
      },
      set(newValue) {
        this.waitingOrders = newValue;
      },
    },
  },
  data() {
    return {
      // limit: 2,
      collapsed: false,
      waitingOrders: [],
      doingOrders: [],
      doneOrders: [],
      // cutWaitingOrders: [],
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
    sortDoingOrders() {
      this.doingOrders.sort((a, b) => {
        if (this.dayjs(a.arrive_at).diff(this.dayjs(b.arrive_at)) === 0) {
          return this.dayjs(a.created_at).diff(this.dayjs(b.created_at));
        } else {
          return this.dayjs(a.arrive_at).diff(this.dayjs(b.arrive_at));
        }
      });
    },
    sortDoneOrders() {
      this.doneOrders.sort((a, b) => {
        if (this.dayjs(a.arrive_at).diff(this.dayjs(b.arrive_at)) === 0) {
          return this.dayjs(a.created_at).diff(this.dayjs(b.created_at));
        } else {
          return this.dayjs(a.arrive_at).diff(this.dayjs(b.arrive_at));
        }
      });
    },
    ok() {
      this.$toast.success(`Cập nhập thành công`, {
        position: "bottom",
        duration: 800,
        queue: true,
        max: 0,
        pauseOnHover: false,
      });
    },
    err(error) {
      this.$toast.error(error.response.data.message, {
        position: "bottom",
        duration: 1500,
        enqueue: true,
        max: 0,
        pauseOnHover: false,
      });
    },
    async setDoingOrder(item) {
      try {
        item.added.element.status = "doing";
        const orderId = item.added.element._id;
        await this.$axios.post("admin/setOrderStatus", {
          orderId: orderId,
          status: "doing",
        });
        this.sortDoingOrders();
        this.ok();
      } catch (error) {
        this.err(error);
      }
    },
    async setDoneOrder(item) {
      try {
        item.added.element.status = "waiting";
        const orderId = item.added.element._id;
        await this.$axios.post("admin/setOrderStatus", {
          orderId: orderId,
          status: "waiting",
        });
        this.sortDoneOrders();
        this.ok();
      } catch (error) {
        this.err(error);
      }
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
    // this.cutWaitingOrders = this.waitingOrders.splice(0, this.limit);
    // this.cutdoingOrders = this.doingOrders.splice(0, this.limit);
    // this.cutWaitingOrders = this.waitingOrders.splice(0, this.limit);
  },
  mounted() {
    this.$socket.on("QueueChange", (data) => {
      if (data.message === "OrderAdded") {
        this.waitingOrders.push(data.content);
        this.sortWaitingOrders();
        this.$notification.success({
          message: `Đã có thêm một đơn hàng `,
          description: `Thời gian nhận đơn: ${this.getTimeString(
            data.content.arrive_at
          )}`,
          placement: "bottomRight",
        });
      }
      if (data.message === "OrderRemoved") {
        const index = this.waitingOrders.findIndex(
          (el) => el._id === data.orderId
        );
        this.waitingOrders.splice(index, 1);
        this.$notification.warning({
          message: `Đã có một đơn hàng bị hủy `,
          description: `Mã đơn: ${data.orderId}`,
          placement: "bottomRight",
        });
      }
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
.container-title {
  font-size: 30px;
}
</style>
