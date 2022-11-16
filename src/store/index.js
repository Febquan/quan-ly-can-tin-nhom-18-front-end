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
      FFAD: [],
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
    getFastFoodAndDrink(state) {
      return state.fastFoodAndDrink;
    },
    getExtraFood(state) {
      return state.extraFood;
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
      state.cart.filters((product) => product._id === productId);
    },
  },
  actions: {
    addCart(context, product) {
      context.commit("addCart", product);
    },
    delCart(context, productId) {
      context.commit("delCart", productId);
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
  },
  actions: {},
});
