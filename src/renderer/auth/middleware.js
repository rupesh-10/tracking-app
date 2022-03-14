// import useJwt from './jwt/useJwt'
// import store from '../store/index'
// localStorage.getItem('userData') && localStorage.getItem(useJwt.jwtConfig.storageTokenKeyName)
// const {loggedIn} = store.state.auth 
export const isUserLoggedIn = (to, from, next) => { 
     if(!(localStorage.getItem('userData'))){
        return next({
            name:'login'
        })
     }
     return next()
  }