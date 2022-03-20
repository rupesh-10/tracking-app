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
        <h2>Vue Developer For Large Project...</h2>
        <h5>Jeff Rogers</h5>
      <!-- </div> -->
    </div>
        </div>
</template>
<script>
import useApollo from '../../graphql/useApollo'
import useJwt from '../../auth/jwt/useJwt'
export default{
 props:{
     userData:{
         type:[Array,Object],
         default:()=>{}
     }
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

    redirectToProject(){
      alert('hello')
     this.$router.replace({ name: 'projects' })
    }

  },

}
</script>