import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    name:'home',
    component: ()=> import('../components/NewTimerComponent.vue')
  },
  {
    path: '/screencaptured',
    name:'screen-captured',
    component: ()=> import('../components/ScreenCapturedImage.vue')
  },

]

const router = new VueRouter({
  base:process.env.BASE_URL,
  routes
})

export default router
