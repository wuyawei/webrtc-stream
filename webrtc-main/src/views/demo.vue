<template>
    <div class="demo">
        <video src="" id="rtc" controls autoplay></video>
    </div>
</template>

<script>
    export default {
        name: 'home',
        data() {
            return {
            }
        },
        mounted() {
            this.$nextTick(_ => {
                navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(stream => {
                    console.log(stream);
                    let video = document.querySelector('#rtc');
                    video.srcObject = stream;
                })
            })
        }
    };
</script>

<style lang="scss">
    #rtc{
        width:480px;
        height:320px;
    }
</style>
