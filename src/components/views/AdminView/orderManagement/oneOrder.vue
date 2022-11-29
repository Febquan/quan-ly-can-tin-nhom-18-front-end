<template>
  <div class="order-list">
    <div class="extra-info">
      <div>
        <a-tag>{{ this.item.onSite ? "Ăn tại chỗ" : "Mang về" }} </a-tag>
      </div>
      <a-tag>
        {{ this.getTimeString(this.item.arrive_at) }}
      </a-tag>
      <!-- <a-tag>
        {{ this.getTimeString(this.item.created_at) }}
      </a-tag> -->
      <a-tag :color="getStatusColor(item.status)">
        {{ this.getStatus(item.status) }}
      </a-tag>
    </div>
    <div class="client-info">
      <a-tag color="green" @click="copy(item._id)">{{ this.item._id }} </a-tag>
      <div class="client" v-if="item.user">
        <h3>
          {{ this.item.user.name }}
        </h3>
        <h3>{{ this.item.user.email }}</h3>
      </div>
      <div class="client" v-if="!item.user">
        <h3>
          {{ this.item.email }}
        </h3>
      </div>
    </div>
    <div v-for="i in this.item.order" :key="i.created_at" class="food-info">
      <a-divider />
      <div class="main-food">
        <h3>
          {{ i.object.name + ` (${i.quantity})` }}
        </h3>
        <h3>{{ i.object.price * i.quantity }} VNĐ</h3>
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
        <h4>{{ extraFood.object.price * extraFood.quantity }} VNĐ</h4>
      </div>
      <h4 class="description" v-if="i.description">
        Lưu ý: <span>{{ i.description }}</span>
      </h4>
    </div>
    <div class="order-cost">
      <h2>Thành tiền:</h2>
      <h2 class="cost-text">{{ this.item.cost }} VNĐ</h2>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
export default {
  props: {
    item: Object,
  },
  created() {
    console.log(this.item);
  },
  methods: {
    async copy(orderId) {
      await navigator.clipboard.writeText(orderId);
      this.$toast.success(`Copied`, {
        position: "bottom",
        duration: 800,
        queue: true,
        max: 0,
        pauseOnHover: false,
      });
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
    };
  },
};
</script>

<style scoped>
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
  border-radius: 20px;
  background-color: var(--white);
}
.order-cost {
  grid-column: 1 / span 2;
}
.food-info {
  grid-column: 1 / -1;
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
.description {
  text-align: left;
}
</style>