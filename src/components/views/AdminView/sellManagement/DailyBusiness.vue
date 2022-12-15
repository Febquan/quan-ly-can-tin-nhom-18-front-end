<template>
  <div class="container">
    <div class="menuManagement-container">
      <div class="container-warp"></div>
    </div>
  </div>
</template>

<script>
import convertVND from "@/util/moneyformat";
import dayjs from "dayjs";
// import FoodCard from "./FoodCard.vue";

export default {
  components: {},

  async mounted() {
    const res = await this.$axios.get("/user/seeAllFood");
    this.food = res.data.food;
    this.dish = this.food.dish;
    this.extraFood = this.food.extraFood;
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
.container-warp > h1 {
  margin-bottom: 10px;

  font-size: 2.8rem;
}
</style>
