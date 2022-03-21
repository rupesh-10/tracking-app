<template>
  <div id="app" class="container">
      <!-- <router-link to="/">TImer</router-link>
      <router-link to="/screencaptured">Latest Image</router-link> -->
      <navbar v-if="loggedIn && navbarHidden && project" :user-data="userData" :project="project"></navbar>
      <router-view></router-view>
      </div>
</template>

<script>
import Navbar from './components/common/Navbar.vue'


export default {
  name: "App",
  components: {
    Navbar,
  },
  // mounted() {
  //   this.$router.push('/')
  // },
  computed: {
      online: {
        get() {
          return this.$store.state.timer.online;
        },
        set(value) {
          this.$store.commit("timer/SET_ONLINE", value);
        },
      },
       userData(){
        return this.$store.state.auth.userData
      },
       project(){
        return this.$store.state.auth.project
      },
      navbarHidden(){
        return this.$route.name!=='projects'
      },
      loggedIn(){
        return this.$store.state.auth.loggedIn
      }
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
  // align-items: center;
  display: flex;
  padding: 5px; 
  min-height:500px;
}
@import 'assets/scss/style.scss'
</style>
