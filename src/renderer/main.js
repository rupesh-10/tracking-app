import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import Vuex from 'vuex'
import store from './store'


// const electron = window.require('electron')
// const {app} = electron
  


import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(Vuex)
Vue.config.productionTip = false

// app.on('ready', async () => {
//   electron.powerMonitor.on('suspend', async() => {
//     console.log('The system is going to sleep')
//   })
// })

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
