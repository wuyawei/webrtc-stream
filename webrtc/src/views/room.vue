<template>
    <div class="room">
        <div class="video-box">
            <video class="video-mine" autoplay controls></video>
        </div>
    </div>
</template>

<script>
    import socket from '../socket';
    export default {
        name: 'home',
        data() {
            return {
                roomid: ''
            }
        },
        methods: {
            init() {
                let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
                getUserMedia.call(navigator, {
                    video: true,
                    audio: true
                }, function(localMediaStream) {
                    let video = document.getElementById('video');
                    video.srcObject = localMediaStream;
                    video.onloadedmetadata = function(e) {
                        console.log("e: " + e);
                        console.log("Label: " + localMediaStream.label);
                        console.log("AudioTracks" , localMediaStream.getAudioTracks());
                        console.log("VideoTracks" , localMediaStream.getVideoTracks());
                    };
                }, function(e) {
                    console.log('Reeeejected!', e);
                });
            }
        },
        mounted() {
            socket.emit('random', Math.random());
            socket.on('warn', count=>{
                console.log('warning count : '+count);
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
        .video-mine{
            width:600px;
            height: 400px;
        }
    }
</style>
