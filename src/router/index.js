import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = []

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to,from,next) => {
  if (to.meta.background === 'gray') {
    document.querySelector('body').style.background = '#F4F6F9'
  } else {
    document.querySelector('body').style.background = '#FFFFFF'
  }
})

export default router
