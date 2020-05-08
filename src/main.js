import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import vueLodash from './plugins/lodash';
import PerfectScrollbar from 'vue-perfect-scrollbar';
import router from './router';
import './plugins/axios';

Vue.use(PerfectScrollbar)
Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  vueLodash,
  render: h => h(App)
}).$mount('#app')