<template>
    <div class="communication">
        <div class="container-l">
            <p>我是 communication</p>
            <input type="text" v-model="dataProps.title" ref="input">
        </div>
        <div class="container-r">
            <communication-sub v-bind="dataProps"
                               class="input"
                               type="text"
                               placeholder="请输入内容" @focus="onFocus"
            ></communication-sub>
            <!--@click="onCommunicationClick"-->
        </div>
    </div>
</template>
<script>
    import communicationSub from './communication-sub.vue';
    export default{
        name: 'communication',
        data() {
            return {
                dataProps: {
                    title: '我是 communication 的值',
                }
            }
        },
        provide: function () {
            return {
                onCommunicationClick: this.onCommunicationClick
            }
        },
        components: {
            communicationSub
        },
        methods: {
            onCommunicationClick() {
                this.dataProps.title = '我是点击之后的值';
            },
            onFocus() {
                console.log('onFocus');
            }
        },
        beforeDestroy() {
            this.$bus.$off('busClick');
            this.$off('onMessage');
        },
        mounted() {
//            this.$nextTick(_ => {
//               console.log(this.$children);
//            });
            this.$bus.$on('busClick', (data) => {
                this.dataProps.title = data;
            });
            this.$on('onMessage', (data) => {
                this.dataProps.title = data;
            })
        }
    }
</script>
<style lang="scss" scoped>
    .communication{
        width:100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        padding: 20px;
        box-sizing: border-box;
        .container-l{
            width:30%;
        }
        .container-r{
            width:70%;
        }
    }
</style>