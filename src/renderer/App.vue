<template>
  <div id="app">
    <div>
      <!-- <router-link to="/">TImer</router-link>
      <router-link to="/screencaptured">Latest Image</router-link> -->
      <!-- <navbar></navbar> -->
      <hr />
      <img alt="Vue logo" src="./assets/logo.png" width="60" height="60" />
      <router-view></router-view>
      <span v-if="!online" style="color: red">
        <b-icon icon="exclamation-triangle"> </b-icon>
        Connection Lost !!!
      </span>
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

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
}
</style>
