<template>
    <div class="communication-min-sub">
        <p>我是 communication-min-sub</p>
        <button @click="onCommunicationClick">click</button>
        <!--v-on="$listeners"-->
        <!--<button @click="emitClick">click $emit</button>-->
        <button @click="busClick">click bus</button>
        <button @click="handleDispatch">dispatch</button>
    </div>
</template>
<script>
    import Emitter from '../../utils/emitter';
    export default{
        name: 'communication-min-sub',
        inheritAttrs: false,
        mixins: [Emitter],
        data() {
            return {
            }
        },
        inject: ['onCommunicationClick'],
        methods: {
            emitClick() {
                this.$emit('emitClick', 'emit 触发了');
            },
            busClick() {
                this.$bus.$emit('busClick', 'bus 触发了');
            },
            handleDispatch () {
                this.dispatch('communication', 'onMessage', '触发了dispatch');
            }
        },
        mounted() {
//            console.log('2222', this.$parent.$options.name);
//            this.$on('emitClick', (...arr) => {
//                console.log(...arr);
//            })
        }
    }
</script>
<style lang="scss" scoped>
    .communication-min-sub{
        padding: 20px;
        box-sizing: border-box;
        border: 1px solid #ddd;
    }
</style>