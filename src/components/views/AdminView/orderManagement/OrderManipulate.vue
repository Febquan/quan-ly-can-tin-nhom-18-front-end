<template>
  <div class="container">
    <div class="order-container">
      <div class="order-inner-container">
        <a-empty v-if="!order" />

        <a-input-search
          class="search"
          v-model:value="search"
          placeholder="Email or order id"
          size="large"
          @search="onSearch"
        >
          <template #enterButton>
            <a-button type="primary">Search</a-button>
          </template>
        </a-input-search>
        <a-spin v-if="isLoading" class="spin"></a-spin>
        <div class="orders" v-if="!isLoading && order">
          <div class="order-wrap">
            <oneOrder
              v-for="item in order"
              :item="item"
              :key="item._id"
              class="order"
              :isChangeOrder="true"
              @openChangeModal="openChangeModal"
            ></oneOrder>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import convertVND from "@/util/moneyformat";
import oneOrder from "./oneOrder.vue";

export default {
  name: "OrderPayment",
  components: {
    oneOrder,
  },
  data() {
    return {
      order: null,
      isLoading: false,
      search: "",
      visible: false,
      convertVND: convertVND,
      orderId: "",
    };
  },

  methods: {
    async onSearch() {
      try {
        this.isLoading = true;
        const res = await this.$axios.post("admin/searchEmailAndId", {
          search: this.search,
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
  },
};
</script>

<style scoped>
.container {
  background-color: var(--white);
  height: 100%;
  overflow: auto;
  display: grid;
  padding: 24px;
  column-gap: 30px;
  align-content: center;
}
.order-inner-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
  max-height: 380px;
  overflow-y: auto;
  width: 100%;
  height: 100%;
}
.input-pay {
  width: max-content;
}
.spin {
  scale: 2;
}
.modal-container {
  display: flex;
  gap: 10px;
  flex-direction: column;
}
</style>
