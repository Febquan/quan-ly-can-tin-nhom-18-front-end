<template>
  <a-modal
    :visible="visible"
    title="Thêm món ăn"
    maskClosable="true"
    :centered="true"
    @cancel="cancel"
  >
    <template #footer>
      <div class="footer-container">
        <a-spin class="spinner" v-if="isLoading" />
        <a-button
          key="submit"
          type="primary"
          @click="addFFADToCart"
          :disabled="!isAvailable"
          >Thêm vào đơn hàng</a-button
        >
      </div>
    </template>
    <div class="modal-container">
      <div class="FFAD-info-all">
        <h1 class="FFAD-name">{{ this.FFAD.name }}</h1>
        <h2 class="FFAD-price">
          {{ "Giá: " + this.convertVND(this.FFAD.price) }}
        </h2>
        <a-tag class="FFAD-status" :color="isAvailable ? 'green' : 'red'">{{
          isAvailable ? `Còn ${FFAD.amountAvailable} sản phẩm` : "Hết hàng"
        }}</a-tag>
        <div class="number-input">
          <h3>Số lượng:</h3>
          <a-input-number
            v-model:value="amount"
            :min="1"
            :max="FFAD.amountAvailable"
          />
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import convertVND from "@/util/moneyformat";
export default {
  name: "AddFFADModel",

  props: {
    visible: Boolean,
    FFAD: Object,
  },
  computed: {
    calCost() {
      return this.FFAD.price * this.amount;
    },
    isAvailable() {
      return this.FFAD.amountAvailable > 0;
    },
  },
  components: {},
  data() {
    return {
      amount: 1,
      isLoading: false,
      convertVND: convertVND,
    };
  },
  methods: {
    cancel() {
      this.$emit("closeAddFFADModel");
      this.amount = 1;
    },

    async addFFADToCart() {
      try {
        this.isLoading = true;

        this.$store.dispatch("cart/addCart", {
          kind: "FastFoodAndDrink",
          object: this.FFAD,
          quantity: this.amount,
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
  justify-items: center;
  align-content: center;
}
.FFAD-description {
  max-height: 100%;
  width: 85%;
}
.FFAD-info-all {
  text-align: center;
}

.FFAD-name {
  font-size: 2rem;
  color: var(--primary);
}

.extra-object-tag {
  user-select: none;
  position: relative;
}
.number-input {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  gap: 8px;
}
</style>
