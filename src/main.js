import Vue from 'vue'
import App from './App'
import router from './router'
// vuex
import store from './store'
// 懒加载
import Vuelazyload from 'vue-lazyload'
// 处理手机300ms延时问题
import fastclick from 'fastclick'
// 初始化css样式
import '@/common/css/configure.css'
import '@/common/css/animate.css'
// 引入字体图标文件
import '@/common/fonts/font1/iconfont.css'
// 配置延时
fastclick.attach(document.body)

Vue.config.productionTip = false
// 懒加载配置
Vue.use(Vuelazyload, {
  preLoad: 1.2,
  error: require('@/common/images/lazyload/err.png'),
  loading: require('@/common/images/lazyload/load.png'),
  // // 重复请求一次
  attempt: 1
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
