<template>
    <div class="home">
        <div class="center">
            房间号：<input type="text" v-model="roomid">
            <router-link :to="{name: 'room', params: {roomid: roomid}}">加入房间</router-link>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'home',
        data() {
            return {
                roomid: ''
            }
        },
        methods: {

        }
    };
</script>

<style lang="scss">
    .home{
        text-align: center;
    }
    .center{
        width:500px;
        height: 400px;
        position: absolute;
        left:0;
        top:0;
        bottom:0;
        right:0;
        margin: auto;
    }
</style>
