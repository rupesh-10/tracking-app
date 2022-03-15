export default{
    namespaced:true,
    state:{
       loggedIn:localStorage.getItem('userData') && JSON.parse(localStorage.getItem('userData')),
       userData:JSON.parse(localStorage.getItem('userData'))
    },
    getters:{

    },
    mutations:{
        SET_LOGGED_IN(state,payload){
            state.loggedIn = payload
        },
    },

    actions:{
    }

    }