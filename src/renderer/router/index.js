import Vue from 'vue'
import VueRouter from 'vue-router'
import {isUserLoggedIn} from '../auth/middleware'

Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    name:'home',
    component: ()=> import('../components/timer/NewTimerComponent.vue'),
    beforeEnter: isUserLoggedIn
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
    beforeEnter:isUserLoggedIn
  }
]

const router = new VueRouter({
  base:process.env.BASE_URL,
  routes
})




export default router
