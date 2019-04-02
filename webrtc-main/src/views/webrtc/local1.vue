<template>
    <div class="demo">
        <div class="rtcBox">
            <div>
                <div class="video-box">
                    <video src="" id="rtcA" controls autoplay></video>
                    <h5>A</h5>
                </div>
                <div class="chat-box" v-show="!allowHangup && messageOpen">
                    <h5>收消息</h5>
                    <p>{{receiveText}}</p>
                </div>
            </div>
            <div>
                <div class="video-box">
                    <video src="" id="rtcB" controls autoplay></video>
                    <h5>B</h5>
                    <button @click="call" :disabled="allowCall">call</button>
                    <button @click="hangup" :disabled="allowHangup">hangup</button>
                </div>
                <div class="chat-box" v-show="!allowHangup && messageOpen">
                    <h5>发消息</h5>
                    <textarea v-model="sendText"></textarea>
                    <br>
                    <button @click="send">发送</button>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        name: 'local1',
        data() {
            return {
                peerA: null,
                peerB: null,
                channelA: null,
                channelB: null,
                offerOption: {
                    offerToReceiveAudio: 1,
                    offerToReceiveVideo: 1
                },
                allowCall: true,
                allowHangup: true,
                messageOpen: false,
                sendText: '',
                receiveText: ''
            }
        },
        methods: {
            send() {
                this.channelB.send(JSON.stringify({name: this.sendText}));
                this.sendText = '';
            },
            start() {
                this.state = '2';
                this.newRecognition.start();
            },
            stop() {
                this.state = '1';
                this.newRecognition.stop();
            },
            async call() {
                if (!this.peerA || !this.peerB) { // 判断是否有对应实例，没有就重新创建
                    this.initPeer();
                }
                try {
                    let offer = await this.peerB.createOffer(this.offerOption); // 创建 offer
                    await this.onCreateOffer(offer);
                } catch (e) {
                    console.log('createOffer: ', e);
                }

                this.allowCall = true;
                this.allowHangup = false;
            },
            hangup() {
                this.peerA.close();
                this.peerB.close();
                this.channelA.close();
                this.channelB.close();
                this.peerA = null;
                this.peerB = null;
                this.channelA = null;
                this.channelB = null;
                this.sendText = '';
                this.receiveText = '';
                this.allowCall = false;
                this.allowHangup = true
            },
            async onCreateOffer(desc) {
                try {
                    await this.peerB.setLocalDescription(desc); // 呼叫端设置本地 offer 描述
                } catch (e) {
                    console.log('Offer-setLocalDescription: ', e);
                }
                try {
                    await this.peerA.setRemoteDescription(desc); // 接收端设置远程 offer 描述
                } catch (e) {
                    console.log('Offer-setRemoteDescription: ', e);
                }
                try {
                    let answer = await this.peerA.createAnswer(); // 接收端创建 answer
                    await this.onCreateAnswer(answer);
                } catch (e) {
                    console.log('createAnswer: ', e);
                }
            },
            async onCreateAnswer(desc) {
                try {
                    await this.peerA.setLocalDescription(desc); // 接收端设置本地 answer 描述
                } catch (e) {
                    console.log('answer-setLocalDescription: ', e);
                }
                try {
                    await this.peerB.setRemoteDescription(desc); // 呼叫端设置远程 answer 描述
                } catch (e) {
                    console.log('answer-setRemoteDescription: ', e);
                }
            },
            initPeer() {
                // 创建输出端 PeerConnection
                let PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
                this.peerA = new PeerConnection();
                this.peerA.addStream(this.localstream); // 添加本地流
                // 监听 A 的ICE候选信息
                // 如果收集到，就添加给 B
                this.peerA.onicecandidate = (event) => {
                    if (event.candidate) {
                        this.peerB.addIceCandidate(event.candidate);
                    }
                };
                this.peerA.ondatachannel = (event) => {
                    console.log(event);
                    this.channelA = event.channel;
                    this.channelA.binaryType = 'arraybuffer'
﻿                    this.channelA.onopen = (e) => {
                        console.log('channelA onopen', e);
                    };
                    this.channelA.onclose = (e) => {
                        console.log('channelA onclose', e);
                    };
                    this.channelA.onmessage = (e) => {
                        this.receiveText = JSON.parse(e.data).name;
                        console.log('channelA onmessage', e.data);
                    };
                };
//                this.channelA.send('Hi you!');
                // 创建呼叫端
                this.peerB = new PeerConnection();
                this.peerB.onaddstream = (event) => { // 监听是否有媒体流接入，如果有就赋值给 rtcB 的 src
                    console.log('event-stream', event);
                    let video = document.querySelector('#rtcB');
                    video.srcObject = event.stream;
                };
                this.channelB = this.peerB.createDataChannel('messagechannel');
                console.log('this.channelB', this.channelB);
                this.channelB.binaryType = 'arraybuffer';
                this.channelB.onopen = (event) => {
                    console.log('channelB onopen', event);
                    this.messageOpen = true;
                };
                this.channelB.onclose = function(event) {
                    console.log('channelB onclose', event)
                };
                // 监听 B 的ICE候选信息
                // 如果收集到，就添加给 A
                this.peerB.onicecandidate = (event) => {
                    if (event.candidate) {
                        this.peerA.addIceCandidate(event.candidate);
                    }
                };
                this.allowCall = false;
            },
            async createMedia() {
                // 保存本地流到全局
                this.localstream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
                // console.log(this.localstream);
                // console.log(this.localstream.getVideoTracks(), this.localstream.getAudioTracks());
                let video = document.querySelector('#rtcA');
                video.srcObject = this.localstream;
                this.initPeer(); // 获取到媒体流后，调用函数初始化 RTCPeerConnection
            }
        },
        mounted() {
            this.$nextTick(() => {
                // {mediaSource: 'screen'}
                this.createMedia();
            });
        }
    };
</script>

<style lang="scss">
    .rtcBox{
        display: flex;
        justify-content: center;
        .video-box{
            height: 380px;
            border-bottom: 1px solid #1fbeca;
            margin-bottom: 10px;
        }
        video{
            width: 400px;
            height: 300px;
            margin-left: 20px;
            background-color: #ddd;
        }
        .chat-box{
            text-align: center;
            h5{
                margin-bottom: 10px;
            }
            p,textarea{
                width: 240px;
                height: 60px;
                border: 1px solid #000;
                display: inline-block;
            }
        }
    }
</style>
