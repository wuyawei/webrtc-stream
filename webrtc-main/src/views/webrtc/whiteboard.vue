<template>
    <div class="demo">
        <div class="rtcBox">
            <ul>
                <li v-for="v in handleList" :key="v.type">
                    <el-color-picker v-model="color" show-alpha v-if="v.type === 'color'" @change="colorChange" :disabled="allowHangup"></el-color-picker>
                    <button :disabled="v.type === 'cancel' ? allowHangup || allowCancel:
                            v.type === 'go' ? allowHangup || allowGo
                            :allowHangup"
                            @click="handleClick(v)"
                            v-if="!['color', 'lineWidth', 'polygon'].includes(v.type)"
                            :class="{active: currHandle === v.type}"
                    >
                        {{v.name}}
                    </button>
                    <el-popover
                            placement="top"
                            width="400"
                            trigger="click"
                            v-if="v.type === 'polygon'"
                    >
                        <el-input-number v-model="sides" controls-position="right" @change="sidesChange" :min="3" :max="10"></el-input-number>
                        <button slot="reference" :disabled="allowHangup" @click="handleClick(v)" :class="{active: currHandle === v.type}">{{v.name}}</button>
                    </el-popover>
                    <el-popover
                            placement="top"
                            width="400"
                            trigger="click"
                            v-if="v.type === 'lineWidth'"
                    >
                        <el-slider v-model="lineWidth" :max=20 @change="lineWidthChange"></el-slider>
                        <button slot="reference" :disabled="allowHangup">{{v.name}} <i>{{lineWidth + 'px'}}</i></button>
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
                    {name: '多边形', type: 'polygon'},
                    {name: '橡皮擦', type: 'eraser'},
                    {name: '撤回', type: 'cancel'},
                    {name: '前进', type: 'go'},
                    {name: '清屏', type: 'clear'},
                    {name: '线宽', type: 'lineWidth'},
                    {name: '颜色', type: 'color'}
                ],
                color: 'rgba(19, 206, 102, 1)',
                currHandle: 'line',
                lineWidth: 5,
                palette: null, // 画板
                allowCancel: true,
                allowGo: true,
                sides: 3
            }
        },
        methods: {
            initPalette() {
                this.palette = new Palette(this.$refs['canvas'], {
                    drawColor: this.color,
                    drawType: this.currHandle,
                    lineWidth: this.lineWidth,
                    allowCallback: this.allowCallback
                });
            },
            allowCallback(cancel, go) {
                this.allowCancel = !cancel;
                this.allowGo = !go;
            },
            sidesChange() {
                this.palette.changeWay({sides: this.sides});
            },
            colorChange() {
                this.palette.changeWay({color: this.color});
            },
            lineWidthChange() {
                this.palette.changeWay({lineWidth: this.lineWidth});
            },
            handleClick(v) {
                if (['cancel', 'go', 'clear'].includes(v.type)) {
                    this.palette[v.type]();
                    return;
                }
                this.palette.changeWay({type: v.type});
                if (['color', 'lineWidth'].includes(v.type)) return;
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
                this.palette.destroy();
                this.palette = null;
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
//                    console.log('event-stream', event.stream);
                    let video = document.querySelector('#rtcB');
                    video.srcObject = event.stream;
                    this.initPalette(); // 初始化画板
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
