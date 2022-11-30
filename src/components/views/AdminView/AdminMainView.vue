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
        <!-- <a-menu-item key="2">
          <desktop-outlined />
          <span>Quản lý sản phẩm</span>
        </a-menu-item> -->
        <!-- <a-sub-menu key="sub1">
          <template #title>
            <span>
              <user-outlined />
              <span>Quản lý </span>
            </span>
          </template>
          <a-menu-item key="3">Tom</a-menu-item>
          <a-menu-item key="4">Bill</a-menu-item>
          <a-menu-item key="5">Alex</a-menu-item>
        </a-sub-menu> -->
        <a-sub-menu key="sub2">
          <template #title>
            <span>
              <team-outlined />
              <span>Quản lý kho hàng</span>
            </span>
          </template>
          <a-menu-item key="4">Nhập kho</a-menu-item>
          <a-menu-item key="5">Thông tin kho</a-menu-item>
        </a-sub-menu>
        <a-menu-item key="9">
          <file-outlined />
          <span>File</span>
        </a-menu-item>
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
import { BookFilled } from "@ant-design/icons-vue";
export default {
  name: "AdminMainView",
  components: {
    BookFilled,
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
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.slider {
  margin-top: 16px;
}
</style>
