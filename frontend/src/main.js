import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import vuetify from './plugins/vuetify'
import store from './store/store'
import VueMoment from 'vue-moment'

Vue.config.productionTip = false
Vue.use(VueMoment)

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
