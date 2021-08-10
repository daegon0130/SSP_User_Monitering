import Vue from 'vue'
import Router from 'vue-router'

import AccountPage from './../components/AccountPage.vue'
import Dashboard from './../components/Dashboard.vue'
import UVPage from './../components/UVPage.vue'
import PVPage from './../components/PVPage.vue'
import Realtime from './../components/Realtime'
import UserDistribution from './../components/UserDistribution'
import Heatmap from './../components/DateSelectHeat'
import UVHome from './../components/UVHome'
import UnusedAcc from './../components/UnusedAcc'
import AccountHome from './../components/AccountHome'
import PVHome from './../components/PVHome'
import PVUnpop from './../components/PVUnpop'

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
      component: AccountHome,
      children: [
        { path: '', component: AccountPage },
        { path: 'distribution', component: UserDistribution },
        { path: 'unused', component: UnusedAcc }
      ]
    },
    {
      path: '/UVPage',
      name: 'UVPage',
      component: UVHome,
      children: [
        { path: 'hourly', component: Heatmap },
        { path: '', component: UVPage }
      ]
    },
    {
      path: '/PVPage',
      name: 'PVPage',
      component: PVHome,
      children: [
        { path: '', component: PVPage },
        { path: 'Unpopular', component: PVUnpop }
      ]
    },
    {
      path: '/Realtime',
      name: 'Realtime',
      component: Realtime
    }
  ]
})
