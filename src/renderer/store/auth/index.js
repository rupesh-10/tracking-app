export default{
    namespaced:true,
    state:{
       loggedIn:localStorage.getItem('userData') && JSON.parse(localStorage.getItem('userData')),
       userData:JSON.parse(localStorage.getItem('userData')),
    },
    getters:{

    },
    mutations:{
        SET_LOGGED_IN(state,payload){
            state.loggedIn = payload
        },
        SET_USER_DATA(state,payload){
            localStorage.setItem('userData', JSON.stringify(payload))
            state.userData = JSON.parse(localStorage.getItem('userData'))
        },
      
    },

    actions:{
    }

    }