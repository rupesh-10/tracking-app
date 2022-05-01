<template>
  <div class="menu-card">
    <div class="card-report" >
            <b-dropdown size="lg"  variant="link" toggle-class="text-decoration-none" no-caret>
            <template #button-content>
                <img src="../../assets/images/avatar.png" alt="image jeremy">
            </template>
            <!-- <b-dropdown-item href="#">Settings</b-dropdown-item>
            <b-dropdown-item href="#">About</b-dropdown-item> -->
            <b-dropdown-item @click="logout" href="#">Logout</b-dropdown-item>
            <b-dropdown-item>
              <router-link to="/setting" style="text-decoration:none; color:black;">Setting</router-link>
            </b-dropdown-item>
        </b-dropdown>
        <div class="report">
            <div class="name">{{ userData.name }}</div>
            <h4>Developer</h4>
        </div>
    </div>

    <div class="menu" v-if="project && navbarHidden">
        <span class="menu-link"  @click="openTimerOffModal"><i class="fa-solid fa-chevron-left mr-2"></i>{{project ?  project.name : '' }}</span>
        <h5>{{ project ? project.company.name : '' }}</h5>
    </div>
    <timer-off-modal :toggle="toggleModal" @yes="modalAnswerYes" @no="modalAnswerNo"></timer-off-modal>
  </div>
</template>
<script>
import useApollo from '../../graphql/useApollo'
import useJwt from '../../auth/jwt/useJwt'
import TimerOffModal from '../common/TimerOffModal.vue'
export default{
  data(){
    return{
      toggleModal: false,
      modalFor:null,
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
      project(){
        return this.$store.state.timer.project
      },
      navbarHidden(){
        return this.$route.name!=='projects'
      },
       hours: {
      get() {
        return this.$store.state.timer?.hours;
      },
      set(value) {
        this.$store.commit("timer/SET_HOURS", value);
      },
    },
    minutes: {
      get() {
        return this.$store.state.timer.minutes;
      },
      set(value) {
        this.$store.commit("timer/SET_MINUTES", value);
      },
    },
    seconds: {
      get() {
        return this.$store.state.timer.seconds;
      },
      set(value) {
        this.$store.commit("timer/SET_SECONDS", value);
      },
    },
   timerInterval:{
      get(){
        return this.$store.state.timer.timerInterval
      },
      set(value){
        this.$store.commit("timer/SET_TIMER_INTERVAL",value)
      }
    }

 },
 methods: {
    logout() {
      if(this.trackingOn) {
        this.toggleModal = true
        this.modalFor = 'logout'
        return
      }
      useApollo.auth.logout().finally(() => {
        this.emptyLocalStorageAndRedirectToLogin()
        this.$store.commit('auth/SET_LOGGED_IN',false)
      })
    },
    emptyLocalStorageAndRedirectToLogin() {
      localStorage.removeItem(useJwt.jwtConfig.storageTokenKeyName)
      localStorage.removeItem('userData')
      localStorage.removeItem('selectedProject')
      localStorage.removeItem('latestCapturedImage')
      localStorage.removeItem('appAndWebsiteUsed')
      this.$router.push({ name: 'login' })
    },

     resetTime(){
        this.hours = 0
        this.minutes = 0
        this.seconds = 0
    },

    openTimerOffModal(){
      if(this.trackingOn){
       this.toggleModal = true
       this.modalFor = 'project'
      }
      else this.$router.replace({ name: 'projects' })
    },

    modalAnswerNo(){
      this.toggleModal = false,
      this.modalFor=null
    },

    modalAnswerYes(){
      this.trackingOn = false
      this.timerInterval = true
      this.toggleModal = false
       this.$store.dispatch('timer/dispatchAppAndWebsiteUsed',true).then(()=>{
        this.$store.dispatch('timer/endActivity').then(()=>{
           if(this.modalFor=='project') this.$router.replace({ name: 'projects' })
            else if(this.modalFor=='logout') this.logout()
              this.timerInterval = false
              this.resetTime()
        })
      })
    
    }

  },

}
</script>