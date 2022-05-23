import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/blockgame'
    },
    {
      path: '/blockgame',
      name: 'blockgame',
      meta: {
        title: 'blockGame',
        index: 1
      },
      component: () => import('./views/gamePage.vue')
    }
  ]
})
