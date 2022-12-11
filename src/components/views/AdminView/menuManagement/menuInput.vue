<template>
  <div class="container">
    <div class="StorageInput-container">
      <section class="input">
        <h1>Thêm món ăn</h1>
        <a-form-item label="Loại món ăn">
          <a-select
            v-model:value="type"
            :options="options"
            style="text-align: left"
          ></a-select>
        </a-form-item>
        <a-form-item label="Tên món ăn">
          <a-input
            style="width: 100%"
            v-model:value="name"
            placeholder="Tên món ăn"
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
        <a-form-item
          v-if="type == 'Dish'"
          label="Hình ảnh món ăn"
          style="text-align: left"
        >
          <input
            type="file"
            class="input-file"
            id="img"
            name="img"
            accept="image/*"
            @change="handleFileUpload"
          />
          <label for="img">Tải ảnh lên<UploadOutlined></UploadOutlined> </label>
        </a-form-item>
        <a-form-item
          v-if="type !== 'Dish'"
          label="Đường link hình ảnh sản phẩm"
        >
          <a-input
            v-model:value="imgURL"
            placeholder="Nhập nếu sản phẩm chưa có sẵn"
          />
        </a-form-item>
        <a-form-item label="Thông tin về món ăn" v-if="type == 'Dish'">
          <a-textarea
            v-model="info"
            :rows="4"
            placeholder="Thông tin thêm về món ăn, một phần ăn bao gồm những gì ?"
            :maxlength="200"
          />
        </a-form-item>

        <a-button type="primary" @click="addFood" :disabled="!isValidInput">
          Thêm món ăn</a-button
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
import { UploadOutlined } from "@ant-design/icons-vue";
export default {
  components: {
    UploadOutlined,
  },
  computed: {
    isExits() {
      return this.options.find((el) => el.value == this.name);
    },
    isValidInput() {
      return this.name && this.imgURL && this.price;
    },
  },
  methods: {
    handleFileUpload(e) {
      this.file = e.target.files[0];
      this.imgURL = URL.createObjectURL(this.file);
    },
    async addFood() {
      try {
        if (this.type == "Dish") {
          let formData = new FormData();
          formData.append("name", this.name);
          formData.append("price", this.price);
          formData.append("image", this.file);
          formData.append("info", this.info);
          await this.$axios.post("/admin/addDish", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        }
        if (this.type == "ExtraFood") {
          await this.$axios.post("admin/addExtraFood", {
            name: this.name,
            price: this.price,
            imgUrl: this.imgURL,
          });
        }
        this.$toast.success(`Thêm lô hàng thành công`, {
          position: "bottom",
          duration: 800,
          queue: true,
          max: 0,
          pauseOnHover: false,
        });
        this.name = "";
        this.price = null;
        this.imgURL = "";
        this.file = null;
        this.info = "";
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
      options: [
        { value: "Dish", label: "Món chính" },
        { value: "ExtraFood", label: "Đồ ăn thêm" },
      ],
      name: "",
      price: null,
      imgURL: "",
      file: null,
      info: "",
      type: "Dish",
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
.input-file {
  display: none;
}
.input-file + label {
  width: 120px;
  height: 35px;
  color: white;
  text-align: center;
  border-radius: 10px;

  background-color: var(--primary);
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  padding: 5px;
  cursor: pointer;
}

.input-file:focus + label,
.input-file + label:hover {
  transition: all 300ms;
  background-color: var(--secondary);
}
</style>
