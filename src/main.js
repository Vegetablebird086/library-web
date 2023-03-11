import Vue from 'vue'
import App from './App.vue'
// 引入 路由
import router from './router'
import store from './store'
// 引入css 样式
import 'element-ui/lib/theme-chalk/index.css';
// 引入element-ui
import ElementUI from 'element-ui'
import request from "@/utils/request";
import requestBook from "@/utils/requestBook";
import requestSearch from "@/utils/requestSearch";

Vue.config.productionTip = false

Vue.use(ElementUI);

Vue.prototype.request=request
Vue.prototype.requestBook=requestBook
Vue.prototype.requestSearch=requestSearch

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
