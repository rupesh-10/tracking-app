import Vue from 'vue'
import VueRouter from 'vue-router'
import {isUserLoggedIn,isProjectSelected} from '../auth/middleware'

Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    name:'home',
    component: ()=> import('../components/timer/NewTimerComponent.vue'),
    meta:{
      middleware:[isUserLoggedIn,isProjectSelected]
    }
  },
  {
    path: '/login',
    name:'login',
    component: ()=> import('../components/auth/Login.vue'),
  },
  // {
  //   path: '/screencaptured',
  //   name:'screen-captured',
  //   component: ()=> import('../components/common/ScreenCapturedImage.vue'),
  //   beforeEnter:isUserLoggedIn
  // },
  {
    path:'/projects',
    name:'projects',
    component:()=>import('../components/projects/Index.vue'),
    meta:{
      middleware:[isUserLoggedIn]
    }
  }
]

const router = new VueRouter({
  base:process.env.BASE_URL,
  routes
})

// checks for next middleware
function nextFactory(context, middleware, index) {
  const subsequentMiddleware = middleware[index]
  if (!subsequentMiddleware) return context.next

  return (...parameters) => {
    context.next(...parameters)
    const nextMiddleware = nextFactory(context, middleware, index + 1)
    subsequentMiddleware({ ...context, next: nextMiddleware })
  }
}


// checks for middlewares
router.beforeEach((to, from, next) => {
  if (to.meta.middleware) {
    const middleware = Array.isArray(to.meta.middleware)
      ? to.meta.middleware
      : [to.meta.middleware]
    const context = {
      from,
      next,
      router,
      to,
    }
    const nextMiddleware = nextFactory(context, middleware, 1)
    return middleware[0]({ ...context, next: nextMiddleware })
  }
  return next()
})




export default router
