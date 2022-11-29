<template>
  <a-modal
    :visible="visible"
    title="Thêm món ăn"
    maskClosable="true"
    :centered="true"
    width="50%"
    @cancel="cancel"
  >
    <template #footer>
      <div class="footer-container">
        <a-spin class="spinner" v-if="isLoading" />
        <a-button
          key="submit"
          type="primary"
          @click="addDishToCart"
          :disabled="!quantity"
          >Thêm vào đơn hàng</a-button
        >
      </div>
    </template>
    <div class="modal-container">
      <div class="dish-info-all">
        <h1 class="dish-name">{{ this.dish.name }}</h1>
        <h2 class="dish-price">
          {{ "Giá: " + this.convertVND(this.dish.price) }}
        </h2>
        <a-tag
          class="dish-status"
          :color="dish.isAvailable ? 'green' : 'red'"
          >{{ dish.isAvailable ? "Còn hàng" : "Hết hàng" }}</a-tag
        >
        <a-input-number
          v-model:value="quantity"
          :min="1"
          :max="100"
          placeholder="Số lượng"
        />
        <h4 class="dish-info-specific">
          {{ dish.info }}
        </h4>
      </div>
      <a-textarea
        class="dish-description"
        v-model:value="description"
        placeholder="Yêu cầu về đơn hàng ?"
      />
      <div class="extra-object">
        <h2>
          Đồ ăn thêm:
          <a-tag
            class="extra-object-tag"
            v-for="s in getExtraFoodString"
            :key="s"
            @click="deleteExtraFood(s)"
          >
            {{ s }}
            <MinusCircleFilled class="minus"></MinusCircleFilled>
          </a-tag>
        </h2>
        <div class="extra-object-container">
          <ExtraFoodCardVue
            v-for="extra in getExtraFood"
            :key="extra._id"
            :extraFood="extra"
            @click="addExtraFood(extra)"
          ></ExtraFoodCardVue>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import ExtraFoodCardVue from "../FoodCard/ExtraFoodCard.vue";
import { mapGetters } from "vuex";
import { MinusCircleFilled } from "@ant-design/icons-vue";
import convertVND from "@/util/moneyformat";
export default {
  name: "AddDishModel",

  props: {
    visible: Boolean,
    dish: Object,
  },
  computed: {
    ...mapGetters("prods", ["getExtraFood"]),
    getExtraFoodString() {
      let s = [];
      this.extraFood.forEach((f) => s.push(`${f.object.name}(${f.quantity})`));
      return s;
    },
    calCost() {
      return (
        this.dish.price * this.quantity +
        this.extraFood.reduce(
          (sum, el) => sum + el.object.price * el.quantity,
          0
        )
      );
    },
  },
  components: {
    ExtraFoodCardVue,
    MinusCircleFilled,
  },
  data() {
    return {
      description: "",
      extraFood: [],
      isLoading: false,
      quantity: "",
      convertVND: convertVND,
    };
  },
  methods: {
    deleteExtraFood(name) {
      console.log(this.extraFood);
      const realName = name.split("(")[0];
      const index = this.extraFood.findIndex((e) => e.object.name === realName);
      console.log(index, realName);
      if (this.extraFood[index].quantity == 1) {
        this.extraFood.splice(index, 1);
      }
      if (this.extraFood[index].quantity > 1) {
        this.extraFood[index].quantity--;
      }
      // const index = this.extraFood.findIndex(
      //   (el) => el.extraFood._id === _id
      // );
      // if (this.extraFood[index].quantity == 1)
      // {
      //   this.extraFood.filter()
      // }
    },
    cancel() {
      this.$emit("closeAddDishModel");
      this.description = "";
      this.extraFood = [];
      this.quantity = "";
    },
    addExtraFood(extraFood) {
      if (!extraFood.isAvailable) {
        return;
      }
      const extra = {
        object: extraFood,
        quantity: 1,
      };
      const index = this.extraFood.findIndex(
        (el) => el.object._id === extraFood._id
      );
      if (index != -1) {
        this.extraFood[index].quantity++;
        return;
      }
      this.extraFood.push(extra);
    },

    async addDishToCart() {
      try {
        this.isLoading = true;

        this.$store.dispatch("cart/addCart", {
          kind: "Dish",
          object: this.dish,
          // object: {
          //   _id: this.dish._id,
          // },
          description: this.description,
          extraFood: this.extraFood,
          quantity: this.quantity,
          cost: this.calCost,
        });

        this.isLoading = false;
        this.$toast.success(`Thêm vào đơn hàng thành công`, {
          position: "bottom",
          duration: 2000,
          queue: true,
          max: 0,
          pauseOnHover: false,
        });
        setTimeout(() => {
          this.cancel();
        }, 100);
      } catch (error) {
        this.isLoading = false;
        this.$toast.error(error, {
          position: "bottom",
          duration: 1500,
          enqueue: true,
          max: 0,
          pauseOnHover: false,
        });
      }
    },
  },
};
</script>

<style scoped>
.footer-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  justify-items: center;
  align-content: center;
}
.dish-description {
  max-height: 100%;
  width: 85%;
}
.dish-info-all {
  grid-column: 1 / span 1;
  text-align: center;
}
.dish-description {
  grid-column: 2 / span 1;
}
.extra-object {
  grid-column: 1 / span 2;
  width: 100%;
}
.dish-name {
  font-size: 2rem;
  color: var(--primary);
}
.extra-object-container {
  padding: 20px;
  display: grid;
  row-gap: 15px;
  width: 100%;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  height: 200px;
  overflow-y: scroll;
}
.extra-object > h2 {
  margin-top: 20px;
  margin-left: 20px;
}
.dish-info-specific {
  border: 0.9px dashed rgb(0, 0, 0, 0.5);
  border-radius: 4px;
  padding: 5px;
  margin-top: 8px;
}
.extra-object-tag {
  user-select: none;
  position: relative;
}
.minus {
  position: absolute;
  top: -6px;
  right: -6px;
  color: var(--grey);
}
</style>
