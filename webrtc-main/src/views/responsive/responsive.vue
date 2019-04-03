<template>
    <div>
        <ul>
            <li v-for="(v, i) in list" :key="i">{{v.name}}</li>
        </ul>
    </div>
</template>
<script>
    export default{
        name: 'responsive',
        data() {
            return {
                list: []
            }
        },
        mounted() {
            setTimeout(_ => {
                this.list = [{name: 666}, {name: 666}, {name: 666}];
            },1000);
            setTimeout(_ => {
                this.list.forEach((v, i) => {
                    v.name = i;
                });
                console.log(this.list);
            },2000)
        }
    }
</script>
<style lang="scss">

</style>