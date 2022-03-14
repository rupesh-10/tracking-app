import Vue from 'vue'
import Vuex from 'vuex'

// Modules
import timer from './timer'

Vue.use(Vuex)

export default new Vuex.Store({
    modules:{
        timer
    }
})