<template>
  <a-card class="body-card" style="width: 200px; height: 200px">
    <div class="fast-food-img-container">
      <img class="fast-food-img" alt="món ăn" :src="FastFood.imgUrl" />
    </div>
    <div class="fast-food-description">
      <h1 class="fast-food-name">{{ this.FastFood.name }}</h1>
    </div>
    <div class="fast-food-info">
      <h4 class="fast-food-price">
        <span>Giá:</span> {{ this.convertVND(this.FastFood.price) }}
      </h4>
      <a-tag class="fast-food-status" :color="isAvailable ? 'green' : 'red'">{{
        isAvailable ? "Còn hàng" : "Hết hàng"
      }}</a-tag>
    </div>
  </a-card>
</template>

<script>
import convertVND from "@/util/moneyformat";
import dayjs from "dayjs";
export default {
  props: {
    FastFood: Object,
  },
  components: {},
  computed: {
    isAvailable() {
      let amountAvailable = 0;
      for (const i of this.FastFood.batch) {
        if (dayjs().diff(dayjs(i.expiredDated) < 0)) {
          amountAvailable = amountAvailable + i.quantity;
        }
      }
      return amountAvailable > 0;
    },
  },
  methods: {
    addToCart() {
      this.$store.dispatch("cart/addCart", this.FastFood);
    },
  },
  data() {
    return {
      convertVND: convertVND,
    };
  },
};
</script>
<style scoped>
.food-view-main-container {
  display: grid;
}
.fast-food-img-container {
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.fast-food-img {
  height: 100%;
  aspect-ratio: 1 / 1;
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
  font-size: 18px;
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
  font-size: 1rem;
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
.plus {
  top: 10%;
  right: 10%;
  position: absolute;
}
.available {
  color: var(--primary);
}
.unAvailable {
  color: var(--grey);
}
</style>
