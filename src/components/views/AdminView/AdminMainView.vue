<template>
  <a-layout style="max-height: 87vh; min-height: 100%">
    <a-layout-sider v-model:collapsed="collapsed" theme="light" class="slider">
      <div class="logo" />
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="light"
        class="menu"
        mode="inline"
      >
        <a-sub-menu key="sub1">
          <template #title>
            <span>
              <BookFilled />
              <span>Quản lý đơn hàng</span>
            </span>
          </template>
          <a-menu-item key="1" @click="print">
            <router-link :to="{ name: 'OrderManagement' }"
              >Thực hiện đơn hàng</router-link
            >
          </a-menu-item>
          <a-menu-item key="2" @click="print">
            <router-link :to="{ name: 'OrderPayment' }"
              >Thanh toán
            </router-link>
          </a-menu-item>
          <a-menu-item key="3" @click="print">
            <router-link :to="{ name: 'OrderManipulate' }"
              >Sửa đơn hàng
            </router-link>
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub2">
          <template #title>
            <span>
              <ShopFilled />
              <span>Quản lý món ăn</span>
            </span>
          </template>
          <a-menu-item key="4">
            <router-link :to="{ name: 'MenuManagement' }"
              >Xây dựng thực đơn
            </router-link>
          </a-menu-item>
          <a-menu-item key="5">
            <router-link :to="{ name: 'MenuInput' }">Thêm món ăn</router-link>
          </a-menu-item>
          <a-menu-item key="6">
            <router-link :to="{ name: 'MenuChange' }"
              >Chỉnh sửa món ăn</router-link
            >
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub3">
          <template #title>
            <span>
              <AppstoreFilled />
              <span>Quản lý kho hàng</span>
            </span>
          </template>
          <a-menu-item key="7">
            <router-link :to="{ name: 'StorageManagement' }"
              >Thông tin kho
            </router-link>
          </a-menu-item>
          <a-menu-item key="8">
            <router-link :to="{ name: 'StorageInput' }">Nhập kho</router-link>
          </a-menu-item>
          <a-menu-item key="9">
            <router-link :to="{ name: 'StorageChange' }"
              >Chỉnh sửa kho</router-link
            >
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout style="min-height: 100%">
      <a-layout-content class="content-container">
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import { BookFilled, AppstoreFilled, ShopFilled } from "@ant-design/icons-vue";
export default {
  name: "AdminMainView",
  components: {
    BookFilled,
    AppstoreFilled,
    ShopFilled,
  },
  data() {
    return {
      collapsed: false,
      selectedKeys: "",
    };
  },
  methods: {
    // print() {
    //   this.$router.push({ name: "OrderManagement" });
    // },
  },
};
</script>

<style scoped>
.content-container {
  margin: 16px;

  min-height: 100%;
}
.menu {
  max-height: 100%;
}
.slider {
  margin-top: 16px;
}
</style>
