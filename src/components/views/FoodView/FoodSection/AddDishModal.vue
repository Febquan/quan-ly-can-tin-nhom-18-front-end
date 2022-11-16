<template>
  <a-modal
    :visible="visible"
    title="Thêm món ăn"
    maskClosable="true"
    :centered="true"
    @cancel="$emit('closeAddDishModel')"
  >
    <template #footer>
      <div class="footer-container">
        <a-spin class="spinner" v-if="isLoading" />
        <a-button key="submit" type="primary" @click="alo">Submit</a-button>
      </div>
    </template>
    <div class="modal-container">
      {{ this.dish.name }}
    </div>
  </a-modal>
</template>

<script>
export default {
  name: "AddDishModel",
  props: {
    visible: Boolean,
    dish: Object,
  },
  data() {
    return {
      description: "",
      extraFood: [],
      isLoading: false,
    };
  },
  methods: {
    addExtraFood(id, quantity) {
      const extra = {
        object: {
          _id: id,
        },
        quantity: quantity,
      };
      this.extraFood.push(extra);
    },
    async addDish() {
      try {
        this.isLoading = true;

        this.$store.dispatch("cart/addCart", {
          kind: "Dish",
          object: {
            _id: this.dish._id,
          },
          description: this.description,
          extraFood: this.extraFood,
          quantity: 1,
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
          this.$emit("closeAddDishModel");
        }, 2000);
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
