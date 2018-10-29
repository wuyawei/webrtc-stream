import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import socket from './socket';
socket.on('connect', ()=>{
    console.log('连接成功');
});
socket.on('disconnect', ()=>{
    console.log('连接断开了');
});
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
