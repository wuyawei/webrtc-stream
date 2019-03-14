<template>
    <div class="many">
        <div class="center">
            登录名：<input type="text" v-model="account"> <br>
            房间号：<input type="text" v-model="roomid"> <br>
            <button @click="join">加入房间</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'home',
        data() {
            return {
                roomid: '',
                account: ''
            }
        },
        methods: {
            join() {
                if (this.account && this.roomid) {
                    this.$router.push({name: 'room', params: {roomid: this.roomid, account: this.account}})
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
    .many{
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
