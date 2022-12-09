<template>
  <div class="container">
    <div class="StorageInput-container">
      <section class="input">
        <h1>Nhập kho sản phẩm</h1>
        <a-form-item label="Tên sản phẩm">
          <a-auto-complete
            v-model:value="name"
            :options="options"
            style="text-align: left"
            placeholder="Tên sản phẩm chưa có hoặc đã có"
          ></a-auto-complete>
        </a-form-item>
        <a-form-item label="Giá nhập">
          <a-input-number
            style="width: 100%"
            v-model:value="buyPrice"
            :formatter="(num) => convertVND(num)"
            :step="1000"
            :parser="
              (text) =>
                text.replace('VNĐ', '').replaceAll(',', '').replace(/\s/g, '')
            "
          />
        </a-form-item>
        <a-form-item v-if="!isExits" label="Giá bán">
          <a-input-number
            style="width: 100%"
            v-model:value="price"
            :formatter="(num) => convertVND(num)"
            :step="1000"
            :parser="
              (text) =>
                text.replace('VNĐ', '').replaceAll(',', '').replace(/\s/g, '')
            "
          />
        </a-form-item>
        <a-form-item label="Số lượng nhập">
          <a-input-number
            style="width: 100%"
            v-model:value="amount"
            :step="1"
          />
        </a-form-item>
        <a-form-item v-if="!isExits" label="Đường link hình ảnh sản phẩm">
          <a-input
            v-model:value="imgURL"
            placeholder="Nhập nếu sản phẩm chưa có sẵn"
          />
        </a-form-item>
        <a-form-item label="Ngày hết hạn">
          <a-date-picker
            format="DD/MM/YYYY"
            placeholder="Ngày hết hạn"
            class="datePicker"
            mode="date"
            v-model:value="expiredDated"
          />
        </a-form-item>
        <a-checkbox v-if="!isExits" class="check" v-model:checked="isDrink"
          >Sản phẩm là thức uống</a-checkbox
        >
        <a-button
          type="primary"
          @click="addToStorage"
          :disabled="!isValidInput"
        >
          Thêm vào lô hàng vào kho</a-button
        >
      </section>
      <div class="img-container">
        <img v-if="imgURL" :src="imgURL" alt="Hình ảnh sản phẩm" />
        <img
          v-if="!imgURL"
          :src="'https://img.freepik.com/premium-vector/fast-food-seamless-pattern-with_202271-545.jpg?w=740'"
          alt="Hình ảnh sản phẩm"
        />
      </div>
    </div>
  </div>
</template>

<script>
import convertVND from "@/util/moneyformat";
import dayjs from "dayjs";

export default {
  async created() {
    const temp = await this.$axios.get("admin/seeFastFoodAndDrink");
    let FastFoodAndDrink = temp.data.content;
    this.options = FastFoodAndDrink.map((FFAD) => ({
      value: FFAD.name,
    }));
  },
  computed: {
    isExits() {
      return this.options.find((el) => el.value == this.name);
    },
    isValidInput() {
      return (
        this.name &&
        (this.imgURL || this.options.find((el) => el.value == this.name)) &&
        this.buyPrice &&
        this.price &&
        this.expiredDated &&
        this.amount
      );
    },
  },
  methods: {
    async addToStorage() {
      try {
        await this.$axios.post(`admin/addFFAD`, {
          name: this.name,
          buyPrice: this.buyPrice,
          price: this.price,
          imgUrl: this.imgURL,
          amount: this.amount,
          expiredDated: this.expiredDated
            .set("hour", 0)
            .set("minute", 0)
            .set("second", 0),
          isDrink: this.isDrink,
        });
        this.$toast.success(`Thêm lô hàng thành công`, {
          position: "bottom",
          duration: 800,
          queue: true,
          max: 0,
          pauseOnHover: false,
        });
        this.name = "";
        this.buyPrice = null;
        this.price = null;
        this.imgURL = "";
        this.amount = 0;
        this.expiredDated = null;
        this.isDrink = null;
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
      convertVND,
      dayjs,
      name: "",
      options: [],
      buyPrice: null,
      price: null,
      imgURL: "",
      amount: 0,
      expiredDated: null,
      isDrink: null,
    };
  },
};
</script>

<style scoped>
.check {
  margin-bottom: 20px;
}
.input {
  display: flex;
  flex-direction: column;

  width: 100%;
}
.input > h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
}
.img-container {
  border: 4px solid var(--primary);
  border-radius: 15px;
  padding: 12px;
  align-self: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
.img-container > img {
  object-fit: cover;
  height: 400px;
  width: 400px;
  font-size: 2rem;
}
.datePicker {
  width: 100%;
}
.container {
  background-color: var(--white);
  height: 100%;
  width: 100%;
  overflow: auto;

  padding: 24px;
  column-gap: 30px;
  align-content: center;
}

.StorageInput-container {
  border: 4px solid var(--primary);

  border-radius: 20px;
  display: grid;

  grid-template-columns: 1fr 1fr;
  justify-items: center;
  align-content: center;
  gap: 10px;
  padding: 40px;
  height: 100%;
  width: 100%;
}
</style>
