<template>
  <div class="hello1">
    <a-list class="hello2" item-layout="horizontal" :data-source="source">
      <template #renderItem="{ item }">
        <a-list-item class="item-list">
          <a-list-item-meta>
            <template #title>
              <div class="order-list">
                <div class="extra-info">
                  <div>
                    <a-tag>{{ item.onSite ? "Ăn tại chỗ" : "Mang về" }} </a-tag>
                  </div>
                  <a-tag>
                    {{ this.getTimeString(item.created_at) }}
                  </a-tag>
                  <a-tag :color="getStatusColor(item.status)">
                    {{ this.getStatus(item.status) }}
                  </a-tag>
                </div>
                <div
                  v-for="i in item.order"
                  :key="i.created_at"
                  class="food-info"
                >
                  <div class="main-food">
                    <h3>
                      {{ i.object.name + ` (${i.quantity})` }}
                    </h3>
                    <h3>{{ this.convertVND(i.object.price * i.quantity) }}</h3>
                  </div>

                  <div
                    class="extra-food"
                    v-for="extraFood in i.extraFood"
                    :key="extraFood._id"
                  >
                    <h4>
                      +
                      {{ extraFood.object.name + ` (${extraFood.quantity})` }}
                    </h4>
                    <h4>
                      {{
                        this.convertVND(
                          extraFood.object.price * extraFood.quantity
                        )
                      }}
                    </h4>
                  </div>
                </div>
                <div class="order-cost">
                  <h2>Thành tiền:</h2>
                  <h2 class="cost-text">{{ this.convertVND(item.cost) }}</h2>
                </div>
                <div class="order-del">
                  <!-- <h2>hello</h2>
                  <h2 class="cost-text">{{ item.status }} </h2> -->
                  <a-button
                    v-if="item.status == 'trusted' || item.status == 'onSite'"
                    @click="delOrder(item._id)"
                  >
                    Hủy đơn đặt hàng
                  </a-button>
                  <a-button
                    type="primary"
                    v-if="item.status == 'waiting'"
                    @click="$emit('openQrModal', item._id)"
                    >QR CODE</a-button
                  >
                </div>
              </div>
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>
<script>
import dayjs from "dayjs";
import convertVND from "@/util/moneyformat";
export default {
  name: "OrderItem",
  props: {
    source: Array,
  },

  methods: {
    async delOrder(id) {
      try {
        await this.$axios.put(`/user/deleteOrder`, {
          orderId: id,
        });
        this.$toast.success(`Xóa order thành công !`, {
          position: "bottom",
          duration: 2000,
          queue: true,
          max: 0,
          pauseOnHover: false,
        });
        this.$store.commit("orders/deleteOrder", id);
      } catch (error) {
        this.$toast.error(error.response.data.message, {
          position: "bottom",
          duration: 1500,
          enqueue: true,
          max: 0,
          pauseOnHover: false,
        });
      }
    },
    getTimeString(string) {
      return this.dayjs(string).format("HH:mm DD/MM/YYYY").toString();
    },
    getStatus(string) {
      if (string === "doing") {
        return "Đang làm";
      }
      if (string === "waiting") {
        return "Đã làm xong";
      }
      return "Trong hàng đợi";
    },
    getStatusColor(string) {
      if (string === "doing") {
        return "blue";
      }
      if (string === "waiting") {
        return "green";
      }
      return "gold";
    },
  },
  data() {
    return {
      dayjs: dayjs,
      convertVND: convertVND,
    };
  },
};
</script>
<style scoped>
.hello2 {
  width: 100%;
}
.hello1 {
  width: 100%;

  padding: 20px;
}
.extra-food,
.main-food {
  display: flex;
  justify-content: space-between;
}
.order-cost {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--primary-darker);
}
.cost-text {
  border-top: 2px dashed rgb(70, 219, 120);
}
.order-list {
  display: grid;
  grid-template-columns: 1fr 2fr;
  padding: 20px;
  border: 3px solid var(--grey);
  border-radius: 20px;
}
.order-cost {
  grid-column: 1 / span 2;
}
.food-info {
  grid-column: 2 / span 1;
}
.extra-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  justify-content: center;
  align-items: center;
  grid-row: 1 / -3;
  align-self: center;
}
.order-del {
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
