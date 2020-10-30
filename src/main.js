import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import css from "tachyons";

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  css,
  render: function (h) { return h(App) }
}).$mount('#app')
