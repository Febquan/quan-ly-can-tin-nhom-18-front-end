<template>
  <div class="container">
    <div class="menuManagement-container">
      <div class="flex">
        <h1 class="name">Thống kê theo tháng :</h1>
        <a-date-picker
          picker="month"
          v-model:value="month"
          format="MM-YYYY"
          @change="loadData"
        >
        </a-date-picker>
      </div>
      <div
        style="
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          overflow: auto;
        "
      >
        <a-empty v-if="!chartData" />
        <GChart
          type="ColumnChart"
          v-if="chartData"
          :data="chartData"
          :options="{
            chart: {
              title: 'Thống kê trong tháng',
              subtitle: 'Sales, Expenses, and Profit',
            },
            width: 850,
            height: 400,
          }"
        />
        <div style="display: flex; flex-direction: column; gap: 20px">
          <a-statistic
            :valueStyle="{ color: 'blue' }"
            :title="'Tổng doanh thu trong tháng '"
            :value="convertVND(totalSale)"
          />
          <a-statistic
            :valueStyle="{ color: 'red' }"
            :title="'Tổng chi phí trong tháng '"
            :value="convertVND(totalExpense)"
          />
          <a-statistic
            :valueStyle="{ color: 'orange' }"
            :title="'Tổng lợi nhuận trong tháng '"
            :value="convertVND(totalProfit)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import convertVND from "@/util/moneyformat";
import dayjs from "dayjs";
import { GChart } from "vue-google-charts";
export default {
  components: { GChart },

  computed: {
    totalProfit() {
      return this.data.reduce((sum, cur) => sum + cur[3], 0);
    },
    totalSale() {
      return this.data.reduce((sum, cur) => sum + cur[1], 0);
    },
    totalExpense() {
      return this.data.reduce((sum, cur) => sum + cur[2], 0);
    },
  },
  async created() {
    await this.loadData();
  },
  methods: {
    async loadData() {
      try {
        this.chartData = null;
        let res = await this.$axios.post("/admin/findDailyBusiness", {
          atTime: this.month,
          inDuration: "month",
        });

        this.Days = res.data.content;
        this.data = this.Days.map((el) => [
          dayjs(el.date).format("DD/MM/YYYY").toString(),
          el.income,
          el.totalExpenses,
          el.totalProfit,
        ]);
        if (this.data.length) {
          this.chartData = [
            ["Month", "Sales", "Expenses", "Profit"],
            ...this.data,
          ];
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
  data() {
    return {
      convertVND,
      dayjs,
      Days: [],
      chartData: null,
      data: [],
      month: dayjs(),
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
.name {
  font-size: 2rem;
  text-align: left;
  font-weight: bold;
}
.flex {
  display: flex;
  gap: 10px;
  width: 100%;
}
</style>
