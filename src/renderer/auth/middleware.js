// import useJwt from './jwt/useJwt'
// import store from '../store/index'
// localStorage.getItem('userData') && localStorage.getItem(useJwt.jwtConfig.storageTokenKeyName)

// import router from "../router"

// const {loggedIn} = store.state.auth 
export const isUserLoggedIn = ({next,router}) => { 
     if(!(localStorage.getItem('userData'))){
        return router.push({
            name:'login'
        })
     }
     return next()
  }

// export const isNotUserLoggedIn = ({next,router}) => {
//    if((localStorage.getItem('userData'))){
//       return router.push({
//          name:'home'
//       })
//    }
//    return next()
// }

  export const isProjectSelected = ({next,router}) => { 
     console.log('hsdfjdlk')
   if(!(localStorage.getItem('selectedProject'))){
      return router.push({
          name:'projects'
      })
   }
   return next()
}
