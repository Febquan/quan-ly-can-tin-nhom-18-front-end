<template>
  <div class="container">
    <h1 v-if="!isOverWork" class="off-time">
      Chỉ có thể truy cập vào trang này khi hết phiên bán hàng
      {{ $store.getters.getCloseHour }}h-{{ $store.getters.getOpenHour }}h
    </h1>
    <div
      class="menuManagement-container"
      :class="{
        isOverWork: !isOverWork,
      }"
    >
      <div class="container-warp">
        <h1>Món chính</h1>

        <div class="food-container">
          <a-input-search
            class="search"
            v-model:value="dishSearch"
            placeholder="Tên món ăn"
            size="large"
            @change="onDishSearch"
          />
          <FoodCard
            v-for="d in dish"
            :key="d._id"
            :prod="d"
            type="Dish"
          ></FoodCard>
        </div>
      </div>
      <div class="container-warp">
        <h1>Đồ ăn thêm</h1>
        <div class="food-container">
          <a-input-search
            class="search"
            v-model:value="extraFoodSearch"
            placeholder="Tên món ăn"
            size="large"
            @change="onExtraFoodSearch"
          />
          <FoodCard
            v-for="d in extraFood"
            :key="d._id"
            :prod="d"
            type="ExtraFood"
          ></FoodCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import convertVND from "@/util/moneyformat";
import dayjs from "dayjs";
import FoodCard from "./FoodCard.vue";

export default {
  components: {
    FoodCard,
  },

  async mounted() {
    const res = await this.$axios.get("/user/seeAllFood");
    this.food = res.data.food;
    this.dish = this.food.dish;
    this.extraFood = this.food.extraFood;
  },
  computed: {
    isOverWork() {
      return (
        dayjs().get("hour") >= this.$store.getters.getCloseHour ||
        dayjs().get("hour") < this.$store.getters.getOpenHour
      );
    },
  },

  methods: {
    onDishSearch() {
      this.dish = this.food.dish.filter((item) =>
        item.name.toLowerCase().includes(this.dishSearch.toLowerCase())
      );
    },
    onExtraFoodSearch() {
      this.extraFood = this.food.extraFood.filter((item) =>
        item.name.toLowerCase().includes(this.extraFoodSearch.toLowerCase())
      );
    },
  },
  data() {
    return {
      convertVND,
      dayjs,
      food: [],
      dish: [],
      extraFood: [],

      dishSearch: "",
      extraFoodSearch: "",
    };
  },
};
</script>

<style scoped>
.container {
  position: relative;
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
.food-container {
  min-height: 320px;
  row-gap: 30px;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}
.container-warp {
  border: 2px solid var(--light-grey);
  border-radius: 20px;
  padding: 50px;
}
.container-warp > h1 {
  margin-bottom: 10px;

  font-size: 2.8rem;
}
.search {
  width: 50%;
  justify-self: center;
  grid-column: 1 / -1;
}
.isOverWork {
  -webkit-filter: blur(10px);
  -moz-filter: blur(10px);
  -o-filter: blur(10px);
  -ms-filter: blur(10px);
  filter: blur(10px);
  pointer-events: none;
}
.off-time {
  width: 40%;
  font-size: 2rem;
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translateX(50%) translateY(-50%);
  font-weight: bold;
  z-index: 1000;
}
</style>
