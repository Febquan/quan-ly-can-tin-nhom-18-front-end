<template>
  <div class="container">
    <div class="menuManagement-container">
      <BusinessNote
        v-for="Business in Businesses"
        :key="Business._id + dayjs().toString()"
        :business="Business"
        :zero="Business.zero"
        @reloadPls="initialFetch"
      ></BusinessNote>
    </div>
  </div>
</template>

<script>
import convertVND from "@/util/moneyformat";
import dayjs from "dayjs";
import BusinessNote from "./BusinessNote.vue";
export default {
  components: {
    BusinessNote,
  },
  async created() {
    await this.initialFetch();
  },
  computed: {},
  methods: {
    async initialFetch() {
      try {
        let res1 = await this.$axios.post("/admin/findDailyBusiness", {
          notStatus: "completed",
        });

        res1 = res1.data.content.sort((a, b) => {
          return dayjs(b.date).diff(dayjs(a.date));
        });
        this.Businesses = res1;
        console.log(this.Business);
        for (let i = 0; i < this.Businesses.length; i++) {
          let zero = false;
          for (let item of this.Businesses[i].expenses) {
            if (item.cost == 0) {
              zero = true;
            }
          }
          this.Businesses[i].zero = zero;
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
  data() {
    return {
      convertVND,
      dayjs,
      Businesses: {},
    };
  },
};
</script>

<style scoped>
.container {
  background-color: var(--white);
  height: 100%;
  width: 100%;
  overflow: auto;

  padding: 24px;
  column-gap: 30px;
  align-content: center;
}

.menuManagement-container {
  border: 4px solid var(--primary);
  border-radius: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  gap: 30px;
  padding: 40px;
  height: 100%;
  width: 100%;
}
</style>
