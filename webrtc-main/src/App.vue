<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
      data() {
          return {
              name: '111'
          }
      },
      mounted() {
          this.$bus.$on('busClick', _ => {
              console.log('app', this);
          });
      }
  }
</script>

<style lang="scss">
  @import "../static/css/base";
  button{
    background-color: #5ac6ca;
    border: 1px solid #5ac6ca;
    font-size: 16px;
    padding: 4px 16px;
    color: #fff;
    border-radius: 3px;
    cursor: pointer;
    margin: 5px;
  }
  button:active{
    background-color: #6ddcff;
  }
  button.active{
    border: 1px solid #5ac6ca;
    color: #5ac6ca;
    background-color: #fff;
  }
  button:disabled{
    background-color: #d5d5d5;
    color: #fff;
    border: 1px solid #d5d5d5;
  }
  input{
    border: 1px solid #1fbeca;
    border-radius: 3px;
    height: 32px;
    width: 300px;
    margin-bottom: 5px;
    padding-left: 10px;
  }
</style>
