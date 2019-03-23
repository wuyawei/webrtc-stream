<template>
    <div class="communication-sub">
        {{title}}
    </div>
</template>
<script>
    export default{
        name: 'communication-sub',
        props: {
            title: {
                type: String,
                required: true,
                default: ''
            }
        },
        data() {
            return {
            }
        },
        methods: {

        },
        mounted() {
        }
    }
</script>
<style>
    .communication-sub{

    }
</style>