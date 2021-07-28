import Vue from 'vue'
import Router from 'vue-router'

import AccountPage from './../components/AccountPage.vue'
import Dashboard from './../components/Dashboard.vue'
import AddClient from './../components/AddClient.vue'
import UVPage from './../components/UVPage.vue'
import PVPage from './../components/PVPage.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/AccountPage',
      name: 'AccountPage',
      component: AccountPage
    },
    {
      path: '/AddClient',
      name: 'AddClient',
      component: AddClient
    },
    {
      path: '/UVPage',
      name: 'UVPage',
      component: UVPage
    },
    {
      path: '/PVPage',
      name: 'PVPage',
      component: PVPage
    }
  ]
})
