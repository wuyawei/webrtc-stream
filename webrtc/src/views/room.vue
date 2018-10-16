<template>
    <div class="room">
        <div class="video-box">
            <video class="video-mine" autoplay controls ref="video-mine"></video>
            <video class="video-other" autoplay controls ref="video-other"></video>
        </div>
    </div>
</template>

<script>
    import socket from '../socket';
    export default {
        name: 'home',
        data() {
            return {
                roomid: '',
                peer: null
            }
        },
        methods: {
            init() {
                let myVideo = this.$refs['video-mine'];
                let otherVideo = this.$refs['video-other'];
                let iceServer = {
                    "iceServers": [{
                        "url": "stun:stun.l.google.com:19302"
                    }]
                };
                //兼容浏览器的getUserMedia写法
                let getUserMedia = (navigator.getUserMedia ||
                    navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia ||
                    navigator.msGetUserMedia);
                //兼容浏览器的PeerConnection写法
                let PeerConnection = (window.PeerConnection ||
                    window.webkitPeerConnection00 ||
                    window.webkitRTCPeerConnection ||
                    window.mozRTCPeerConnection);
                //
                this.pper = new PeerConnection(iceServer);
                //发送ICE候选到其他客户端
                this.pper.onicecandidate = (event) => {
                    console.log('event-candidate', event);
                    socket.emit('__ice_candidate', {'candidate': event.candidate, roomid: this.$route.params.roomid});
                };
                //如果检测到媒体流连接到本地，将其绑定到一个video标签上输出
                this.pper.onaddstream = function(event){
                    console.log('event-stream', event);
                    otherVideo.srcObject = event.stream;
                };
                //获取本地的媒体流，并绑定到一个video标签上输出，并且发送这个媒体流给其他客户端
                getUserMedia.call(navigator, {
                    "audio": true,
                    "video": true
                }, (stream) => {
                    //绑定本地媒体流到video标签用于输出
                    myVideo.srcObject = stream;
                    //向PeerConnection中加入需要发送的流
                    this.pper.addStream(stream);
                }, function(error){
                    console.log(error);
                    //处理媒体流创建失败错误
                });
                this.socketInit();
            },
            socketInit() {
                //发送offer和answer的函数，发送本地session描述
                let sendOfferFn = (desc) => {
                        console.log('offer', desc);
                        this.pper.setLocalDescription(desc);
                        socket.emit('offer', {'sdp': desc, roomid: this.$route.params.roomid});
                    },
                    sendAnswerFn = (desc) => {
                        this.pper.setLocalDescription(desc);
                        socket.send('answer', {'sdp': desc, roomid: this.$route.params.roomid});
                    };
                this.pper.onnegotiationneeded = () => {
                    console.log('pper', this.pper);
                    this.pper.createOffer(sendOfferFn);
                };
                socket.on('offer', sdp => {
                    console.log('offer', sdp);
                    this.pper.setRemoteDescription(new RTCSessionDescription(sdp), function(){}, (err) => {console.log(err)});
                    this.pper.createAnswer(sendAnswerFn);
                });
                socket.on('answer', sdp => {
                    console.log('answer', sdp);
                    this.pper.setRemoteDescription(new RTCSessionDescription(sdp), function(){}, (err) => {console.log(err)});
                });
                socket.on('__ice_candidate', candidate => {
                    console.log('__ice_candidate', candidate);
                    //如果是一个ICE的候选，则将其加入到PeerConnection中，否则设定对方的session描述为传递过来的描述
                    this.pper.addIceCandidate(new RTCIceCandidate(candidate));
                });
            }
        },
        mounted() {
            socket.emit('join', {roomid: this.$route.params.roomid, account: this.$route.params.account});
            socket.on('joined', account=>{
                console.log('joined', account);
            });
            socket.on('en', ok=>{
                console.log('en', ok);
                this.init();
            });
        }
    };
</script>

<style lang="scss">
    .room{
        padding: 30px;
    }
    .video-box{
        display: flex;
        justify-content: flex-start;
        video{
            width:600px;
            height: 400px;
        }
    }
</style>
