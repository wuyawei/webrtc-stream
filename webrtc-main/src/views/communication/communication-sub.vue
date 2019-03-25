<template>
    <div class="communication-sub">
        <p>我是 communication-sub</p>
        <input v-bind="$attrs" v-model="title" v-on="$listeners">
        <communication-min-sub></communication-min-sub>
        <!--v-on="$listeners"-->
    </div>
</template>
<script>
    import communicationMinSub from './communication-min-sub.vue';
    export default{
        name: 'communication-sub',
        inheritAttrs: false,
        props: {
            title: {
                type: String,
                default: ''
            }
        },
        components: {
            communicationMinSub
        },
        data() {
            return {
            }
        },
        methods: {
        },
        mounted() {
            console.log('111', this.$listeners);
        }
    }
</script>
<style lang="scss" scoped>
    .communication-sub{
        padding: 20px;
        box-sizing: border-box;
        border: 1px solid #ddd;
        p{
            margin-bottom: 20px;
        }
    }
</style>