<template>
    <div class="room">
        <video class="video-mine" autoplay controls></video>
    </div>
</template>

<script>
    export default {
        name: 'home',
        data() {
            return {
                roomid: ''
            }
        },
        methods: {

        }
    };
</script>

<style lang="scss">
    .room{
        padding: 30px;
    }
    .video-mine{
        width:800px;
        height: 500px;
    }
</style>
