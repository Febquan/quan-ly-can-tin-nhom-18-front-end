<template>
  <a-modal
    :visible="visible"
    title="Các đơn hàng của bạn"
    maskClosable="true"
    :centered="true"
    @cancel="closeModal"
  >
    <template #footer>
      <div class="footer-container">
        <a-spin class="spinner" v-if="isLoading" />
        <a-button
          type="primary"
          @click="convertCartToSendItem"
          :disabled="
            !hasAnyItem || (!email && isGuest) || (!arrive_at && !isGuest)
          "
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
                      <h3>
                        {{
                          item.object.name +
                          ` (${item.object.price} x ${item.quantity})`
                        }}
                      </h3>

                      <h3>
                        {{ this.convertVND(item.object.price * item.quantity) }}
                      </h3>
                    </div>
                    <div
                      class="extra-food"
                      v-for="extraFood in item.extraFood"
                      :key="extraFood.object._id"
                    >
                      <h4>
                        +{{
                          extraFood.object.name +
                          ` (${extraFood.object.price} x ${extraFood.quantity})`
                        }}
                      </h4>
                      <h4>
                        {{
                          this.convertVND(
                            extraFood.object.price * extraFood.quantity
                          )
                        }}
                      </h4>
                    </div>
                    <div class="hello3">
                      <a-button class="delete-order" @click="delOrder(item)"
                        >Xóa</a-button
                      >
                      <h2 class="cost">
                        Cost: {{ this.convertVND(item.cost) }}
                      </h2>
                    </div>
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
      <br />
      <div class="order-info">
        <h3>Xin vui lòng nhập thông tin đơn hàng</h3>
        <a-input v-if="isGuest" v-model:value="email" placeholder="Email" />
        <p class="noti-p" v-if="isGuest && !email">
          Vì bạn không đăng nhập nên phải cần một tài khoản email để theo dõi
          đơn hàng
        </p>

        <a-date-picker
          format="HH:mm DD/MM/YYYY"
          v-model:value="arrive_at"
          :disabled-date="disabledDate"
          :disabledTime="disabledTime"
          placeholder="Thời gian nhận hàng (bắt buộc)"
          :show-time="{ defaultValue: dayjs() }"
          :showNow="!isFutureOrder"
        />
        <a-checkbox class="check-box" v-model:checked="onSite"
          >Ăn tại căn tin ?</a-checkbox
        >
      </div>
    </div>
  </a-modal>
</template>

<script>
import { mapGetters } from "vuex";
import dayjs from "dayjs";
import convertVND from "@/util/moneyformat";
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
    isGuest() {
      return this.$store.getters.getGuestState;
    },
    isFutureOrder() {
      let temp = false;
      this.getCart.forEach((dish) => {
        if (dish.object.future == true) temp = true;
      });

      return temp;
    },
  },
  methods: {
    closeModal() {
      this.arrive_at = null;
      this.$emit("closeOrderModal");
    },
    delOrder(product) {
      this.$store.dispatch("cart/delCart", product);
    },
    getDisabledHours(date, month, year) {
      var hours = [0, 1, 2, 3, 4, 5, 19, 20, 21, 22, 23]; //CLOSED HOUR
      const thisDate = dayjs();
      if (
        thisDate.date() === date &&
        thisDate.month() === month &&
        thisDate.year() === year
      )
        for (var i = 0; i < dayjs().hour(); i++) {
          hours.push(i);
        }

      return hours;
    },
    getDisabledMinutes(selectedHour) {
      var minutes = [];
      if (selectedHour === dayjs().hour()) {
        for (var i = 0; i < dayjs().minute(); i++) {
          minutes.push(i);
        }
      }
      return minutes;
    },
    disabledDate(current) {
      if (!this.isFutureOrder) {
        return current < dayjs().startOf("day");
      } else {
        return current < dayjs().startOf("day").add(1, "day");
      }
    },
    disabledTime(h) {
      const moment = dayjs(h);
      return {
        disabledHours: () =>
          this.getDisabledHours(moment.date(), moment.month(), moment.year()),
        disabledMinutes: () => this.getDisabledMinutes(moment.hour()),
      };
    },

    async convertCartToSendItem() {
      try {
        const order = this.getCart;
        const content = {
          arrive_at: this.arrive_at,
          email: this.email,
          status: this.isGuest ? "onSite" : "trusted",
          onSite: this.onSite,
          order,
        };
        await this.$axios.post("/user/placeOrder", { ...content });
        this.$toast.success(`Đặt hàng thành công !`, {
          position: "bottom",
          duration: 2000,
          queue: true,
          max: 0,
          pauseOnHover: false,
        });
        this.$emit("closeOrderModal");
        this.arrive_at = null;
        this.$store.dispatch("cart/resetCart");
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
    return {
      dayjs: dayjs,
      arrive_at: null,
      onSite: false,
      email: "",
      convertVND: convertVND,
    };
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
.noti-p {
  text-align: center;
}
.check-box {
  display: flex;
  justify-content: center;
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
.order-info {
  width: 60%;
  display: flex;
  gap: 10px;
  flex-direction: column;
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
.delete-order {
  scale: 0.8;
}
.hello3 {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
@media only screen and (max-width: 576px) {
.order-info{
  width: 90%;
}
}
</style>
