import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from "./store";

import toast from 'components/common/toast'

//安装toast插件
Vue.use(toast)

Vue.config.productionTip = false
//添加事件总线对象到Vue原型中
Vue.prototype.$bus=new Vue()

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
