<template>
  <div class="FFAD" v-if="FFAD">
    <div class="info">
      <div class="img-container">
        <img v-if="FFAD.imgUrl" :src="FFAD.imgUrl" alt="Hình ảnh sản phẩm" />
        <img
          v-if="!FFAD.imgUrl"
          :src="'https://img.freepik.com/premium-vector/fast-food-seamless-pattern-with_202271-545.jpg?w=740'"
          alt="Hình ảnh sản phẩm"
        />
      </div>
      <div>
        <div class="main-container">
          <div class="form">
            <h3 style="font-weight: bold; font-size: 1.8rem">
              Tên sản phẩm:
              <span v-if="!changeState">{{ this.FFAD.name }}</span>
            </h3>
            <a-input
              class="form-change main-change"
              v-if="changeState"
              v-model:value="FFAD.name"
            ></a-input>
          </div>
          <div class="form">
            <h3>
              Giá bán:
              <span v-if="!changeState">{{
                this.convertVND(this.FFAD.price)
              }}</span>
            </h3>

            <a-input-number
              class="form-change main-change"
              v-if="changeState"
              style="width: 100%"
              v-model:value="FFAD.price"
              :formatter="(num) => convertVND(num)"
              :step="1000"
              :min="0"
              :parser="
                (text) =>
                  text.replace('VNĐ', '').replaceAll(',', '').replace(/\s/g, '')
              "
            />
          </div>
          <div>
            <a-checkbox
              class="check"
              :disabled="!changeState"
              v-model:checked="FFAD.isDrink"
            >
              <span style="color: black">Sản phẩm là thức uống</span>
            </a-checkbox>
          </div>
          <div class="form">
            <span class="link">
              Đường link hình ảnh:
              <span v-if="!changeState">
                {{ this.FFAD.imgUrl }}
              </span>
            </span>
            <a-input
              class="form-change imgUrl"
              v-if="changeState"
              v-model:value="FFAD.imgUrl"
            ></a-input>
          </div>
          <div class="buttons-container">
            <a-button type="primary" @click="changeStateOn" v-if="!changeState"
              >Sửa lô hàng</a-button
            >

            <a-button v-if="changeState" @click="changeStateOff" type="primary"
              >Hủy</a-button
            >
            <a-button v-if="changeState" @click="update" type="primary"
              >Cập nhập</a-button
            >
            <a-button v-if="changeState" @click="deleteFFAD" type="primary"
              >Xóa</a-button
            >
          </div>
        </div>
        <div class="batch-container">
          <div
            class="batch-header"
            :class="{
              change: changeState,
            }"
          >
            <span>Số lượng tồn</span>
            <span>Số lượng nhập</span>
            <span>Giá mua</span>
            <span>Ngày nhập kho</span>
            <span>Ngày hết hạn</span>
            <span v-if="changeState">Xóa lô hàng</span>
          </div>
          <div class="batch-table">
            <div
              class="batch-inner-container"
              v-for="(batch, index) in this.FFAD.batch"
              :class="{
                expired: dayjs().diff(batch.expiredDated) > 0,
                change: changeState,
              }"
              :key="batch.bayDate"
            >
              <span v-if="!changeState">{{ batch.quantity }}</span>
              <a-input-number
                class="input-change"
                :min="0"
                v-model:value="batch.quantity"
                placeholder="Số lượng tồn"
                v-if="changeState"
              />

              <span v-if="!changeState">{{ batch.initialQuantity }}</span>
              <a-input-number
                class="input-change"
                :min="0"
                v-model:value="batch.initialQuantity"
                placeholder="Số lượng tồn"
                v-if="changeState"
              />

              <span v-if="!changeState">{{
                this.convertVND(batch.buyPrice)
              }}</span>
              <a-input-number
                :min="0"
                class="input-change"
                v-if="changeState"
                style="width: 100%"
                v-model:value="batch.buyPrice"
                :formatter="(num) => convertVND(num)"
                :step="1000"
                :parser="
                  (text) =>
                    text
                      .replace('VNĐ', '')
                      .replaceAll(',', '')
                      .replace(/\s/g, '')
                "
              />

              <span v-if="!changeState">{{
                this.convertDateToString(batch.buyDate)
              }}</span>
              <a-date-picker
                class="input-change"
                format="DD/MM/YYYY"
                placeholder="Ngày Nhập kho"
                :defaultValue="dayjs(batch.buyDate)"
                @change="(val) => buyDateChange(val, index)"
                v-if="changeState"
              />
              <span v-if="!changeState">{{
                this.convertDateToString(batch.expiredDated)
              }}</span>
              <a-date-picker
                v-if="changeState"
                class="input-change"
                format="DD/MM/YYYY"
                placeholder="Ngày Nhập kho"
                @change="(val) => expiredDatedChange(val, index)"
                :defaultValue="dayjs(batch.expiredDated)"
              />
              <a-button
                v-if="changeState"
                @click="delBatch(index)"
                :class="{
                  expired: dayjs().diff(batch.expiredDated) > 0,
                }"
                >Xóa lô hàng</a-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import convertVND from "@/util/moneyformat";

