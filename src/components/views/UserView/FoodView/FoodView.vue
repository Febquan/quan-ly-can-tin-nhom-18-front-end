<template>
  <div class="food-view">
    <div class="categories">
      <div class="category" @click="toggleMainFood" v-bind:style= "showMainFood ? 'background:var(--primary-darker)': 'background:var(blanchedalmond)'">
        <img src="@/assets/image/monchinh.png" alt="" srcset="">

      </div>
      <div class="category" @click="toggleFastFood" v-bind:style= "showFastFood ? 'background:var(--primary-darker)': 'background:var(blanchedalmond)'">
        <img src="@/assets/image/fastfood.png" alt="" srcset="">

      </div>
      <div class="category" @click="toggleDrink" v-bind:style= "showDrink ? 'background:var(--primary-darker)': 'background:var(blanchedalmond)'">
        <img src="@/assets/image/drink.png" alt="" srcset="">
      </div>
    </div>
    <a-spin class="spinner" v-if="isLoading" />
    <div class="list-food" v-show="showMainFood">
      <h1 class="main-food-title" v-if="!isLoading">Món chính</h1>
      <div class="dish-container" v-if="!isLoading">
        <MainFoodCardVue
          v-for="item in getDish"
          :dish="item"
          :key="item._id"
          @addDish="addDishHandler"
        ></MainFoodCardVue>
      </div>
    </div>
    <div class="list-food" v-show="showFastFood">
      <h1 class="main-food-title" v-if="!isLoading">Đồ ăn nhanh</h1>
      <div class="fast-food-container" v-if="!isLoading">
        <FastFoodCardVue
          v-for="item in getFastFood"
          :FastFood="item"
          :key="item._id"
          @click="addFFADHandler(item)"
        ></FastFoodCardVue>
      </div>
    </div>
    <div class="list-food" v-show="showDrink">
      <h1 class="main-food-title" v-if="!isLoading">Thức uống</h1>
      <div class="drink-container" v-if="!isLoading">
        <FastFoodCardVue
          v-for="item in getDrink"
          :FastFood="item"
          :key="item._id"
          @click="addFFADHandler(item)"
        ></FastFoodCardVue>
      </div>
    </div>
  </div>
  <AddDishModalVue
    :visible="addDishVisible"
    @closeAddDishModel="toggleAddDishVisible"
    :dish="dish"
  ></AddDishModalVue>
  <AddFFADModal
    :visible="addFFADVisible"
    @closeAddFFADModel="toggleAddFFADVisible"
    :FFAD="fastFoodAndDrink"
  ></AddFFADModal>
</template>

<script>
import MainFoodCardVue from "./FoodCard/MainFoodCard.vue";
import AddDishModalVue from "./FoodSection/AddDishModal.vue";
import FastFoodCardVue from "./FoodCard/FastFoodCard.vue";
import AddFFADModal from "./FoodSection/AddFFADModal.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    MainFoodCardVue,
    AddDishModalVue,
    FastFoodCardVue,
    AddFFADModal,
  },
  mounted() {
    this.$socket.on("OrderIsDone", (data) => {
      const orderId = data.orderComplete;
      if (
        this.$store.getters["orders/getDoingOrders"].find(
          (order) => order._id === orderId
        )
      ) {
        this.$notification.success({
          message: `Đơn hàng của bạn đã xong! `,
          description: `Xin vui lòng đến nhận hàng tại quầy`,
          placement: "bottomRight",
          duration: null,
        });
        this.$store.commit("orders/setOrderStatus", {
          orderId,
          status: "waiting",
        });
      }
    });
  },
  async created() {
    await this.fetchAllFood();
    await this.$store.dispatch("orders/fetchOrders", {
      noAuth: false,
      email: null,
    });

    this.isLoading = false;
    this.isMobile()
  },
  methods: {
    toggleAddDishVisible() {
      this.addDishVisible = !this.addDishVisible;
    },
    toggleAddFFADVisible() {
      this.addFFADVisible = !this.addFFADVisible;
    },
    addDishHandler(dish, future) {
      this.toggleAddDishVisible();
      dish.future = future;
      this.dish = dish;
    },
    addFFADHandler(FFAD) {
      if (!FFAD.isAvailable) {
        return;
      }
      this.toggleAddFFADVisible();
      this.fastFoodAndDrink = FFAD;
    },
    async fetchAllFood() {
      await this.$store.dispatch("prods/fetchAllData");
    },
    toggleMainFood() {
      this.showMainFood = !this.showMainFood;
      this.showFastFood=this.showDrink=false;
    },
    toggleFastFood() {
      this.showFastFood = !this.showFastFood;
      this.showMainFood=this.showDrink=false;

    },
    toggleDrink() {
      this.showDrink = !this.showDrink;
      this.showFastFood=this.showMainFood=false;
    },
    isMobile(){
      if (screen.width > 576) {
        this.showMainFood=this.showFastFood=this.showDrink = true;
      } else {
        this.showFastFood=this.showDrink=false;
      }
    }
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
      addFFADVisible: false,
      isLoading: true,
      showMainFood:true,
      showFastFood:false,
      showDrink:false,
      dish: {},
      future: false,
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
  width: 100%;
  overflow-y: auto;
  row-gap: 30px;
  column-gap: 20px;
  justify-items: center;
  align-content: center;
  padding: 40px;

  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}
.list-food{
  width: 90%;
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
  width: 100%;
  justify-items: center;
  align-content: center;
  padding: 40px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  column-gap: 10px;
  row-gap: 20px;
}
.categories{
  display: none;
}
@media only screen and (max-width: 576px) {
  .food-view{
    justify-content: flex-start;
  }
  .categories {
    display: flex;
    column-gap: 1.2rem;
    margin-top: 10vh;
    justify-content: center;
    background: white;
    padding: 20px 0;
    z-index: 1000;
    top: 0;
    position: fixed;
    width: 100%;
  }

  .category {
    display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
    border: 1px solid grey;
    gap: 1rem;
    padding: 1rem;
    background: blanchedalmond;
    width: 6rem;
  }

  .dish-container {
    column-gap: 10px;
    padding: 20px 10px;
  }

  .fast-food-container,
  .drink-container,
  .dish-container {
    width: 100%;
    grid-template-columns: 1fr 1fr;
    padding: 20px 0;
  }

  .list-food {
    margin-top: 15vh;
  width: 100%;
}

}
/* Tablet */
@media only screen and (min-width:577px) and (max-width:px){
  .list-food{
    padding: 20px;
  }
  .fast-food-container,
  .drink-container,
  .dish-container {
    padding: 20px 0;
    column-gap: 10px;
  }
}

</style>
