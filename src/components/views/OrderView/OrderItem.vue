<template>
  <div class="hello1">
    <a-list class="hello2" item-layout="horizontal" :data-source="source">
      <template #renderItem="{ item }">
        <a-list-item>
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
                    <h3>{{ i.object.price }} VNĐ</h3>
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
                      {{ extraFood.object.price * extraFood.quantity }} VNĐ
                    </h4>
                  </div>
                </div>
                <div class="order-cost">
                  <h2>Thành tiền:</h2>
                  <h2 class="cost-text">{{ item.cost }} VNĐ</h2>
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
export default {
  name: "OrderItem",
  props: {
    source: Array,
  },
  methods: {
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
}
</style>
