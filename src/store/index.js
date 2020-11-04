import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    totalItemsEntered: "",
  },
  mutations: {
    setTotalItemsEntered(state, payload) {
      state.totalItemsEntered = payload;
    },
  },
  actions: {},
  modules: {},
});
