import Vue from 'vue'
import VueCoup from './VueCoup.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(VueCoup)
}).$mount('#app')
