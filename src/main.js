import 'babel-polyfill'

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
//import Validator from 'vue-validator'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import './styles/reset.css'
import './styles/global.scss'
import store from './store'
import lodash from 'lodash'
import VueClipboard from 'vue-clipboard2'
import * as filters from './filters' // 全局filter

import './permission';
import './icons'

import AlertDialog from '@/components/AlertDialog';
import DialogEl from '@/components/ConsoleDialog'

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
});

Vue.prototype._ = lodash;
Vue.config.productionTip = false
Vue.prototype.$dialog = DialogEl;

Vue.use(ElementUI);
Vue.use(VueClipboard);
//Vue.use(Validator);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
