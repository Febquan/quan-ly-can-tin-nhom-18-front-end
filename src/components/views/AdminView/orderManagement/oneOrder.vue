<template>
  <div class="order-list" v-if="order">
    <div class="extra-info">
      <div>
        <a-tag v-if="!changeState"
          >{{ this.order.onSite ? "Ăn tại chỗ" : "Mang về" }}
        </a-tag>
        <a-select
          :value="order.onSite ? 'Ăn tại chỗ' : 'Mang về'"
          @change="onSiteChange"
          size="small"
          v-if="changeState"
        >
          <a-select-option :value="true">Ăn tại chỗ</a-select-option>
          <a-select-option :value="false">Mang về</a-select-option>
        </a-select>
      </div>
      <a-tag v-if="!changeState">
        {{ this.getTimeString(this.order.arrive_at) }}
      </a-tag>
      <a-date-picker
        v-if="changeState"
        :value="dayjs(order.arrive_at)"
        format="HH:mm DD/MM/YYYY"
        @change="onTimeChange"
        :disabled-date="disabledDate"
        placeholder="Thời gian nhận hàng"
        :show-time="{ defaultValue: dayjs() }"
      />
      <a-tag :color="getStatusColor(order.status)" v-if="!changeState">
        {{ this.getStatus(this.order.status) }}
      </a-tag>
      <a-select
        :value="order.status"
        size="small"
        style="width: 150px"
        v-if="changeState"
        @change="onStatusChange"
      >
        <a-select-option value="trusted">Trong hàng đợi</a-select-option>
        <a-select-option value="doing">Đang làm</a-select-option>
        <a-select-option value="waiting">Đã làm xong</a-select-option>
      </a-select>
    </div>
    <div class="client-info">
      <a-tag color="green" @click="copy(order._id)"
        >{{ this.order._id }}
      </a-tag>
      <div class="client" v-if="order.user">
        <h3>
          {{ this.order.user.name }}
        </h3>
        <h3>{{ this.order.user.email }}</h3>
      </div>
      <div class="client" v-if="!order.user">
        <h3>{{ this.order.email }}</h3>
      </div>
    </div>
    <div v-for="(i, indexDish) in order.order" :key="i._id" class="food-info">
      <a-divider />
      <div class="main-food">
        <h3>
          {{ i.object.name }}
          <span v-if="!changeState">{{ ` (${i.quantity})` }}</span>
          <a-input-number
            :min="0"
            :defaultValue="i.quantity"
            placeholder="Số lượng"
            @change="(value) => dishQuantityChange(indexDish, value)"
            v-if="changeState"
          />
        </h3>
        <h3>{{ this.convertVND(i.object.price * i.quantity) }}</h3>
      </div>

      <div
        class="extra-food"
        v-for="(extraFood, indexEx) in i.extraFood"
        :key="extraFood._id"
      >
        <h4>
          +
          {{ extraFood.object.name }}
          <span v-if="!changeState">{{ ` (${extraFood.quantity})` }}</span>
          <a-input-number
            :min="1"
            :defaultValue="extraFood.quantity"
            placeholder="Số lượng"
            @change="
              (value) => extraFoodQuantityChange(indexDish, indexEx, value)
            "
            v-if="changeState"
          />
        </h4>

        <h4>
          {{ this.convertVND(extraFood.object.price * extraFood.quantity) }}
        </h4>
      </div>
      <h4 class="description" v-if="i.description">
        Lưu ý: <span>{{ i.description }}</span>
      </h4>
    </div>
    <div class="order-cost">
      <h2>Thành tiền:</h2>
      <h2 class="cost-text">{{ this.convertVND(this.order.cost) }}</h2>
    </div>
    <div class="button-container">
      <a-button
        class="pay-button"
        v-if="isPayment"
        :disabled="order.status == 'paid'"
        type="primary"
        @click="
          $emit('openPaymentModal', {
            cost: order.cost,
            orderId: order._id,
          })
        "
        >Thanh toán</a-button
      >
      <a-button
        class="change-button"
        v-if="isChangeOrder && !changeState"
        type="primary"
        @click="handleChange"
        >Sửa đổi đơn hàng</a-button
      >
      <a-button
        class="del-button"
        v-if="changeState"
        type="primary"
        @click="handleDel"
        >Xóa đơn</a-button
      >
      <a-button
        class="del-button"
        v-if="changeState"
        type="primary"
        @click="handleUpdate"
        >Cập nhập</a-button
      >
      <a-button
        class="cancel-button"
        v-if="changeState"
        type="primary"
        @click="cancelChange"
        >Hủy</a-button
      >
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import convertVND from "@/util/moneyformat";

export default {
  props: {
    item: Object,
    isPayment: Boolean,
    isChangeOrder: Boolean,
  },

  methods: {
    onSiteChange(value) {
      this.order.onSite = value;
    },
    onTimeChange(value) {
      this.order.arrive_at = value.toString();
    },
    onStatusChange(value) {
      this.order.status = value;
    },
    cancelChange() {
      this.changeState = !this.changeState;
      this.order = JSON.parse(JSON.stringify(this.item));
    },
    calCost() {
      this.order.cost = this.order.order.reduce(
        (cost, prod) =>
          cost +
          prod.object.price * prod.quantity +
          prod.extraFood.reduce(
            (sum, el) => sum + el.object.price * el.quantity,
            0
          ),
        0
      );
    },
    async handleDel() {
      try {
        await this.$axios.post(`admin/findOrderAndDelete`, {
          orderId: this.order._id,
        });
        this.$toast.success(`Xóa order thành công`, {
          position: "bottom",
          duration: 800,
          queue: true,
          max: 0,
          pauseOnHover: false,
        });
        this.changeState = false;
        this.order = null;
      } catch (error) {
        this.$toast.error(error.response.data.message, {
          position: "bottom",
          duration: 2000,
          queue: true,
          max: 0,
          pauseOnHover: false,
        });
      }
    },
    dishQuantityChange(index, value) {
      this.order.order[index].quantity = value;
      this.calCost();
    },
    extraFoodQuantityChange(indexFood, indexEx, value) {
      this.order.order[indexFood].extraFood[indexEx].quantity = value;
      this.calCost();
    },
    handleChange() {
      this.changeState = !this.changeState;
    },
    async handleUpdate() {
      try {
        await this.$axios.post(`admin/findOrderAndUpdate`, {
          order: this.order,
        });
        this.$toast.success(`Cập nhập thành công`, {
          position: "bottom",
          duration: 800,
          queue: true,
          max: 0,
          pauseOnHover: false,
        });
        this.changeState = false;
      } catch (error) {
        this.$toast.error(error.response.data.message, {
          position: "bottom",
          duration: 2000,
          queue: true,
          max: 0,
          pauseOnHover: false,
        });
      }
    },
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
      if (string === "paid") {
        return "Đã thanh toán";
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
      if (string === "paid") {
        return "purple";
      }
      return "gold";
    },

    //////change

    disabledDate(current) {
      return current < dayjs().startOf("day");
    },
  },

  watch: {
    "order.status"(val) {
      console.log(val, "heloooooooo");
    },
  },

  data() {
    return {
      dayjs: dayjs,
      convertVND: convertVND,
      changeState: false,
      order: JSON.parse(JSON.stringify(this.item)),
      // onSite: this.order.onSite ? "Ăn tại chỗ" : "Mang về",
      // arrive_at: dayjs(this.order.arrive_at),
      // status: this.order.status,
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
.button-container {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  grid-column: 1/-1;
  gap: 20px;
}
.pay-button {
  width: 98%;
}
</style>
