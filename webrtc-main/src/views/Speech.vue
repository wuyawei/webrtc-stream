<template>
    <div class="Speech">
        <div>
            <h3>语音识别</h3>
            <textarea name="" cols="30" rows="10" v-model="text" placeholder="语音识别似乎需要翻墙"></textarea>
            <button @click="start">{{state === '1' ? '开始' : state === '2' ? '识别中···' : ''}}</button>
            <button @click="stop" v-show = "state === '2'">结束</button>
        </div>
        <div>
            <h3>文字转语音</h3>
            <textarea name="" cols="30" rows="10" v-model="message"></textarea>
            <button @click="transform">转换</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Speech',
        data() {
            return {
                newRecognition: null,
                text: '',
                state: '1',
                message: ''
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
            },
            transform() {
                this.speak(this.message); // 文字转语音
            },
            speak(message) {
                let speech = new SpeechSynthesisUtterance();

                //设置朗读内容和属性
                speech.text = message;
                speech.volume = 1;
                speech.rate = 1;
                speech.pitch = 1;

                window.speechSynthesis.speak(speech);
            },
            close() {
                window.speechSynthesis.stop();
            }
        },
        mounted() {
            let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.newRecognition = new SpeechRecognition();
            this.newRecognition.continuous = true;
            this.newRecognition.onresult = function(event) {
                console.log(event);
            };
            this.newRecognition.onerror = function(event) {
                console.log(event);
            };
            this.newRecognition.onstart = function(event) {
                console.log(event);
            };

            this.newRecognition.onspeechend = function(event) {
                console.log(event);
            };
        }
    };
</script>

<style lang="scss">
</style>
