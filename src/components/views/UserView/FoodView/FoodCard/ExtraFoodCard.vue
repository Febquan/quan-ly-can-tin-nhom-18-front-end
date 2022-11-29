<template>
  <a-card class="body-card" style="width: 200px; height: 150px">
    <div class="extraFood-img-container">
      <img class="extraFood-img" alt="món ăn" :src="extraFood.imgUrl" />
    </div>
    <div class="extraFood-description">
      <h1 class="extraFood-name">{{ this.extraFood.name }}</h1>
    </div>
    <div class="extraFood-info">
      <h4 class="extraFood-price">
        <span>Giá:</span> {{ this.convertVND(this.extraFood.price) }}
      </h4>
      <a-tag
        class="extraFood-status"
        :color="extraFood.isAvailable ? 'green' : 'red'"
        >{{ extraFood.isAvailable ? "Còn hàng" : "Hết hàng" }}</a-tag
      >
      <PlusCircleFilled
        class="plus"
        :class="extraFood.isAvailable ? 'available' : 'unAvailable'"
      ></PlusCircleFilled>
    </div>
  </a-card>
</template>

<script>
import { PlusCircleFilled } from "@ant-design/icons-vue";
import convertVND from "@/util/moneyformat";
export default {
  props: {
    extraFood: Object,
  },
  components: {
    PlusCircleFilled,
  },
  methods: {
    addToCart() {
      this.$store.dispatch("cart/addCart", this.extraFood);
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
.extraFood-img-container {
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.extraFood-img {
  height: 100%;
  aspect-ratio: 4 / 3;
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
.extraFood-description {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.extraFood-price {
  text-align: start;
}
.extraFood-name {
  font-weight: bold;
  font-size: 1rem;
  max-width: 100%;
}
.extraFood-price {
  font-size: 0.7rem;
  color: var(--primary-darker);
}
.extraFood-price > span {
  font-size: 0.8rem;
}
.extraFood-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.extraFood-status {
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
