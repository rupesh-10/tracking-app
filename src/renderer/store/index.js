import Vue from 'vue'
import Vuex from 'vuex'

// Modules
import timer from './timer'
import auth from './auth'

Vue.use(Vuex)

export default new Vuex.Store({
    modules:{
        timer,
        auth
    }
})