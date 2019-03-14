<template>
    <div class="home">
        <div class="center">
            <div><router-link :to="{name: 'demo'}">api演示</router-link></div>
            <div><router-link :to="{name: 'many'}">多人聊天</router-link></div>
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
        width:200px;
        margin: auto;
        font-size: 18px;
        border: 1px solid #ddd;
        margin-top: 200px;
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
</style>
