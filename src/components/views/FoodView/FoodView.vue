<template>
  <div class="food-view">
    <a-spin class="spinner" v-if="isLoading" />
    <h1 class="main-food-title" v-if="!isLoading">Món chính</h1>
    <div class="dish-container" v-if="!isLoading">
      <MainFoodCardVue
        v-for="item in getDish"
        :dish="item"
        :key="item._id"
        @addDish="addDishHandler"
      ></MainFoodCardVue>
    </div>
    <h1 class="main-food-title" v-if="!isLoading">Đồ ăn nhanh</h1>
    <div class="fast-food-container" v-if="!isLoading">
      <FastFoodCardVue
        v-for="item in getFastFood"
        :FastFood="item"
        :key="item._id"
      ></FastFoodCardVue>
    </div>
    <h1 class="main-food-title" v-if="!isLoading">Thức uống</h1>
    <div class="fast-food-container" v-if="!isLoading">
      <FastFoodCardVue
        v-for="item in getDrink"
        :FastFood="item"
        :key="item._id"
      ></FastFoodCardVue>
    </div>
  </div>
  <AddDishModalVue
    :visible="addDishVisible"
    @closeAddDishModel="toggleAddDishVisible"
    :dish="dish"
  ></AddDishModalVue>
</template>

<script>
import MainFoodCardVue from "./FoodCard/MainFoodCard.vue";
import AddDishModalVue from "./FoodSection/AddDishModal.vue";
import FastFoodCardVue from "./FoodCard/FastFoodCard.vue";

import { mapGetters } from "vuex";
export default {
  components: {
    MainFoodCardVue,
    AddDishModalVue,
    FastFoodCardVue,
  },
  async created() {
    await this.fetchAllFood();
    this.isLoading = false;
  },
  methods: {
    toggleAddDishVisible() {
      this.addDishVisible = !this.addDishVisible;
    },
    addDishHandler(dish) {
      this.toggleAddDishVisible();
      this.dish = dish;
    },
    async fetchAllFood() {
      await this.$store.dispatch("prods/fetchAllData");
    },
  },
  computed: {
    ...mapGetters("prods", [
      "getDish",
      "getFastFoodAndDrink",
      "getExtraFood",
      "getDrink",
      "getFastFood",
    ]),
  },
  data() {
    return {
      addDishVisible: false,
      isLoading: true,
      dish: {},
      fastFoodAndDrink: {},
      extraFood: {},
    };
  },
};
</script>

<style scoped>
.dish-container {
  display: grid;
  /* border: 2px dashed var(--black);
  border-radius: 40px; */
  width: 90%;

  overflow-y: auto;
  row-gap: 30px;
  column-gap: 20px;
  justify-items: center;
  align-content: center;
  padding: 40px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}
.food-view {
  min-height: 90vh;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.spinner {
  scale: 2.5;
}
.main-food-title {
  font-size: 3rem;
  margin-top: 20px;
}
.drink-container,
.fast-food-container {
  width: 90%;

  justify-items: center;
  align-content: center;
  padding: 40px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  column-gap: 10px;
  row-gap: 20px;
}
</style>
