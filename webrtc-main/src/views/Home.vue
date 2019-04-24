<template>
    <div class="home">
        <a href="https://github.com/wuyawei" target="_blank" class="github-logo"></a>
        <div class="fork-me-on-github"></div>
        <div class="center">
            <div><router-link :to="{name: 'Speech'}">H5 语音识别</router-link></div>
            <div><router-link :to="{name: 'communication'}">Vue 组件间通信</router-link></div>
            <div><router-link :to="{name: 'responsive'}">Vue 响应式原理</router-link></div>
            <div><router-link :to="{name: 'transfer'}">video 标签之间的流传输</router-link></div>
            <div><router-link :to="{name: 'local1'}">WebRTC 1 v 1 本地对等连接</router-link></div>
            <div><router-link :to="{name: 'remote1'}">WebRTC  1 v 1 网络对等连接</router-link></div>
            <div><router-link :to="{name: 'many'}">多人聊天</router-link></div>
            <div><router-link :to="{name: 'whiteboard'}">白板演示</router-link></div>
            <div><router-link :to="{name: 'palette'}">共享画板</router-link></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'home',
        data() {
            return {
                sdata: []
            }
        },
        watch: {
        },
        methods: {
        },
        mounted() {
        }
    };
</script>

<style lang="scss" scoped>
    .home{
        text-align: center;
        .github-logo{
            position: absolute;
            right: 0;
            top: 0;
            width: 120px;
            height: 120px;
            z-index: 1;
            background-image: url("../assets/github.png");
            background-size: contain;
            background-position: 10px -8px;
            background-repeat: no-repeat;
            display: block;
        }
    }
    .center{
        margin: auto;
        font-size: 18px;
        border: 1px solid #ddd;
        margin-top: 100px;
        position: relative;
        a{
            color: #323232;
        }
        div{
            line-height: 48px;
            border-bottom: 1px solid #ddd;
            cursor: pointer;
        }
        div:last-child{
            border-bottom: none;
        }
        div:hover{
            background-color: #25b25e;
            a{
                display: block;
                color: #fff;
            }
        }
    }

    .fork-me-on-github{
        width: 0;
        height: 0;
        position: absolute;
        right: 0;
        top:0;
        border-right: 60px solid rgba(37, 178, 94, 0.8);
        border-top: 60px solid rgba(37, 178, 94, 0.8);
        border-bottom: 60px solid #fff;
        border-left: 60px solid #fff;
    }
    .edit-div{
        width: 200px;
        height: 200px;
        display: table-cell;
        vertical-align: middle;
        border: 1px solid #000;
    }
</style>
