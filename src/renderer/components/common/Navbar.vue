<template>
  <div class="menu-card">
    <div class="card-report" >
            <b-dropdown size="lg"  variant="link" toggle-class="text-decoration-none" no-caret>
            <template #button-content>
                <img src="../../assets/images/avatar.png" alt="image jeremy">
            </template>
            <b-dropdown-item href="#">Settings</b-dropdown-item>
            <b-dropdown-item href="#">About</b-dropdown-item>
            <b-dropdown-item @click="logout" href="#">Logout</b-dropdown-item>
        </b-dropdown>
        <div class="report">
            <div class="name">{{ userData.name }}</div>
            <h4>Vue Developer</h4>
        </div>
    </div>

    <div class="menu">
      <!-- <div class="col-md-2">
        <a  href="#" class="fa-solid fa-chevron-left menu-link" @click="redirectToProject"></a>
      </div> -->
      <!-- <div class="col-md-10"> -->
        <span class="menu-link"  @click="openTimerOffModal"><i class="fa-solid fa-chevron-left mr-2"></i>{{project ?  project.name : '' }}</span>
        <h5>{{ project ? project.company.name : '' }}</h5>
      <!-- </div> -->
    </div>
    <timer-off-modal :toggle="toggleModal" @yes="redirectToProject" @no="toggleModal=false"></timer-off-modal>
  </div>
</template>
<script>
import useApollo from '../../graphql/useApollo'
import useJwt from '../../auth/jwt/useJwt'
import TimerOffModal from '../common/TimerOffModal.vue'
export default{
  data(){
    return{
      toggleModal: false
    }
  },
  components:{
    TimerOffModal
  },
 props:{
     userData:{
         type:[Array,Object],
         default:()=>{}
     },
       project:{
         type:[Array,Object],
         default:()=>{}
     }
 },
 computed:{
     trackingOn: {
        get() {
            return this.$store.state.timer.trackingOn;
        },
        set(value) {
            return this.$store.commit("timer/SET_TRACKING_ON", value);
        },
      },
 },
 methods: {
    logout() {
      useApollo.auth.logout().finally(() => {
        this.emptyLocalStorageAndRedirectToLogin()
        this.$store.commit('auth/SET_LOGGED_IN',false)
      })
    },
    emptyLocalStorageAndRedirectToLogin() {
      localStorage.removeItem(useJwt.jwtConfig.storageTokenKeyName)
      localStorage.removeItem('userData')
      this.$router.push({ name: 'login' })
    },

    openTimerOffModal(){
      if(this.trackingOn) this.toggleModal = true
      else this.$router.replace({ name: 'projects' })
    },

    redirectToProject(){
      this.$store.dispatch('timer/endActivity')
      this.trackingOn = false
      this.$router.replace({ name: 'projects' })
    }

  },

}
</script>