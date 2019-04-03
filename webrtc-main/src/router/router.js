import Vue from 'vue';
import Router from 'vue-router';
import _import from './_import';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: _import('Home'),
        },
        {
            path: '/room/:roomid/:account',
            name: 'room',
            component: _import('webrtc/room')
        },
        {
            path: '/many',
            name: 'many',
            component: _import('webrtc/many')
        },
        {
            path: '/local1',
            name: 'local1',
            component: _import('webrtc/local1')
        },
        {
            path: '/Speech',
            name: 'Speech',
            component: _import('webrtc/Speech')
        },
        {
            path: '/transfer',
            name: 'transfer',
            component: _import('webrtc/transfer')
        },
        {
            path: '/remote1',
            name: 'remote1',
            component: _import('webrtc/remote1')
        },
        {
            path: '/palette',
            name: 'palette',
            component: _import('webrtc/palette')
        },
        {
            path: '/whiteboard',
            name: 'whiteboard',
            component: _import('webrtc/whiteboard')
        },
        {
            path: '/communication',
            name: 'communication',
            component: _import('communication/communication')
        },
        {
            path: '/responsive',
            name: 'responsive',
            component: _import('responsive/responsive')
        },
    ],
});
