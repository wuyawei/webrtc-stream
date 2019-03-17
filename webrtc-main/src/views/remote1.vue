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
            <p v-for="v in userList">
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
                <video src="" id="rtcA" controls autoplay></video>
                <h5>{{account}}</h5>
            </div>
            <div>
                <video src="" id="rtcB" controls autoplay></video>
                <h5>{{isCall}}</h5>
            </div>
        </div>
    </div>
</template>
<script>
    import socket from '../socket';
    export default{
        name: 'remote1',
        data() {
            return {
                account: window.sessionStorage.account || '',
                isJoin: false,
                userList: [],
                roomid: 'webrtc_1v1',
                isCall: false,
                loading: false,
                loadingText: '呼叫中'
            };
        },
        methods: {
            join() {
                if (!this.account) return;
                this.isJoin = true;
                window.sessionStorage.account = this.account;
                socket.emit('join', {roomid: this.roomid, account: this.account});
            },
            init() {
                socket.on('joined', (data) =>{
                    this.userList = data;
                });
                socket.on('reply', data =>{ // 收到回复
                    this.loading = false;
                    switch (data.type) {
                        case '1': // 同意
                            this.isCall = data.self;
                            this.$message({
                                message: '对方同意了！',
                                type: 'warning'
                            });
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
                socket.on('apply', data =>{ // 收到请求
                    console.log(this.isCall);
                    if (this.isCall) {
                        this.reply(data.self, '3');
                        return;
                    }
                    console.log('onapply', data);
                    this.$confirm(data.self + ' 向你请求视频通话, 是否同意?', '提示', {
                        confirmButtonText: '同意',
                        cancelButtonText: '拒绝',
                        type: 'warning'
                    }).then(() => {
                        this.isCall = data.self;
                        this.reply(data.self, '1');
                    }).catch(() => {
                        this.reply(data.self, '2');
                    });
                });
            },
            apply(account) {
                // account 对方account self 是自己的account
                this.loading = true;
                socket.emit('apply', {account: account, self: this.account});
            },
            reply(account, type) {
                socket.emit('reply', {account: account, self: this.account, type: type});
            }
        },
        mounted() {
            this.init();
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
        video{
            width: 400px;
            height: 300px;
            margin-left: 20px;
            background-color: #ddd;
        }
    }
</style>