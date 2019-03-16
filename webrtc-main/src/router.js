import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import room from './views/room.vue';
import many from './views/many.vue';
import local1 from './views/local1.vue';
import Speech from './views/Speech.vue';
import transfer from './views/transfer.vue';
import remote1 from './views/remote1.vue';

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
            path: '/local1',
            name: 'local1',
            component: local1
        },
        {
            path: '/Speech',
            name: 'Speech',
            component: Speech
        },
        {
            path: '/transfer',
            name: 'transfer',
            component: transfer
        },
        {
            path: '/remote1',
            name: 'remote1',
            component: remote1
        }
    ],
});
