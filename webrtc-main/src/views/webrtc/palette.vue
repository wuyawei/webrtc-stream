<template>
    <div class="remote1"
         v-loading="loading"
         :element-loading-text="loadingText"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0.8)"
    >
        <div class="shade" v-if="!isJoin">
            <div class="input-container">
                <input type="text" v-model="account" placeholder="请输入你的昵称" @keyup.enter="join">
                <button @click="join">确定</button>
            </div>
        </div>
        <div class="userList">
            <h5>在线用户：{{userList.length}}</h5>
            <p v-for="v in userList" :key="v.account">
                {{v.account}}
                <i v-if="v.account === account || v.account === isCall">
                {{v.account === account ? 'me' : ''}}
                {{v.account === isCall ? 'calling' : ''}}
                </i>
                <span @click="apply(v.account)" v-if="v.account !== account && v.account !== isCall">呼叫 {{v.account}}</span>
            </p>
        </div>
        <div class="video-container">
            <div>
                <ul>
                    <li v-for="v in handleList" :key="v.type">
                        <el-color-picker v-model="color" show-alpha v-if="v.type === 'color'" @change="colorChange" :disabled="!isToPeer"></el-color-picker>
                        <button :disabled="v.type === 'cancel' ? !isToPeer || allowCancel:
                            v.type === 'go' ? !isToPeer || allowGo
                            :!isToPeer"
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
                            <button slot="reference" :disabled="!isToPeer" @click="handleClick(v)" :class="{active: currHandle === v.type}">{{v.name}}</button>
                        </el-popover>
                        <el-popover
                                placement="top"
                                width="400"
                                trigger="click"
                                v-if="v.type === 'lineWidth'"
                        >
                            <el-slider v-model="lineWidth" :max=20 @change="lineWidthChange"></el-slider>
                            <button slot="reference" :disabled="!isToPeer">{{v.name}} <i>{{lineWidth + 'px'}}</i></button>
                        </el-popover>
                    </li>
                </ul>
                <div>
                    <h5>画板</h5>
                    <canvas width="400" height="300" ref="canvas"></canvas>
                </div>
            </div>
            <div>
                <h5>聊天</h5>
                <div class="chat"></div>
                <textarea></textarea> <br>
                <button :disabled="!isToPeer">发送</button>
            </div>
        </div>
    </div>
