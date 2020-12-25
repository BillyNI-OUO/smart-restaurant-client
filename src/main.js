import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

window.APIBASE = 'https://smart-restaurant.duckdns.org'
// window.APIBASE = 'http://localhost:5000'

new Vue({
  router,
  vuetify,
  render: (h) => h(App)
}).$mount('#app')
