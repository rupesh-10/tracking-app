<template>
  <div id="app">
   <div>
    <img alt="Vue logo" src="./assets/logo.png" width="100" height="100">
    <timer/>
     <span v-if="!online" style="color:red;">Connection Lost !!!</span>
    </div>
  </div>
</template>

<script>
import Timer from './components/TimerComponent.vue'

export default {
  name: 'App',
  components: {
    Timer
  },
  computed:{
     online:{
            get(){
                return this.$store.state.timer.online
            },
            set(value){
                this.$store.commit("timer/SET_ONLINE",value)
            }
        },
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
