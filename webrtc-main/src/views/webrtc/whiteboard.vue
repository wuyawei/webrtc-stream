<template>
    <div class="demo">
        <div class="rtcBox">
            <ul>
                <li v-for="v in handleList" :key="v.type">
                    <el-color-picker v-model="color" show-alpha v-if="v.type === 'color'" @change="colorChange"></el-color-picker>
                    <button :disabled="allowHangup" @click="handleClick(v)" v-if="!['color', 'lineWidth'].includes(v.type)" :class="{active: currHandle === v.type}">{{v.name}}</button>
                    <el-popover
                            placement="top"
                            width="400"
                            trigger="click"
                            v-if="v.type === 'lineWidth'"
                    >
                        <el-slider v-model="lineWidth" :max=20 @change="lineWidthChange"></el-slider>
                        <button slot="reference" :disabled="allowHangup">{{v.name}}</button>
                    </el-popover>
                </li>
            </ul>
            <div>
                <canvas width="400" height="300" ref="canvas"></canvas>
                <h5>白板操作</h5>
            </div>
            <div>
                <video src="" id="rtcB" playsinline autoplay></video>
                <h5>演示画面</h5>
                <button @click="call" :disabled="allowCall">call</button>
                <button @click="hangup" :disabled="allowHangup">hangup</button>
            </div>
        </div>

    </div>
</template>

<script>
    import {Palette} from '../../utils/palette';
    export default {
        name: 'whiteboard',
        data() {
            return {
                peerA: null,
                peerB: null,
                offerOption: {
                    offerToReceiveAudio: 1,
                    offerToReceiveVideo: 1
                },
                allowCall: true,
                allowHangup: true,
                handleList: [
                    {name: '圆', type: 'arc'},
                    {name: '线条', type: 'line'},
                    {name: '矩形', type: 'rect'},
                    {name: '多边形', type: 'poly'},
                    {name: '橡皮擦', type: 'eraser'},
                    {name: '撤回', type: 'cancel'},
                    {name: '前进', type: 'go'},
                    {name: '线宽', type: 'lineWidth'},
                    {name: '颜色', type: 'color'}
                ],
                color: 'rgba(19, 206, 102, 1)',
                currHandle: 'line',
                lineWidth: 10
            }
        },
        methods: {
            colorChange() {
                this.palette.changeWay(this.currHandle, this.color, this.lineWidth);
            },
            lineWidthChange() {
                this.palette.changeWay(this.currHandle, this.color, this.lineWidth);
            },
            handleClick(v) {
                this.palette.changeWay(v.type, this.color, this.lineWidth);
                if (['color', 'cancel', 'go', 'lineWidth'].includes(v.type)) return;
                this.currHandle = v.type;
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
                this.peerA = null;
                this.peerB = null;
                this.allowCall = false;
                this.allowHangup = true;
                let paint = this.$refs['canvas'].getContext('2d');
                paint.clearRect(0, 0, this.$refs['canvas'].width, this.$refs['canvas'].height);
            },
            initCanvas() {
                let paint = this.$refs['canvas'].getContext('2d');
                paint.fillStyle = '#fff';
                paint.fillRect(0, 0, this.$refs['canvas'].width, this.$refs['canvas'].height);
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
                // 创建呼叫端
                this.peerB = new PeerConnection();
                this.peerB.onaddstream = (event) => { // 监听是否有媒体流接入，如果有就赋值给 rtcB 的 src
                    console.log('event-stream', event.stream);
                    let video = document.querySelector('#rtcB');
                    video.srcObject = event.stream;
                    this.initCanvas();
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
                this.localstream = this.$refs['canvas'].captureStream();
                this.initPeer(); // 获取到媒体流后，调用函数初始化 RTCPeerConnection
                this.palette = new Palette(this.$refs['canvas']);
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

<style lang="scss" scoped>
    .rtcBox{
        display: flex;
        justify-content: center;
        video{
            width: 400px;
            height: 300px;
            margin-left: 20px;
            background-color: #ddd;
            border: 1px solid #000;
        }
        canvas{
            border: 1px solid #000;
        }
        ul{
            text-align: left;
        }
    }
</style>
