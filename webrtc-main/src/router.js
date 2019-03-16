import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import room from './views/room.vue';
import many from './views/many.vue';
import demo from './views/demo.vue';
import Speech from './views/Speech.vue';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
        },
        {
            path: '/room/:roomid/:account',
            name: 'room',
            component: room
        },
        {
            path: '/many',
            name: 'many',
            component: many
        },
        {
            path: '/demo',
            name: 'demo',
            component: demo
        },
        {
            path: '/Speech',
            name: 'Speech',
            component: Speech
        }
    ],
});