</template>
<script>
    import socket from '../../utils/socket';
    import {Palette} from '../../utils/palette';
    export default{
        name: 'palette',
        data() {
            return {
                account: window.sessionStorage.account || '',
                isJoin: false,
                userList: [],
                roomid: 'palette', // 指定房间ID
                isCall: false, // 正在通话的对象
                loading: false,
                loadingText: '呼叫中',
                isToPeer: false, // 是否建立了 P2P 连接
                peer: null,
                offerOption: {
                    offerToReceiveAudio: 1,
                    offerToReceiveVideo: 1
                },
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
            };
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
            join() {
                if (!this.account) return;
                this.isJoin = true;
                window.sessionStorage.account = this.account;
                socket.emit('join', {roomid: this.roomid, account: this.account});
            },
            initSocket() {
                socket.on('joined', (data) =>{
                    this.userList = data;
                });
                socket.on('reply', async data =>{ // 收到回复
                    this.loading = false;
                    console.log(data);
                    switch (data.type) {
                        case '1': // 同意
                            this.isCall = data.self;
                            // 对方同意之后创建自己的 peer
                            await this.createP2P(data);
                            // 并给对方发送 offer
                            this.createOffer(data);
                            break;
                        case '2': //拒绝
                            this.$message({
                                message: '对方拒绝了你的请求！',
                                type: 'warning'
                            });
                            break;
                        case '3': // 正在通话中
                            this.$message({
                                message: '对方正在通话中！',
                                type: 'warning'
                            });
                            break;
                    }
                });
                socket.on('apply', data => { // 收到请求
                    if (this.isCall) {
                        this.reply(data.self, '3');
                        return;
                    }
                    this.$confirm(data.self + ' 向你请求视频通话, 是否同意?', '提示', {
                        confirmButtonText: '同意',
                        cancelButtonText: '拒绝',
                        type: 'warning'
                    }).then(async () => {
                        await this.createP2P(data); // 同意之后创建自己的 peer 等待对方的 offer
                        this.isCall = data.self;
                        this.reply(data.self, '1');
                    }).catch(() => {
                        this.reply(data.self, '2');
                    });
                });
                socket.on('1v1answer', (data) =>{ // 接收到 answer
                    this.onAnswer(data);
                });
                socket.on('1v1ICE', (data) =>{ // 接收到 ICE
                    this.onIce(data);
                });
                socket.on('1v1offer', (data) =>{ // 接收到 offer
                    this.onOffer(data);
                });
                socket.on('1v1hangup', _ =>{ // 通话挂断
                    this.$message({
                        message: '对方已断开连接！',
                        type: 'warning'
                    });
                    this.peer.close();
                    this.peer = null;
                    this.isToPeer = false;
                    this.isCall = false;
                });
            },
            hangup() { // 挂断通话
                socket.emit('1v1hangup', {account: this.isCall, self: this.account});
                this.peer.close();
                this.peer = null;
                this.isToPeer = false;
                this.isCall = false;
            },
            apply(account) {
                // account 对方account  self 是自己的account
                this.loading = true;
                this.loadingText = '呼叫中';
                socket.emit('apply', {account: account, self: this.account});
            },
            reply(account, type) {
                socket.emit('reply', {account: account, self: this.account, type: type});
            },
            async createP2P(data) {
                this.loading = true;
                this.loadingText = '正在建立通话连接';
                await this.createMedia(data);
            },
            async createMedia(data) {
                // 保存本地流到全局
                try {
//                    this.localstream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
//                    let video = document.querySelector('#rtcA');
//                    video.srcObject = this.localstream;
                } catch (e) {
                    console.log('getUserMedia: ', e)
                }
                this.initPeer(data); // 获取到媒体流后，调用函数初始化 RTCPeerConnection
            },
            initPeer(data) {
                // 创建输出端 PeerConnection
                let PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
                this.peer = new PeerConnection();
//                this.peer.addStream(this.localstream); // 添加本地流
                // 监听ICE候选信息 如果收集到，就发送给对方
                this.peer.onicecandidate = (event) => {
                    if (event.candidate) {
                        socket.emit('1v1ICE', {account: data.self, self: this.account, sdp: event.candidate});
                    }
                };
//                this.peer.onaddstream = (event) => { // 监听是否有媒体流接入，如果有就赋值给 rtcB 的 src
//                    this.isToPeer = true;
//                    this.loading = false;
//                    let video = document.querySelector('#rtcB');
//                    video.srcObject = event.stream;
//                };
            },
            async createOffer(data) { // 创建并发送 offer
                try {
                    // 创建offer
                    let offer = await this.peer.createOffer(this.offerOption);
                    // 呼叫端设置本地 offer 描述
                    await this.peer.setLocalDescription(offer);
                    // 给对方发送 offer
                    socket.emit('1v1offer', {account: data.self, self: this.account, sdp: offer});
                } catch (e) {
                    console.log('createOffer: ', e);
                }
            },
            async onOffer(data) { // 接收offer并发送 answer
                try {
                    // 接收端设置远程 offer 描述
                    await this.peer.setRemoteDescription(data.sdp);
                    // 接收端创建 answer
                    let answer = await this.peer.createAnswer();
                    // 接收端设置本地 answer 描述
                    await this.peer.setLocalDescription(answer);
                    // 给对方发送 answer
                    socket.emit('1v1answer', {account: data.self, self: this.account, sdp: answer});
                } catch (e) {
                    console.log('onOffer: ', e);
                }
            },
            async onAnswer(data) { // 接收answer
                try {
                    await this.peer.setRemoteDescription(data.sdp); // 呼叫端设置远程 answer 描述
                } catch (e) {
                    console.log('onAnswer: ', e);
                }
            },
            async onIce(data) { // 接收 ICE 候选
                try {
                    await this.peer.addIceCandidate(data.sdp); // 设置远程 ICE
                } catch (e) {
                    console.log('onAnswer: ', e);
                }
            }
        },
        mounted() {
            this.initSocket();
            if (this.account) {
                this.join();
            }
        }
    }
</script>
<style lang="scss" scoped>
    .remote1{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: flex-start;
    }
    .shade{
        position: fixed;
        width:100vw;
        height: 100vh;
        left: 0;
        top:0;
        z-index: 100;
        background-color: rgba(0,0,0,0.9);
        .input-container{
            position: absolute;
            left:50%;
            top:30%;
            transform: translate(-50%, 50%);
            display: flex;
            justify-content: space-between;
            align-items: center;
            input{
                margin: 0;
            }
        }
    }
    .userList{
        border: 1px solid #ddd;
        margin-right: 50px;
        h5{
            text-align: left;
            margin-bottom: 5px;
        }
        p{
            border-bottom: 1px solid #ddd;
            line-height: 32px;
            width:200px;
            position: relative;
            overflow: hidden;
            cursor: pointer;
            span{
                position: absolute;
                left:0;
                top:100%;
                background-color: #1fbeca;
                color: #fff;
                height: 100%;
                transition: top 0.2s;
                display: block;
                width: 100%;
            }
            i{
                font-style: normal;
                font-size: 11px;
                border: 1px solid #1fbeca;
                color: #27cac7;
                border-radius: 2px;
                line-height: 1;
                display: block;
                position: absolute;
                padding: 1px 2px;
                right: 5px;
                top: 5px;
            }
        }
        p:last-child{
            border-bottom: none;
        }
        p:hover span{
            top:0;
        }
    }
    .video-container{
        display: flex;
        justify-content: center;
        >div:first-child{
            display: flex;
            justify-content: flex-start;
            margin-right: 50px;
            canvas{
                border: 1px solid #000;
            }
            ul{
                text-align: left;
            }
        }
        >div:last-child{
            .chat{
                width:500px;
                height: 260px;
                border: 1px solid #000;
            }
            textarea{
                width:500px;
                height: 60px;
                resize: none;
            }
        }
    }
</style>