export default {
  props: {
    item: Object,
  },
  computed: {},
  methods: {
    changeStateOn() {
      this.changeState = true;
    },
    changeStateOff() {
      this.FFAD = JSON.parse(JSON.stringify(this.item));
      this.changeState = false;
    },
    delBatch(index) {
      console.log(index);
      this.FFAD.batch.splice(index, 1);
    },

    convertDateToString(string) {
      return dayjs(string).format("DD/MM/YYYY").toString();
    },
    async deleteFFAD() {
      try {
        await this.$axios.post(`admin/findFFADAndDelete`, {
          FFADid: this.FFAD._id,
        });
        this.$toast.success(`Xóa thành công`, {
          position: "bottom",
          duration: 800,
          queue: true,
          max: 0,
          pauseOnHover: false,
        });
        this.changeState = false;
        this.FFAD = null;
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
    async update() {
      try {
        await this.$axios.post(`admin/findFFADAndUpdate`, {
          FFAD: this.FFAD,
        });
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
    buyDateChange(val, index) {
      this.FFAD.batch[index].buyDate = val
        .set("hour", 0)
        .set("minute", 0)
        .set("second", 0)
        .toISOString();
    },
    expiredDatedChange(val, index) {
      this.FFAD.batch[index].expiredDated = val
        .set("hour", 0)
        .set("minute", 0)
        .set("second", 0)
        .toISOString();
    },
  },
  watch: {},

  data() {
    return {
      dayjs: dayjs,
      convertVND: convertVND,
      changeState: false,
      FFAD: JSON.parse(JSON.stringify(this.item)),
    };
  },
};
</script>

<style scoped>
.FFAD {
  border-radius: 20px;
}
.info {
  display: grid;
  grid-template-columns: 1fr 4fr;
  column-gap: 30px;
}
.main-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 10px;
  font-size: 1rem;
  position: relative;
}
.buttons-container {
  display: flex;
  gap: 10px;
  transform: translateX(50%);
  right: 30%;
  top: 20px;
  position: absolute;
}
.batch-container {
  border: 7px solid var(--light-grey);
  border-radius: 10px;
  height: min-content;
}
.batch-header {
  font-size: 1.05rem;
  height: 30px;
  align-items: center;
  margin-top: -2px;
  margin-right: -2px;
  margin-left: -2px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  background-color: var(--light-grey);
}
.batch-inner-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  justify-items: center;
}
.batch-table {
  padding: 10px;
  display: flex;
  flex-direction: column;
  row-gap: 10px;
}
.img-container {
  border: 4px solid var(--primary);
  border-radius: 15px;
  padding: 10px;
  height: 100%;
  aspect-ratio: 1 / 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.img-container > img {
  object-fit: cover;
  height: 100%;
  aspect-ratio: 1 / 1;
  font-size: 2rem;
}
.input-change {
  width: 100%;
}
.expired {
  border: 2px solid rgb(255, 78, 78);
  border-radius: 10px;
}
.change {
  grid-template-columns: 0.7fr 0.7fr 1fr 1fr 1fr 1fr;
  gap: 10px;
}
.change.expired {
  margin-right: -5px;
  border: none;
  border-radius: 0px;
  border-right: 5px solid rgb(255, 78, 78);
}
.batch-header.change {
  justify-items: center;
  align-content: center;
  font-size: 0.8rem;
}
.form {
  display: flex;
  gap: 10px;
  align-items: center;
}
.form-change {
  flex: 1;
  height: 2rem;
}
.imgUrl {
  height: 1.5rem;
  width: 600px;
}
.main-change {
  flex: 0.8;
}
.link {
  text-align: left;
  font-size: 0.8rem;
}
</style>
