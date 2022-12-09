<template>
  <a-card
    class="body-card"
    :class="{
      isAvailable: product.isAvailable,
      isNotAvailable: !product.isAvailable,
    }"
    @click="toggleAvailable"
    style="width: 220px; height: 220px"
  >
    <div class="fast-food-img-container">
      <img class="fast-food-img" alt="món ăn" :src="product.imgUrl" />
    </div>
    <div class="fast-food-description">
      <h1 class="fast-food-name">{{ this.product.name }}</h1>
    </div>
    <div class="fast-food-info">
      <h4 class="fast-food-price">
        <span>Giá:</span> {{ this.convertVND(this.product.price) }}
      </h4>
      <a-tag
        class="fast-food-status"
        :color="product.isAvailable ? 'green' : 'red'"
        >{{ product.isAvailable ? "Còn hàng" : "Hết hàng" }}</a-tag
      >
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
    async toggleAvailable() {
      try {
        await this.$axios.post("admin/toggleAvailable", {
          foodId: this.product._id,
          isAvailable: !this.product.isAvailable,
          type: this.type,
        });

        this.$toast.success(`Thay đổi thành công`, {
          position: "bottom",
          duration: 800,
          queue: true,
          max: 0,
          pauseOnHover: false,
        });
        this.product.isAvailable = !this.product.isAvailable;
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
  },
  data() {
    return {
      convertVND: convertVND,
      product: this.prod,
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
.isAvailable {
  border-bottom: 8px solid rgb(11, 204, 107);
}
.isNotAvailable {
  border-bottom: 8px solid rgb(232, 65, 65);
}
</style>
