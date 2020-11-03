import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import 'amfe-flexible'
import './assets/style/index.scss'
import vcolorpicker from 'vcolorpicker'

Vue.config.productionTip = false
Vue.use(vcolorpicker)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
