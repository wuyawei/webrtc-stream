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
                pper: null,
                peer1: null,
                candidate: null
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
//                this.peer1 = new PeerConnection(iceServer);
                //发送ICE候选到其他客户端
                //如果检测到媒体流连接到本地，将其绑定到一个video标签上输出
                this.pper.onaddstream = function(event){
                    console.log('event-stream', event);
                    if (otherVideo) {
                        otherVideo.srcObject = event.stream;
                    }
                };
                this.pper.onicecandidate = (event) => {
                    if (event.candidate) {
                        this.candidate = event.candidate;
                    }
                };
//                this.peer1.onaddstream = function(event){
//                    console.log('event-stream', event);
//                    otherVideo.srcObject = event.stream;
//                };
                //获取本地的媒体流，并绑定到一个video标签上输出，并且发送这个媒体流给其他客户端
                return new Promise((resolve, reject) => {
                    getUserMedia.call(navigator, {
                        "audio": true,
                        "video": true
                    }, (stream) => {
                        //绑定本地媒体流到video标签用于输出
                        myVideo.srcObject = stream;
                        //向PeerConnection中加入需要发送的流
                        this.pper.addStream(stream);
                        resolve();
                    }, function(error){
                        reject(error);
                        console.log(error);
                        //处理媒体流创建失败错误
                    });
                })
            },
            sendOfferFn(desc) {
                console.log('send-offer', desc);
                this.pper.setLocalDescription(desc, () => {
                    socket.emit('offer', {'sdp': this.pper.localDescription, roomid: this.$route.params.roomid});
                });
            },
            sendAnswerFn(desc) {
                console.log('send-answer', desc);
                this.pper.setLocalDescription(desc, () => {
                    socket.emit('answer', {'sdp': this.pper.localDescription, roomid: this.$route.params.roomid});
                });
            },
            socketInit() {
//                this.pper.onicecandidate = (event) => {
//                    socket.emit('__ice_candidate', {'candidate': event.candidate, roomid: this.$route.params.roomid});
////                    this.peer1.addIceCandidate(event.candidate).catch(e => console.log('err', e));
//                };
//                this.peer1.onicecandidate = (event) => {
////                    this.pper.addIceCandidate(event.candidate).catch(e => console.log('err', e));
//                    socket.emit('__ice_candidatepeer', {'candidate': event.candidate, roomid: this.$route.params.roomid});
//                };
                //发送offer和answer的函数，发送本地session描述
                this.pper.createOffer({
                    offerToReceiveAudio: 1,
                    offerToReceiveVideo: 1
                }).then(this.sendOfferFn);
                //////////////
//                console.log('createOffer');
//                this.pper.createOffer({
//                    offerToReceiveAudio: 1,
//                    offerToReceiveVideo: 1
//                }).then((desc) => {
//                    this.pper.setLocalDescription(desc, () => {
//                        this.peer1.setRemoteDescription(desc, () => {
//                            this.peer1.createAnswer().then((desc1) => {
//                                this.peer1.setLocalDescription(desc1, () => {
//                                    this.pper.setRemoteDescription(desc1, function(){}, (err) => {console.log(err)});
//                                });
//                            });
//                        }, (err) => {console.log(err)});
//                    });
//                });
                ///////////////
            }
        },
        mounted() {
            this.$nextTick(() => {
                socket.emit('join', {roomid: this.$route.params.roomid, account: this.$route.params.account});
                socket.on('offer', sdp => {
                    console.log('take_offer', sdp);
                    this.pper.setRemoteDescription(sdp, () => {
                        this.pper.createAnswer().then(this.sendAnswerFn);
                    }, (err) => {console.log(err)});
                });
                socket.on('answer', sdp => {
                    console.log('take_answer', sdp);
                    this.pper.setRemoteDescription(sdp, function(){}, (err) => {console.log(err)});
                });
                socket.on('__ice_candidate', candidate => {
                    console.log('take_candidate', candidate);
                    //如果是一个ICE的候选，则将其加入到PeerConnection中
                    if (candidate) {
                        this.pper.addIceCandidate(candidate).catch(e => console.log('err', e));
                    }
                });
                socket.on('__ice_candidatepeer', candidate => {
                    console.log('take_candidate', candidate);
                    //如果是一个ICE的候选，则将其加入到PeerConnection中
                    if (candidate) {
                        this.peer1.addIceCandidate(candidate).catch(e => console.log('err', e));
                    }
                });
                socket.on('joined', data=>{
                    console.log('joined', data);
                    this.init().then(() => {
                        socket.emit('__ice_candidate', {'candidate': this.candidate, roomid: this.$route.params.roomid});
                        if (this.$route.params.account === 'aaa') {
                            this.socketInit();
                        }
                    });
//                    if (data.length > 1) {
//                        this.init().then(() => {
//                            this.socketInit();
//                        });
//                    }
                });
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
