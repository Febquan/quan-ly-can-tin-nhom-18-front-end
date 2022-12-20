<template>
  <div class="section">
    <div class="grid-row">
      <div>
        <h2 class="section-name">{{ this.tableName }}</h2>
        <div class="money-table">
          <div class="table-header">
            <span>Tên</span>
            <span>Số lượng</span>
            <span>Giá trị</span>
          </div>
          <MoneyCard
            v-for="item in items"
            :thing="item"
            :key="item._id"
            :isChange="isChange"
          ></MoneyCard>
        </div>
      </div>
      <div class="statistic">
        <div class="statistic-row">
          <div style="height: 100%">
            <GChart
              type="PieChart"
              :data="chartData"
              :options="{
                tooltip: { trigger: 'selection' },
                title: tableName,
                width: '100%',
                height: '100%',
                chartArea: {
                  width: '80%',
                  height: '80%',
                },
              }"
            />
          </div>
          <div
            style="display: flex; justify-content: center; align-items: center"
          >
            <a-statistic
              :valueStyle="{ color: '#3f8600' }"
              :title="'Tổng ' + tableName.toLocaleLowerCase()"
              :value="convertVND(sumMoney.toFixed(2))"
            />
          </div>
          <div class="buttons-container">
            <a-button
              class="button"
              v-if="!isChange && tableName == 'Chi phí vận hành'"
              @click="toggleChange"
              type="primary"
              >Cập nhật</a-button
            >
            <a-button
              class="button"
              v-if="isChange"
              @click="cancel"
              type="primary"
              >Hủy</a-button
            >
            <a-button
              class="button"
              v-if="isChange"
              @click="update"
              type="primary"
              >Lưu</a-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import convertVND from "@/util/moneyformat";
import MoneyCard from "./MoneyCard.vue";
import { GChart } from "vue-google-charts";
export default {
  props: {
    tableName: String,
    source: Array[Object],
    id: String,
  },
  components: { MoneyCard, GChart },
  computed: {
    chartData() {
      return [
        ["name", "quantity"],
        ...this.items.map((el) => [el.name, el.cost]),
      ];
    },
    sumMoney() {
      return this.items.reduce((sum, cur) => sum + cur.cost, 0);
    },
  },
  created() {},
  methods: {
    toggleChange() {
      this.isChange = !this.isChange;
    },
    cancel() {
      this.items = JSON.parse(JSON.stringify(this.source));
      this.toggleChange();
    },
    isZero() {
      let zero = false;
      for (let item of this.items) {
        if (item.cost == 0) {
          zero = true;
        }
      }
      return zero;
    },
    async update() {
      try {
        await this.$axios.post("admin/updateDailyBusinessExpenses", {
          expenses: this.items,
          totalExpense: this.sumMoney,
          dailyBusinessId: this.id,
        });

        this.$toast.success(`Cập nhập chi phí thành công`, {
          position: "bottom",
          duration: 800,
          queue: true,
          max: 0,
          pauseOnHover: false,
        });
        this.$emit("isZero", this.isZero());
        this.$emit("statusChange", "uncompleted");
        this.items = this.items.filter((el) => el.kind != "FastFoodAndDrink");
        this.toggleChange();
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
      convertVND: convertVND,
      items: JSON.parse(JSON.stringify(this.source ? this.source : {})),
      isChange: false,
    };
  },
};
</script>

<style scoped>
.section-name {
  text-align: center;
  font-size: 1.5rem;
}

.money-table {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  border: 2px solid var(--light-grey);
  border-radius: 20px;
  padding: 10px;
  overflow-y: auto;
  border: 2px solid rgb(29, 29, 29);
  gap: 5px;
}
.grid-row {
  display: grid;
  grid-template-columns: 0.8fr 1fr;
  gap: 20px;
}
.table-header {
  display: grid;
  grid-template-columns: 3fr 1fr 1.5fr;
  justify-items: center;
  background-color: var(--light-grey);
  border-radius: 5px;
  border-bottom: 2px solid rgb(29, 29, 29);
}
.statistic {
  display: flex;

  justify-content: center;
  align-items: center;
  gap: 10px;
}
.statistic-row {
  display: grid;
  grid-template-columns: 1fr 2fr;
  justify-items: center;
  align-content: center;
}
.buttons-container {
  grid-column: 1 / -1;
  display: flex;
  gap: 10px;
}
</style>
