<template>
    <div class="transfer-box">
        <div class="transfer">
            <video src="" ref="v1" controls autoplay></video>
            <video src="" ref="v2" controls autoplay></video>
        </div>
        <button @click="transfer">传输</button>
    </div>
</template>
<script>
    export default{
        name: 'transfer',
        data() {
            return {};
        },
        methods: {
            transfer() {
                let stream = this.$refs['v1'].captureStream();
                this.$refs['v2'].srcObject = stream;
            }
        },
        mounted() {
            this.$nextTick(() => {
                navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(stream => {
                    this.$refs['v1'].srcObject = stream;
                })
            });
        }
    }
</script>
<style lang="scss">
    .transfer{
        display: flex;
        justify-content: center;
        video{
            width: 480px;
            height: 320px;
            margin-left: 20px;
        }
    }
    .transfer-box{
        button{
            margin: 10px;
        }
    }
</style>