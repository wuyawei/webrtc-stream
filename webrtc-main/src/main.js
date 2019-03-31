import Vue from 'vue';
import App from './App.vue';
import router from './router/router';
import store from './store/store';
import socket from './utils/socket';
import bus from './utils/eventBus';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

socket.on('connect', ()=>{
    console.log('连接成功');
});
socket.on('disconnect', ()=>{
    console.log('连接断开了');
});
Vue.config.productionTip = false;
// Vue.prototype.$bus = bus;
Vue.prototype.$bus=new Vue();
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
