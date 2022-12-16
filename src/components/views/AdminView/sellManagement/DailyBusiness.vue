<template>
  <div class="container">
    <div class="menuManagement-container">
      <div class="container-warp">
        <h1 class="day-name">Kết toán ngày {{}} 15/10/2020</h1>

        <h2 class="section-name">Chi phí vận hành</h2>
        <h2 class="section-name">Doanh thu</h2>
        <h2 class="section-name">Lợi nhuận</h2>
      </div>
    </div>
  </div>
</template>

<script>
import convertVND from "@/util/moneyformat";
import dayjs from "dayjs";
// import FoodCard from "./FoodCard.vue";

export default {
  components: {},

  async mounted() {},

  methods: {},
  data() {
    return {
      convertVND,
      dayjs,
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

.day-name {
  text-align: left;
  margin-bottom: 10px;
  font-size: 2rem;
  font-weight: bold;
}
.section-name {
  text-align: left;
}
</style>
