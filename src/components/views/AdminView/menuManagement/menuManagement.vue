<template>
  <div class="container">
    <div class="menuManagement-container">
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
      <div class="container-warp">
        <h1>Đồ ăn nhanh</h1>
        <div class="food-container">
          <a-input-search
            class="search"
            v-model:value="FFADSearch"
            placeholder="Tên món ăn"
            size="large"
            @change="onFFADSearch"
          />
          <FoodCard
            v-for="d in FFAD"
            :key="d._id"
            :prod="d"
            type="FFAD"
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
    this.FFAD = this.food.fastFoodAndDrink;
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
    onFFADSearch() {
      this.FFAD = this.food.fastFoodAndDrink.filter((item) =>
        item.name.toLowerCase().includes(this.FFADSearch.toLowerCase())
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
      FFAD: [],
      dishSearch: "",
      extraFoodSearch: "",
      FFADSearch: "",
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
.food-container {
  min-height: 320px;
  row-gap: 30px;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
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
</style>
