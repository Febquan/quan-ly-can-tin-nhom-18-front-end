<template>
  <div class="body-card" style="width: 700px" v-if="product">
    <div class="food-img-container">
      <img class="food-img" alt="món ăn" :src="product.imgUrl" />
    </div>
    <div class="food-info">
      <h1 class="food-name">
        <span v-if="!changeState">{{ this.product.name }}</span>
        <a-input
          class="name-change"
          v-if="changeState"
          v-model:value="product.name"
        ></a-input>
      </h1>

      <h4 class="food-type">
        {{ foodType(this.product.type) }}
      </h4>
      <h4 class="food-price">
        Giá:<span v-if="!changeState">{{
          this.convertVND(this.product.price)
        }}</span>
        <a-input-number
          v-if="changeState"
          style="display: inline-block; width: 140px"
          v-model:value="product.price"
          :formatter="(num) => convertVND(num)"
          :step="1000"
          :parser="
            (text) =>
              text.replace('VNĐ', '').replaceAll(',', '').replace(/\s/g, '')
          "
        />
      </h4>
      <div class="number-available">
        <a-tag
          v-if="!changeState"
          class="food-status"
          :color="product.isAvailable ? 'green' : 'red'"
          >{{ product.isAvailable ? "Còn hàng" : "Hết hàng" }}</a-tag
        >
        <a-tag
          style="
            display: flex;
            justify-content: center;
            align-items: center;
            height: 22px;
            font-size: 1rem;
          "
          v-if="!changeState"
          >{{ this.product.amountAvailable }} /
          {{ this.product.everyDayAmount }} suất
        </a-tag>
        <a-select
          :value="product.isAvailable ? 'Còn hàng' : 'Hết hàng'"
          @change="changeAvailable"
          size="medium"
          v-if="changeState"
        >
          <a-select-option :value="true">Còn hàng</a-select-option>
          <a-select-option :value="false">Hết hàng</a-select-option>
        </a-select>
        <a-input-number
          :min="0"
          v-if="changeState"
          v-model:value="product.amountAvailable"
        ></a-input-number>
        <span style="font-size: 1.3rem" v-if="changeState">/</span>
        <a-input-number
          :min="0"
          v-if="changeState"
          v-model:value="product.everyDayAmount"
        ></a-input-number>
      </div>
      <a-textarea
        class="info"
        v-if="this.product.type == 'Dish'"
        v-model:value="product.info"
        :autosize="{ Rows: 2, maxRows: 3 }"
        :disabled="!changeState"
        placeholder="Thông tin thêm về món ăn, một phần ăn bao gồm những gì ?"
      />
      <span class="link" v-if="product.type == 'ExtraFood'">
        Đường link hình ảnh:
        <span v-if="!changeState">
          {{ this.product.imgUrl }}
        </span>
      </span>
      <a-input
        class="form-change imgUrl"
        v-if="changeState && product.type == 'ExtraFood'"
        v-model:value="product.imgUrl"
      ></a-input>

      <input
        type="file"
        class="input-file"
        id="img"
        name="img"
        accept="image/*"
        @change="handleFileUpload"
        v-if="changeState && product.type == 'Dish'"
      />
      <label v-if="changeState && product.type == 'Dish'" for="img"
        >Tải ảnh mới<UploadOutlined></UploadOutlined>
      </label>

      <div class="buttons-container">
        <a-button type="primary" @click="toggleChange" v-if="!changeState"
          >Sửa món ăn</a-button
        >

        <a-button v-if="changeState" @click="toggleChange" type="primary"
          >Hủy</a-button
        >
        <a-button v-if="changeState" @click="update" type="primary"
          >Cập nhập</a-button
        >
        <a-button v-if="changeState" @click="deleteFood" type="primary"
          >Xóa</a-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import convertVND from "@/util/moneyformat";
