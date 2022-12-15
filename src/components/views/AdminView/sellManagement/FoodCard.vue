<template>
  <a-card
    class="body-card"
    @click="toggleAvailable"
    style="width: 250px; height: 270px"
  >
    <div class="fast-food-img-container">
      <img class="fast-food-img" alt="món ăn" :src="product.imgUrl" />
    </div>
    <div class="fast-food-description">
      <h1 class="fast-food-name">{{ this.product.name }}</h1>
    </div>
    <span class="amount-available" v-if="type == 'Dish' || type == 'ExtraFood'"
      >Còn {{ this.product.amountAvailable }}/
      {{ this.product.everyDayAmount }} suất</span
    >
    <span class="amount-available" v-if="type == 'FFAD'"
      >Còn {{ this.product.batch.reduce((b, cur) => b + cur.quantity, 0) }} suất
    </span>
    <div class="fast-food-info">
      <h4 class="fast-food-price">
        <span>Trung bình:</span>
        {{ this.convertVND(this.product.price) }}
      </h4>
    </div>
    <div v-if="type == 'Dish' || type == 'ExtraFood'">
      <a-popover trigger="click">
        <template #content>
          <a-input-number
            v-model:value="this.product.everyDayAmount"
            :min="0"
            @blur="updateAmount"
          />
        </template>
        <a-button class="amount"
          >{{ this.product.everyDayAmount }} suất/ngày</a-button
        >
      </a-popover>
    </div>
  </a-card>
</template>

<script>
import convertVND from "@/util/moneyformat";
// import dayjs from "dayjs";
export default {
  props: {
    prod: Object,
    type: String,
  },

  components: {},
  computed: {},
  methods: {
    async updateAmount() {
      try {
        this.$axios.post("/admin/findFoodUpdateEveryDayAmount", {
          id: this.product._id,
          amount: this.product.everyDayAmount,
        });
        this.$toast.success(`Sửa thành công`, {
          position: "bottom",
          duration: 800,
          queue: true,
          max: 0,
          pauseOnHover: false,
        });
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
    toggleAvailable() {
      this.isChange = !this.isChange;
    },
  },
  data() {
    return {
      convertVND: convertVND,
      product: this.prod,
      isChange: false,
    };
  },
};
</script>
<style scoped>
.food-view-main-container {
  display: grid;
}
.fast-food-img-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.fast-food-img {
  width: 100%;
  aspect-ratio: 4 / 2.8;
  object-fit: cover;
  border-radius: 1rem;
}
.body-card {
  border-radius: 1.5rem;
  box-shadow: 0px 0px 10px rgb(208, 208, 208);
  transition: box-shadow 300ms;
  justify-self: center;
}
.body-card:hover {
  box-shadow: 0px 0px 20px rgb(167, 167, 167);
}
.fast-food-description {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.fast-food-price {
  text-align: start;
}
.fast-food-name {
  font-weight: bold;
  font-size: 1.1rem;
  max-width: 100%;
}
.fast-food-price {
  font-size: 0.7rem;
  color: var(--primary-darker);
}
.fast-food-price > span {
  font-size: 0.8rem;
}
.fast-food-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.fast-food-status {
  font-size: 0.5rem;
}

.amount {
  font-size: 1rem;
  align-self: left;
  background-color: var(--primary);
  color: white;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40px;
  /* transform: translateX(-50%); */
  padding: 5px;
  border-radius: 0 0 20px 20px;
  border: none;
}
.amount:hover {
  background-color: var(--secondary);
  transition: background-color 300ms;
}
.amount-available {
  font-size: 0.8rem;
  align-self: left;
  background-color: var(--primary);
  color: white;
  position: absolute;
  padding: 5px;
  border-radius: 13px;
  right: 10px;
  top: 10px;
}
</style>
