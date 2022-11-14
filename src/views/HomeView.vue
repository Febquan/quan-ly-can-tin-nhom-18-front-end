<template>
  <div class="home">
    <HelloWorld msg="Chào mừng đến với căn tin HCMUS !" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "HomeView",
  components: {
    HelloWorld,
  },
};
</script>

<style scoped>
.home {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10vh;
  font-size: 1.2rem;
  user-select: none;
  height: 85vh;
}
</style>
