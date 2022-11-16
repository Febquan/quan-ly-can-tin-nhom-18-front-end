<template>
  <div class="food-view">
    <a-spin class="spinner" v-if="isLoading" />
    <div class="dish-container" v-if="!isLoading">
      <MainFoodCardVue
        v-for="item in getDish"
        :dish="item"
        :key="item._id"
        @addDish="addDishHandler"
      ></MainFoodCardVue>
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
import { mapGetters } from "vuex";
export default {
  components: {
    MainFoodCardVue,
    AddDishModalVue,
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
    ...mapGetters("prods", ["getDish", "getFastFoodAndDrink", "getExtraFood"]),
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
  padding: 40px;
  /* border: 2px dashed var(--black);
  border-radius: 40px; */
  width: 100%;
  row-gap: 30px;
  justify-items: center;
  align-content: center;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}
.food-view {
  min-height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.spinner {
  scale: 2.5;
}
</style>
