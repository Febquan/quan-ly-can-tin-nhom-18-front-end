<template>
  <a-modal
    :visible="visible"
    title="Các đơn hàng của bạn"
    maskClosable="true"
    :centered="true"
    @cancel="$emit('closeOrderModal')"
  >
    <template #footer>
      <div class="footer-container">
        <a-spin class="spinner" v-if="isLoading" />
        <a-button
          type="primary"
          @click="convertCartToSendItem"
          :disabled="!hasAnyItem"
          v-if="!isLoading"
          >Đặt đơn</a-button
        >
      </div>
    </template>
    <div class="modal-container">
      <div class="hello1">
        <a-list class="hello2" item-layout="horizontal" :data-source="getCart">
          <template #renderItem="{ item }">
            <a-list-item>
              <a-list-item-meta>
                <template #title>
                  <div class="order-list">
                    <div class="main-food">
                      <h3>{{ item.object.name }}</h3>
                      <h3>{{ item.object.price }} VNĐ</h3>
                    </div>
                    <div
                      class="extra-food"
                      v-for="extraFood in item.extraFood"
                      :key="extraFood.object._id"
                    >
                      <h4>
                        +{{ extraFood.object.name + `(${extraFood.quantity})` }}
                      </h4>
                      <h4>
                        {{ extraFood.object.price * extraFood.quantity }} VNĐ
                      </h4>
                    </div>

                    <h2 class="cost">Cost: {{ item.cost }} VNĐ</h2>
                  </div>
                </template>
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>
      </div>
      <a-divider
        style="border-color: #7cb305; margin: 0"
        dashed
        v-if="hasAnyItem"
      />
      <h2 class="total-cost" v-if="hasAnyItem">
        Total cost: {{ this.getTotalCost }} VNĐ
      </h2>
    </div>
  </a-modal>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "OrderModal",
  props: {
    visible: Boolean,
  },
  computed: {
    ...mapGetters("cart", ["getCart"]),
    getTotalCost() {
      return this.getCart.reduce((sum, el) => sum + el.cost, 0);
    },
    hasAnyItem() {
      return this.getCart.length > 0;
    },
  },
  methods: {
    async convertCartToSendItem() {
      try {
        const order = this.getCart;
        console.log(this.getCart);
        const content = {
          arrive_at: "2022-11-06T04:25:38.628Z",
          email: "febquanwork@gmail.com",
          status: "onsite",
          onSite: true,
          order,
        };
        await this.$axios.post("/user/placeOrder", { ...content });
      } catch (err) {
        console.log(err);
      }
    },
    async submitSignUp() {
      try {
        this.isLoading = true;

        await this.$axios.post(`user/signup`, {
          name: this.name,
          email: this.email,
          password: this.password1,
        });

        this.isLoading = false;
        this.$toast.success(`Đăng ký thành công !`, {
          position: "bottom",
          duration: 2000,
          queue: true,
          max: 0,
          pauseOnHover: false,
        });
        setTimeout(() => {
          this.$toast.show(`Hãy xác thực email của bạn`, {
            position: "bottom",
            duration: 2000,
            enqueue: true,
            max: 0,
            pauseOnHover: false,
          });
        }, 2000);
      } catch (error) {
        this.isLoading = false;
        this.$toast.error(error.response.data.message, {
          position: "bottom",
          duration: 1500,
          enqueue: true,
          max: 0,
          pauseOnHover: false,
        });
      }
    },
  },
  data() {
    return {};
  },
};
</script>

<style scoped>
.modal-container {
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
}
.extra-food,
.main-food {
  display: flex;
  justify-content: space-between;
}
.hello2 {
  width: 100%;
}
.hello1 {
  width: 100%;
  max-height: 270px;
  overflow-y: auto;
}
.cost {
  text-align: right;
  color: var(--primary-darker);
}
.total-cost {
  color: var(--primary);
  margin-top: 10px;
}
.footer-container {
  display: flex;
  justify-content: center;
}
</style>
