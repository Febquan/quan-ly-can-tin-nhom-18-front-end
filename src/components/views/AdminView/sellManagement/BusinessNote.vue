<template>
  <div class="container-warp">
    <h1 class="day-name">
      Kết toán ngày
      {{ this.dayjs(this.todayBusiness.date).format("DD/MM/YYYY") }}
    </h1>
    <div class="grid">
      <MoneyTable
        :tableName="'Chi phí vận hành'"
        v-if="todayBusiness.expenses"
        :source="todayBusiness.expenses"
        :id="todayBusiness._id"
        @isZero="setZero"
        @statusChange="setStatus"
      ></MoneyTable>
      <MoneyTable
        v-if="todayBusiness.status == 'waitingConfirm' && todayBusiness.loss"
        :tableName="'Tồn kho ngày'"
        :source="todayBusiness.loss"
        :key="2"
      ></MoneyTable>
      <MoneyTable
        v-if="todayBusiness.status == 'waitingConfirm' && todayBusiness.selling"
        :tableName="'Doanh thu'"
        :source="todayBusiness.selling"
        :total="todayBusiness.income"
        :key="3"
      ></MoneyTable>
      <span style="color: red; font-size: 1rem" v-if="isZero"
        >Vui lòng cập nhật giá trị chi phí vận hành để kết toán</span
      >
      <div style="display: flex; justify-content: center; align-items: center">
        <a-statistic
          v-if="todayBusiness.status == 'waitingConfirm'"
          :valueStyle="{ color: '#3f8600' }"
          :title="'Tổng lợi nhuận '"
          :value="convertVND(todayBusiness.totalProfit)"
        />
      </div>
      <div class="buttons-container">
        <a-button
          class="button"
          :disabled="isZero"
          @click="endDayCalculate"
          type="primary"
          >Kết toán</a-button
        >
        <a-button
          class="button"
          v-if="todayBusiness.status == 'waitingConfirm'"
          type="primary"
          @click="confirm"
          >Xác nhận</a-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import convertVND from "@/util/moneyformat";
import dayjs from "dayjs";

import MoneyTable from "./MoneyTable.vue";
export default {
  components: { MoneyTable },
  props: {
    business: Object,
    zero: Boolean,
  },

  computed: {
    todayBusiness() {
      return this.business;
    },
  },
  methods: {
    async confirm() {
      try {
        await this.$axios.post("admin/setDailyBusinessStatus", {
          id: this.todayBusiness._id,
          status: "completed",
        });

        this.$toast.success(`Xác thực kết toán thành công`, {
          position: "bottom",
          duration: 800,
          queue: true,
          max: 0,
          pauseOnHover: false,
        });
        this.$emit("reloadPls");
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
    setZero(val) {
      console.log("lol", val);
      this.isZero = val;
    },
    setStatus(val) {
      this.todayBusiness.status = val;
    },
    async endDayCalculate() {
      try {
        await this.$axios.post("admin/endOfDayCalculating", {
          date: this.todayBusiness.date,
        });

        this.$toast.success(`Kết toán thành công`, {
          position: "bottom",
          duration: 800,
          queue: true,
          max: 0,
          pauseOnHover: false,
        });
        this.$emit("reloadPls");
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
  },
  data() {
    return {
      convertVND,
      dayjs,
      isZero: this.zero,
    };
  },
};
</script>

<style scoped>
.container-warp {
  border: 2px solid var(--light-grey);
  border-radius: 20px;
  padding: 50px;
}
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}
.day-name {
  text-align: center;
  margin-bottom: 10px;
  font-size: 2.5rem;
  font-weight: bold;
}
.buttons-container {
  display: flex;
  gap: 20px;
  justify-content: center;
}
.button {
  height: 40px;
  width: 12%;
  font-size: 1.3rem;
}
</style>
