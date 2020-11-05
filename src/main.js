import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import 'amfe-flexible'
import './assets/style/index.scss'
import vcolorpicker from 'vcolorpicker'
import Vconsole from "vconsole"

Vue.config.productionTip = false
Vue.use(vcolorpicker)
new Vconsole()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