// import dayjs from "dayjs";
export default {
  props: {
    prod: Object,
  },

  components: {},
  computed: {},
  methods: {
    async update() {
      try {
        // console.log(
        //   this.prod.imgUrl.replace(process.env.VUE_APP_BACK_END_URL, ""),
        //   "hello"
        // );
        if (this.product.type == "Dish") {
          let formData = new FormData();
          formData.append("id", this.product._id);
          formData.append("type", this.product.type);
          formData.append("name", this.product.name);
          formData.append("price", this.product.price);
          formData.append("amountAvailable", this.product.amountAvailable);
          formData.append("everyDayAmount", this.product.everyDayAmount);
          formData.append("isAvailable", this.product.isAvailable);
          if (this.file) {
            formData.append("image", this.file);
          }
          formData.append("info", this.product.info);
          formData.append(
            "oldFilePath",
            this.prod.imgUrl.replace(process.env.VUE_APP_BACK_END_URL, "")
          );

          await this.$axios.post("/admin/findFoodAndUpdate", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        }
        if (this.product.type == "ExtraFood") {
          await this.$axios.post("/admin/findFoodAndUpdate", {
            id: this.product._id,
            ...this.product,
          });
        }
        this.$toast.success(`Cập nhập thành công`, {
          position: "bottom",
          duration: 800,
          queue: true,
          max: 0,
          pauseOnHover: false,
        });
        this.changeState = false;
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
    changeAvailable(value) {
      this.product.isAvailable = value;
    },
    toggleChange() {
      this.changeState = !this.changeState;
      this.product = JSON.parse(JSON.stringify(this.prod));
    },
    foodType(str) {
      return str == "Dish" ? "Món chính" : "Đồ ăn thêm";
    },
    async deleteFood() {
      try {
        await this.$axios.post(`admin/findFoodAndDelete`, {
          foodId: this.product._id,
          type: this.product.type,
        });
        this.$toast.success(`Xóa thành công`, {
          position: "bottom",
          duration: 800,
          queue: true,
          max: 0,
          pauseOnHover: false,
        });
        this.changeState = false;
        this.product = null;
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
    handleFileUpload(e) {
      this.file = e.target.files[0];
      this.product.imgUrl = URL.createObjectURL(this.file);
    },
  },
  data() {
    return {
      convertVND: convertVND,
      product: JSON.parse(JSON.stringify(this.prod)),
      changeState: false,
      file: null,
    };
  },
};
</script>
<style scoped>
.food-img-container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 3px solid var(--primary);
  padding: 12px;
  border-radius: 20px;
}
.food-img {
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 1rem;
}
.body-card {
  position: relative;
  border-radius: 1.5rem;
  box-shadow: 0px 0px 10px rgb(208, 208, 208);
  transition: box-shadow 300ms;
  display: grid;
  grid-template-columns: 2fr 3fr;
  grid-template-rows: 1fr;
  padding: 30px;
  gap: 25px;
}
.body-card:hover {
  box-shadow: 0px 0px 20px rgb(167, 167, 167);
}

.food-price {
  text-align: start;
}
.food-name {
  font-weight: bold;
  font-size: 2.2rem;
  max-width: 100%;
  margin-bottom: -12px;
}
.food-price {
  font-size: 1.1rem;
  color: var(--primary-darker);
}
.food-price > span {
  font-size: 1.5rem;
}
.food-info {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  grid-column: 2;
  grid-row: 1;
  gap: 10px;
}
.food-status {
  font-size: 1rem;
  margin-bottom: 5px;
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
.food-type {
  font-size: 1.4rem;
  margin-bottom: -10px;
}
.info.ant-input-disabled {
  color: rgb(65, 64, 64);
}
.link {
  text-align: left;
}
.link > span {
  display: block;

  max-width: 340px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.input-file {
  display: none;
}
.input-file + label {
  position: absolute;
  top: 110px;
  right: 60px;
  width: 90px;
  height: 35px;
  color: white;
  text-align: center;
  border-radius: 10px;
  transform: translateX(-50%);
  background-color: var(--primary);
  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;
}

.input-file:focus + label,
.input-file + label:hover {
  transition: all 300ms;
  background-color: var(--secondary);
}
.buttons-container {
  display: flex;
  gap: 10px;
}
.name-change {
  font-size: 2rem;
}
.number-available {
  display: flex;
  gap: 10px;
}
</style>
