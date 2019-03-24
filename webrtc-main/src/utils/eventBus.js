import Vue from 'vue';
const bus = new Vue({
    data () {
        return {
            userInfo: {}
        }
    },
    created () {
        this.$on('getUserInfo', val => {
            this.userInfo = val;
        })
    }
});
export default bus;