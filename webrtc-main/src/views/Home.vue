<template>
    <div class="home">
        <div class="fork-me-on-github">
            <a href="https://github.com/wuyawei" target="_blank"></a>
        </div>
        <div class="center">
            <div><router-link :to="{name: 'Speech'}">H5 语音识别</router-link></div>
            <div><router-link :to="{name: 'transfer'}">video 标签之间的流传输</router-link></div>
            <div><router-link :to="{name: 'local1'}">WebRTC 1 v 1 本地对等连接</router-link></div>
            <div><router-link :to="{name: 'remote1'}">WebRTC  1 v 1 网络对等连接</router-link></div>
            <!--<div><router-link :to="{name: 'many'}">多人聊天</router-link></div>-->
        </div>
    </div>
</template>

<script>
    export default {
        name: 'home',
        data() {
            return {
            }
        }
    };
</script>

<style lang="scss" scoped>
    .home{
        text-align: center;
    }
    .center{
        margin: auto;
        font-size: 18px;
        border: 1px solid #ddd;
        margin-top: 100px;
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
        width: 150px;
        height: 150px;
        background-image: url("../assets/github.png");
        position: absolute;
        right: 0;
        top:0;
        background-size: contain;
        a{
            display: block;
            width: 150px;
            height: 150px;
        }
    }
</style>
