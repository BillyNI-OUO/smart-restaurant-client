import Vue from 'vue'
import VueRouter from 'vue-router'
import Search from '../views/Search.vue'
import Detail from '../views/Detail.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home'
  },
  {
    path: '/search/:query',
    name: 'Search',
    component: Search
  },
  {
    path: '/detail/:cid',
    name: 'Detail',
    component: Detail
  }
]

const router = new VueRouter({
  routes
})

export default router
