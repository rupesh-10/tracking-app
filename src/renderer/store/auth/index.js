export default{
    namespaced:true,
    state:{
       loggedIn:localStorage.getItem('userData') && JSON.parse(localStorage.getItem('userData')),
       userData:JSON.parse(localStorage.getItem('userData')),
       project: JSON.parse(localStorage.getItem('selectedProject'))
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
        SET_PROJECT(state,payload){
            localStorage.setItem('selectedProject',JSON.stringify(payload))
            state.project = JSON.parse(localStorage.getItem('selectedProject'))
        }
    },

    actions:{
    }

    }