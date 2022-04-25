import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import i18n from './plugins/vue-i18n'
/*
import VueAnalytics from 'vue-analytics'
Vue.use(VueAnalytics, {
  id: 'G-PRN13V8SVN',
  router
})
*/

Vue.config.productionTip = false

document.body.addEventListener('click', function(evt) {
  var nodeName = evt.target.nodeName.toLowerCase()
  if (
    nodeName !== 'input' &&
    nodeName !== 'textarea' &&
    nodeName !== 'select'
  ) {
    document.activeElement.blur()
  }
})

new Vue({
  router,
  vuetify,
  i18n,
  render: (h) => h(App)
}).$mount('#app')
