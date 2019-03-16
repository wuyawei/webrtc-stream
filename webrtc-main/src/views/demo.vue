<template>
    <div class="demo">
        <video src="" id="rtc" controls autoplay></video>
        <!--<audio src="" id="voice" controls autoplay></audio>-->
    </div>
</template>

<script>
    export default {
        name: 'home',
        data() {
            return {
                newRecognition: null,
                text: '',
                state: '1'
            }
        },
        methods: {
            start() {
                this.state = '2';
                this.newRecognition.start();
            },
            stop() {
                this.state = '1';
                this.newRecognition.stop();
            }
        },
        mounted() {
            this.$nextTick(() => {
                // {mediaSource: 'screen'}
                navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(stream => {
                    // console.log(stream);
                    // console.log(stream.getVideoTracks(), stream.getAudioTracks());
                     let video = document.querySelector('#rtc');
                     video.srcObject = stream;
//                     let audio = document.querySelector('#voice');
//                    audio.srcObject = stream;
                })
            });
        }
    };
</script>

<style lang="scss">
    #rtc{
        width: 480px;
        height: 320px;
    }
</style>
