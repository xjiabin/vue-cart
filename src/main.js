import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import './plugins/element.js'

Vue.config.productionTip = false

// 在原型上挂载一个主线路，用来专门派发和接收事件
Vue.prototype.$bus = new Vue();

// 将 axios 挂载到原型
Vue.prototype.$axios = axios;

new Vue({
  render: h => h(App),
}).$mount('#app')
