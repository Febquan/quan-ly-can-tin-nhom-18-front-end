<template>
  <a-card class="body-card" style="width: 300px">
    <div class="dish-img-container">
      <img class="dish-img" alt="món ăn" :src="dish.imgUrl" />
    </div>
    <div class="dish-description">
      <h1 class="dish-name">{{ this.dish.name }}</h1>
    </div>
    <div class="dish-info">
      <h4 class="dish-price">
        <span>Giá:</span> {{ this.convertVND(this.dish.price) }}
      </h4>
      <a-tag class="dish-status" :color="sellAble ? 'green' : 'red'">{{
        sellAble ? "Còn hàng" : "Hết hàng"
      }}</a-tag>
    </div>

    <a-button
      v-if="this.dish.amountAvailable > 0"
      class="add-dish-button"
      type="primary"
      @click="$emit('addDish', dish)"
      :disabled="!this.dish.isAvailable"
      >Thêm vào đơn hàng</a-button
    >
    <a-popconfirm
      title="Vì món ăn này đã hết nên đơn hàng này chỉ có thể được đặt vào ngày mai"
      ok-text="Thêm vào đơn hàng"
      cancel-text="Hủy"
      @confirm="$emit('addDish', dish, true)"
      @cancel="cancel"
    >
      <a-button
        v-if="!this.dish.amountAvailable > 0"
        class="add-dish-button"
        type="primary"
        >Thêm đơn sau hôm nay</a-button
      >
    </a-popconfirm>
  </a-card>
</template>

<script>
import convertVND from "@/util/moneyformat";
export default {
  props: {
    dish: Object,
  },
  computed: {
    sellAble() {
      return this.dish.isAvailable && this.dish.amountAvailable > 0;
    },
  },
  methods: {
    addToCart() {
      this.$store.dispatch("cart/addCart", this.dish);
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
.dish-img-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.dish-img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 1rem;
}
.body-card {
  border-radius: 1.5rem;
  box-shadow: 0px 0px 10px rgb(208, 208, 208);
  transition: box-shadow 300ms;
}
.body-card:hover {
  box-shadow: 0px 0px 20px rgb(167, 167, 167);
}
.dish-description {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.dish-price {
  text-align: start;
}
.dish-name {
  font-weight: bold;
  font-size: 1.55rem;
  max-width: 100%;
}
.dish-price {
  font-size: 1.1rem;
  color: var(--primary-darker);
}
.dish-price > span {
  font-size: 1.2rem;
}
.dish-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.add-dish-button {
  margin-top: 20px;
  width: 100%;
  height: 40px;
  border-radius: 10px;
  position: relative;
  bottom: 0px;
}
</style>
