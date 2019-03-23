<template>
    <div class="communication">
        <div class="container-l">
            <input type="text" v-model="dataProps.title">
        </div>
        <div class="container-r">
            <communication-sub v-bind="dataProps" class="one" type="div"></communication-sub>
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
                    title: '我是父组件的值',
                }
            }
        },
        components: {
            communicationSub
        },
        methods: {

        },
        mounted() {

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