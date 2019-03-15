<template>
    <div class="demo">
        <video src="" id="rtc" controls autoplay></video>
        <!--<audio src="" id="voice" controls autoplay></audio>-->
        <!--<br>-->
        <!--<button @click="start">{{state === '1' ? '开始' : state === '2' ? '识别中···' : ''}}</button>-->
        <!--<button @click="stop" v-show = "state === '2'">结束</button>-->
        <!--<textarea name="" id="" cols="30" rows="10" v-model="text"></textarea>-->
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
            this.$nextTick(_ => {
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
//            this.newRecognition = new webkitSpeechRecognition();
//            this.newRecognition.continuous = true;
//            this.newRecognition.onresult = function(event) {
//                console.log(event);
//            };
//            this.newRecognition.onerror = function(event) {
//                console.log(event);
//            };
//            this.newRecognition.onstart = function(event) {
//                console.log(event);
//            };
//
//            this.newRecognition.onspeechend = function(event) {
//                console.log(event);
//            };
//            new window.SpeechSynthesisUtterance('你好，世界！'); // 文字转语音
        }
    };
</script>

<style lang="scss">
    #rtc{
        width: 480px;
        height: 320px;
    }
</style>
