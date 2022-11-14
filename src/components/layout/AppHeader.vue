<template>
  <section>
    <div>
      <router-link to="/">
        <div class="logo-container">
          <img class="logo" src="@/assets/image/Logo.png" alt="logo" />
          <h1 class="logo-name">CĂN TIN 18</h1>
        </div>
      </router-link>

      <div>
        <a-button size="medium">
          <template #icon>
            <LoginOutlined />
          </template>
          Login
        </a-button>
        <a-button size="medium">
          <template #icon>
            <UsergroupAddOutlined />
          </template>
          Sign Up
        </a-button>
      </div>
    </div>
  </section>
</template>

<script>
import { LoginOutlined } from "@ant-design/icons-vue";
import { UsergroupAddOutlined } from "@ant-design/icons-vue";
export default {
  components: {
    LoginOutlined,
    UsergroupAddOutlined,
  },
};
</script>

<style scoped>
section {
  height: 10vh;
  width: 100%;
  position: fixed;
  top: 0;
  background-color: var(--primary);
  border-bottom: 3px solid var(--primary-darker);
  box-shadow: 0px -3px 20px var(--black);
  display: flex;
  justify-content: center;
  align-items: center;
}
section > div {
  display: flex;
  justify-content: space-between;
  width: 60%;
  align-items: center;
}
section > div > div {
  display: flex;
  gap: 16px;
}

.logo-container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
.logo-name {
  color: var(--white);
  margin: 0;
  font-size: 2rem;
  font-weight: 800;
}
.logo {
  height: 8vh;
}
</style>
