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
    background-color: #1fbeca;
    border: none;
    font-size: 18px;
    padding: 4px 18px;
    color: #fff;
    border-radius: 3px;
    cursor: pointer;
    margin: 5px;
  }
  button:active{
    background-color: #3bffe1;
  }
  button:disabled{
    background-color: #d5d5d5;
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
