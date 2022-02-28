<template>
  <div id="app">
    <div>
      <!-- <router-link to="/">TImer</router-link>
      <router-link to="/screencaptured">Latest Image</router-link> -->
      <!-- <navbar></navbar> -->
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
// import Navbar from './components/Navbar.vue'

export default {
  name: "App",
  components: {
    // Navbar,
  },
  mounted() {},
  computed: {
    online: {
      get() {
        return this.$store.state.timer.online;
      },
      set(value) {
        this.$store.commit("timer/SET_ONLINE", value);
      },
    },
  },
};
</script>

<style lang="scss">
#app {
    /* font-family: 'Rubik', sans-serif; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  max-width:380px;
  margin:0 !important;
  padding: 3px; 
}
@import 'assets/scss/style.scss'
</style>
