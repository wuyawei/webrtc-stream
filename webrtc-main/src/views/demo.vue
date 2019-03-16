<template>
    <div class="demo">
        <div class="rtcBox">
            <div>
                <video src="" id="rtcA" controls autoplay></video>
                <h5>A</h5>
            </div>
            <div>
                <video src="" id="rtcB" controls autoplay></video>
                <h5>B</h5>
                <button @click="call" :disabled="allowCall">call</button>
                <button @click="hangup" :disabled="allowHangup">hangup</button>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        name: 'demo',
        data() {
            return {
                newRecognition: null,
                text: '',
                state: '1',
                peerA: null,
                peerB: null,
                offerOption: {
                    offerToReceiveAudio: 1,
                    offerToReceiveVideo: 1
                },
                allowCall: true,
                allowHangup: true
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
            async call() {
                if (!this.peerA || !this.peerB) {
                    this.initPeer();
                }
                try {
                    let offer = await this.peerA.createOffer(this.offerOption);
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
                this.peerA = null;
                this.peerB = null;
                this.allowCall = false;
                this.allowHangup = true
            },
            async onCreateOffer(desc) {
                try {
                    await this.peerA.setLocalDescription(desc);
                } catch (e) {
                    console.log('Offer-setLocalDescription: ', e);
                }
                try {
                    await this.peerB.setRemoteDescription(desc);
                } catch (e) {
                    console.log('Offer-setRemoteDescription: ', e);
                }
                try {
                    let answer = await this.peerB.createAnswer();
                    await this.onCreateAnswer(answer);
                } catch (e) {
                    console.log('createAnswer: ', e);
                }
            },
            async onCreateAnswer(desc) {
                try {
                    await this.peerB.setLocalDescription(desc);
                } catch (e) {
                    console.log('answer-setLocalDescription: ', e);
                }
                try {
                    await this.peerA.setRemoteDescription(desc);
                } catch (e) {
                    console.log('answer-setRemoteDescription: ', e);
                }
            },
            initPeer() {
                // 创建输出端 PeerConnection
                let PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
                this.peerA = new PeerConnection();
                this.peerA.addStream(this.localstream);
                this.peerA.onicecandidate = (event) => {
                    if (event.candidate) {
                        this.peerB.addIceCandidate(event.candidate);
                    }
                };
                // 创建呼叫端
                this.peerB = new PeerConnection();
                this.peerB.onaddstream = (event) => {
                    console.log('event-stream', event);
                    let video = document.querySelector('#rtcB');
                    video.srcObject = event.stream;
                };
                this.peerB.onicecandidate = (event) => {
                    if (event.candidate) {
                        this.peerA.addIceCandidate(event.candidate);
                    }
                };
                this.allowCall = false;
            }
        },
        mounted() {
            this.$nextTick(() => {
                // {mediaSource: 'screen'}
                navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(stream => {
                    // console.log(stream);
                    // console.log(stream.getVideoTracks(), stream.getAudioTracks());
                    let video = document.querySelector('#rtcA');
                    video.srcObject = stream;
                    this.localstream = stream;
                    this.initPeer();
                })
            });
        }
    };
</script>

<style lang="scss">
    .rtcBox{
        display: flex;
        justify-content: center;
        video{
            width: 400px;
            height: 300px;
            margin-left: 20px;
            background-color: #ddd;
        }
    }
</style>
