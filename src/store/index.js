import { createStore } from "vuex";
import { ModuleAxios } from "../../plugins/axios";
const axios = ModuleAxios({
  baseUrl: "http://localhost:8081/",
});
const productsModule = {
  namespaced: true,
  state() {
    return {
      dish: [],
      fastFoodAndDrink: [],
      extraFood: [],
    };
  },
  mutations: {
    setData(state, { dish, fastFoodAndDrink, extraFood }) {
      state.dish = dish;
      state.fastFoodAndDrink = fastFoodAndDrink;
      state.extraFood = extraFood;
    },
    setDishUnavailable(state, id) {
      const index = state.dish.findIndex((dish) => dish._id === id);
      state.dish[index].isAvailable = false;
    },
  },
  actions: {
    async fetchAllData(context) {
      const res = await axios.get("/user/seeAllFood");
      const food = res.data.food;
      context.commit("setData", { ...food });
    },
  },
  getters: {
    getDish(state) {
      return state.dish;
    },
    getDrink(state) {
      return state.fastFoodAndDrink.filter((item) => item.isDrink);
    },
    getFastFood(state) {
      return state.fastFoodAndDrink.filter((item) => !item.isDrink);
    },
    getExtraFood(state) {
      return state.extraFood;
    },
  },
};
const ordersModule = {
  namespaced: true,
  state() {
    return {
      orders: [],
    };
  },
  mutations: {
    setOrders(state, fetchOrder) {
      console.log(fetchOrder, "helo");
      state.orders = fetchOrder;
    },
  },
  actions: {
    async fetchOrders(context) {
      try {
        const res = await axios.get(
          "/user/watchMyOrder",

          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        context.commit("setOrders", res.data.orders);
      } catch (error) {
        console.log(error);
      }
    },
  },
  getters: {
    getDoingOrders(state) {
      return state.orders.filter((el) => el.status !== "waiting");
    },
    getDoneOrders(state) {
      return state.orders.filter((el) => el.status === "waiting");
    },
    getAllOrders(state) {
      return state.orders;
    },
    getOrdersNumber(state) {
      return state.orders.length;
    },
  },
};

const cartModule = {
  namespaced: true,
  state() {
    return {
      cart: [],
    };
  },
  mutations: {
    addCart(state, product) {
      state.cart.push(product);
    },
    delCart(state, productId) {
      const index = state.cart.findIndex(
        (product) => product.object._id == productId
      );
      state.cart.splice(index, 1);
    },
    resetCart(state) {
      state.cart = [];
    },
  },
  actions: {
    addCart(context, product) {
      context.commit("addCart", product);
    },
    delCart(context, productId) {
      context.commit("delCart", productId);
    },
    resetCart(context) {
      context.commit("resetCart");
    },
  },
  getters: {
    getCart(state) {
      return state.cart;
    },
    getCartNumber(state) {
      return state.cart.length;
    },
  },
};

export default createStore({
  modules: {
    prods: productsModule,
    cart: cartModule,
    orders: ordersModule,
  },
  state: {
    isLogin: false,
    isGuest: false,
  },
  getters: {
    getLoginState(state) {
      return state.isLogin;
    },
    getGuestState(state) {
      return state.isGuest;
    },
  },
  mutations: {
    toggleIsLogin(state) {
      state.isLogin = !state.isLogin;
    },
    toggleIsGuest(state) {
      state.isGuest = !state.isGuest;
    },
    setLogin(state, truthy) {
      state.isLogin = truthy;
    },
    setGuest(state, truthy) {
      state.isGuest = truthy;
    },
  },
  actions: {},
});
