<template>
  <div class="container">
    <div class="menuManagement-container">
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
            :total="todayBusiness.totalExpenses"
            :id="todayBusiness._id"
            @isZero="setZero"
            @statusChange="setStatus"
          ></MoneyTable>
          <MoneyTable
            v-if="
              todayBusiness.status == 'waitingConfirm' && todayBusiness.loss
            "
            :tableName="'Tồn kho ngày'"
            :source="todayBusiness.loss"
            :total="todayBusiness.totalLoss"
            :key="2"
          ></MoneyTable>
          <MoneyTable
            v-if="
              todayBusiness.status == 'waitingConfirm' && todayBusiness.selling
            "
            :tableName="'Doanh thu'"
            :source="todayBusiness.selling"
            :total="todayBusiness.income"
            :key="3"
          ></MoneyTable>
          <span style="color: red; font-size: 1rem" v-if="isZero"
            >Vui lòng cập nhật giá trị chi phí vận hành để kết toán</span
          >
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
              >Xác nhận</a-button
            >
          </div>
        </div>
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

  async created() {
    try {
      const res1 = await this.$axios.post("/admin/findDailyBusiness", {
        inDuration: "day",
        atTime: dayjs(),
      });
      this.todayBusiness = res1.data.content[0];
    } catch (err) {
      console.log(err);
    }
  },
  computed: {},
  methods: {
    setZero(val) {
      this.isZero = val;
    },
    setStatus(val) {
      this.todayBusiness.status = val;
    },
    async endDayCalculate() {
      try {
        await this.$axios.post("admin/endOfDayCalculating");

        this.$toast.success(`Kết toán thành công`, {
          position: "bottom",
          duration: 800,
          queue: true,
          max: 0,
          pauseOnHover: false,
        });
        this.todayBusiness.status = "waitingConfirm";
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
      todayBusiness: {},
      isZero: true,
      unConfirmDay: {},
    };
  },
};
</script>

<style scoped>
.container {
  background-color: var(--white);
  height: 100%;
  width: 100%;
  overflow: auto;

  padding: 24px;
  column-gap: 30px;
  align-content: center;
}

.menuManagement-container {
  border: 4px solid var(--primary);
  border-radius: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  gap: 30px;
  padding: 40px;
  height: 100%;
  width: 100%;
}
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
