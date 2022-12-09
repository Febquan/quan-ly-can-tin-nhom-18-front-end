<template>
  <div class="container">
    <div class="storageManagement-container">
      <a-input-search
        class="search"
        placeholder="Tên sản phẩm"
        size="large"
        v-model:value="search"
        @change="onSearch"
      ></a-input-search>

      <a-table
        class="table"
        :columns="columns"
        :data-source="display"
        :scroll="{ y: 410 }"
        :row-class-name="'row'"
        :pagination="false"
      >
        <template #headerCell="{ column }">
          <template v-if="column.key === 'batch'">
            <div class="dummy1">
              <span>Thông tin hàng tồn</span>
              <div class="dummy">
                <span class="hangton">Số lượng hàng tồn</span>
                <span class="nhap">Số lượng nhập</span>
                <span class="giamua">Giá mua</span>
                <span class="ngaymua">Ngày mua</span>
                <span class="ngayban">Ngày hết hạn</span>
              </div>
            </div>
          </template>
        </template>

        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <a> {{ record.name }} </a>
          </template>
          <template v-else-if="column.key === 'image'">
            <div class="img-container">
              <img class="img" :src="record.imgUrl" alt="FastFood" />
            </div>
          </template>
          <template v-else-if="column.key === 'price'">
            <span>
              {{ this.convertVND(record.price) }}
            </span>
          </template>
          <template v-else-if="column.key === 'numOfItem'">
            <span>
              {{ record.numOfItem }}
            </span>
          </template>
          <template v-else-if="column.key === 'moneyValue'">
            <span>
              {{ this.convertVND(record.moneyValue) }}
            </span>
          </template>
          <template v-else-if="column.key === 'batch'">
            <a-table
              class="table2"
              :columns="innerCol"
              :data-source="record.batch"
              :pagination="{ hideOnSinglePage: true }"
              :row-class-name="'row2'"
              :showHeader="false"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'quantity'">
                  <span
                    :class="{
                      expired: this.dayjs().diff(record.expiredDated) > 0,
                    }"
                    >{{ record.quantity }}
                  </span>
                </template>
                <template v-if="column.key === 'initialQuantity'">
                  <span
                    :class="{
                      expired: this.dayjs().diff(record.expiredDated) > 0,
                    }"
                    >{{ record.initialQuantity }}
                  </span>
                </template>
                <template v-if="column.key === 'buyPrice'">
                  <span
                    :class="{
                      expired: this.dayjs().diff(record.expiredDated) > 0,
                    }"
                    >{{ this.convertVND(record.buyPrice) }}</span
                  >
                </template>
                <template v-if="column.key === 'buyDate'">
                  <span
                    :class="{
                      expired: this.dayjs().diff(record.expiredDated) > 0,
                    }"
                    >{{ dayjs(record.buyDate).format("DD/MM/YYYY") }}</span
                  >
                </template>
                <template v-if="column.key === 'expiredDate'">
                  <span
                    :class="{
                      expired: this.dayjs().diff(record.expiredDated) > 0,
                    }"
                    >{{ dayjs(record.expiredDated).format("DD/MM/YYYY") }}</span
                  >
                </template>
              </template>
            </a-table>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import convertVND from "@/util/moneyformat";
import dayjs from "dayjs";

import { defineComponent } from "vue";

const columns = [
  {
    title: "Tên sản phẩm",
    hidden: true,
    key: "name",
    align: "center",
  },
  {
    title: "Hình ảnh",

    key: "image",
    align: "center",
  },
  {
    title: "Giá bán",

    key: "price",
    align: "center",
  },
  {
    title: "Thông tin hàng tồn",
    key: "batch",

    align: "center",
    width: "50%",
    height: 100,
  },
  {
    title: "Tổng tồn kho",
    key: "numOfItem",
    align: "center",
  },
  {
    title: "Tổng giá trị tồn kho",
    key: "moneyValue",
    align: "center",
    width: "10%",
  },
];
const innerCol = [
  {
    title: "Số lượng lô hàng",
    key: "quantity",
    width: "20%",
    align: "center",
  },
  {
    title: "Số lượng nhập",
    key: "initialQuantity",
    width: "20%",
    align: "center",
  },
  {
    title: "Giá mua",
    key: "buyPrice",
    width: "20%",
    align: "center",
  },
  {
    title: "Ngày mua",
    key: "buyDate",
    width: "20%",
    align: "center",
  },
  {
    title: "Ngày hết hạn",
    key: "expiredDate",
    width: "20%",
    align: "center",
  },
];

export default defineComponent({
  components: {},
  async created() {
    const temp = await this.$axios.get("admin/seeFastFoodAndDrink");
    let FastFoodAndDrink = temp.data.content;
    this.data = FastFoodAndDrink.map((FFAD) => ({
      ...FFAD,
      numOfItem: FFAD.batch.reduce((b, cur) => b + cur.quantity, 0),
      moneyValue: FFAD.batch.reduce(
        (b, cur) => b + cur.quantity * cur.buyPrice,
        0
      ),
    }));
    this.display = this.data;
  },
  methods: {
    onSearch() {
      this.display = this.data.filter((item) =>
        item.name.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
  data() {
    return {
      search: "",
      data: null,
      display: null,
      columns,
      convertVND,
      innerCol,
      dayjs,
    };
  },
});
</script>

<style scoped>
.container {
  background-color: var(--white);
  height: 100%;
  overflow: auto;

  padding: 24px;
  column-gap: 30px;
  align-content: center;
}
.sub-table {
  width: 100%;
  margin-left: -16px;
  margin-right: -16px;
}
.info {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
}
.img-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.img-container > img {
  height: 80px;
  aspect-ratio: 1/1;
}
.storageManagement-container {
  border: 4px solid var(--primary);

  border-radius: 20px;
  display: flex;
  flex-direction: column;

  align-items: flex-start;
  gap: 10px;
  padding: 20px;
  height: 100%;
}
.table {
  max-height: 200px;
}
.table :deep(.row) {
  background-color: white;
  pointer-events: none;
}
.table2 :deep(.row2) {
  position: relative;
  left: -20px;
  background-color: white;
  pointer-events: none;
}
.table :deep(.ant-table-thead .ant-table-cell) {
  height: 50px;
}

.table :deep(.ant-table-body) {
  height: 370px;
}
.dummy {
  display: flex;
  justify-content: space-between;
  width: 90%;
}
.dummy1 {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
}
.hangton {
  position: relative;
  left: -15px;
}
.nhap {
  position: relative;
  left: -20px;
}
.giamua {
  position: relative;
  left: -25px;
}
.expired {
  color: rgb(255, 78, 78);
}
</style>
