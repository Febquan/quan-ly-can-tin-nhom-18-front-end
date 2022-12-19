<template>
  <div class="container-a">
    <span class="name">{{ this.item.name }}</span>
    <span class="amount">{{ this.item.amount }}</span>
    <span class="price" v-if="!isChange">{{
      this.convertVND(this.item.cost.toFixed(2).replace(/\.00$/, ""))
    }}</span>
    <a-input-number
      class="cost-change"
      v-if="isChange"
      v-model:value="item.cost"
      :formatter="(num) => convertVND(num)"
      :step="1000"
      :min="0"
      :disabled="thing.kind == 'FastFoodAndDrink'"
      :parser="
        (text) => text.replace('VNĐ', '').replaceAll(',', '').replace(/\s/g, '')
      "
    ></a-input-number>
  </div>
</template>

<script>
import convertVND from "@/util/moneyformat";
// import dayjs from "dayjs";
export default {
  props: {
    thing: Object,
    isChange: Boolean,
  },
  components: {},
  computed: {
    item() {
      return this.thing;
    },
  },

  methods: {},
  data() {
    return {
      convertVND: convertVND,
    };
  },
};
</script>
<style scoped>
.container-a {
  display: grid;
  grid-template-columns: 3fr 1fr 1.5fr;
  justify-items: center;
}
.cost-change {
  width: 100%;
}
</style>
