import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import Vuex from 'vuex'
import store from './store'
import router from './router'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

Vue.use(Toast);

import LogRocket from 'logrocket';
LogRocket.init('fcdf2l/workplace');


import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(Vuex)
Vue.config.productionTip = false



new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
