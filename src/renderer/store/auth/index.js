export default{
    namespaced:true,
    state:{
       loggedIn:false
    },
    getters:{

    },
    mutations:{
        SET_LOGGED_IN(state,payload){
            state.loggedIn = payload
        },
    }

    }