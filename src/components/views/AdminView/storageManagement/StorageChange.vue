<template>
  <div class="container">
    <div class="FFAD-container">
      <div class="FFAD-inner-container">
        <a-empty v-if="!FFAD" />

        <a-input-search
          class="search"
          v-model:value="search"
          placeholder="Tên sản phẩm trong kho"
          size="large"
          @search="onSearch"
        >
          <template #enterButton>
            <a-button type="primary">Search</a-button>
          </template>
        </a-input-search>
        <a-spin v-if="isLoading" class="spin"></a-spin>
        <div class="FFADs" v-if="!isLoading && FFAD">
          <div class="FFAD-wrap">
            <oneFFAD v-for="item in FFAD" :key="item._id" :item="item" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import convertVND from "@/util/moneyformat";
import oneFFAD from "./oneFFAD.vue";
export default {
  name: "StorageChange",
  components: { oneFFAD },
  data() {
    return {
      FFAD: null,
      isLoading: false,
      search: "",
      convertVND: convertVND,
    };
  },

  methods: {
    async onSearch() {
      try {
        this.isLoading = true;
        const res = await this.$axios.post("admin/searchFastFoodAndDrink", {
          search: this.search,
        });
        this.FFAD = res.data.content;

        this.$toast.success(`Đã tìm thấy sản phẩm trong kho`, {
          position: "bottom",
          duration: 800,
          queue: true,
          max: 0,
          pauseOnHover: false,
        });
        this.isLoading = false;
      } catch (error) {
        this.$toast.error(error.response.data.message, {
          position: "bottom",
          duration: 2000,
          queue: true,
          max: 0,
          pauseOnHover: false,
        });
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.container {
  background-color: var(--white);
  height: 100%;
  overflow: auto;
  display: grid;
  padding: 24px;
  column-gap: 30px;
  align-content: center;
}
.FFAD-inner-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.FFAD-container {
  border: 4px solid var(--primary);

  border-radius: 20px;
  display: grid;
  grid-template-columns: 1fr;
  justify-content: center;
  align-items: center;

  padding: 20px;
  height: 600px;
  max-height: 540px;
}
.FFAD {
  width: 1100px;
  box-shadow: 0 0 10px var(--grey);
  padding: 25px;
}
.FFAD:hover {
  border-radius: 20px;
  box-shadow: 0 0 20px var(--grey);
  transition: box-shadow 200ms ease;
}
.FFAD-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.search {
  width: 50%;
  margin-top: 20px;
  margin-bottom: 20px;
}
.FFADs {
  padding: 20px;
  max-height: 380px;
  overflow-y: auto;
  width: 100%;
  height: 100%;
}
.input-pay {
  width: max-content;
}
.spin {
  scale: 2;
}
.modal-container {
  display: flex;
  gap: 10px;
  flex-direction: column;
}
</style>
