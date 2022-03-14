<template>
       <div class="regular-card work p-3">
           <div class="login-card">
               <div class="login-info">
                   <img src="../../assets/images/avatar.png">
                   <h1>GEC TRACKER</h1>
                   <p>
                       Please sign-in to your account
                   </p>
               </div>
        <!-- <validation-observer
             ref="loginForm"
            > -->
                <b-form
                    class="auth-login-form mt-1"
                    @submit.prevent="login"
                >
                <p class="text-danger" style="font-size:16px;" v-if="wrongCredentials">Wrong Credentials!!!</p>
                    <b-form-group
                    label="Email"
                    label-for="login-email"
                    >
                    <!-- <validation-provider
                        #default="{ errors }"
                        name="Email"
                        vid="email"
                        rules="required|email|max:256"
                    > -->
                    <b-form-input
                        id="login-email"
                        v-model="userEmail"
                        name="login-email"
                        class="pt-2"
                        placeholder="john@example.com"
                        @keydown.space.prevent
                        />
                        <!-- <small class="text-danger">{{ errors[0] }}</small> -->
                    <!-- </validation-provider> -->
                    </b-form-group>

                 <b-form-group
                    label="Password"
                    class="pt-4"
                    label-for="login-password"
                    >
                    <!-- <validation-provider
                        #default="{ errors }"
                        name="Email"
                        vid="email"
                        rules="required|email|max:256"
                    > -->
                    <b-form-input
                        id="login-password"
                        v-model="userPassword"
                        name="login-password"
                        @keydown.space.prevent
                        type="password"
                        />
                        <!-- <small class="text-danger">{{ errors[0] }}</small> -->
                    <!-- </validation-provider> -->
                    </b-form-group>
                </b-form>

                <b-col md="12" class="text-center mt-4 pt-4">
                    <b-button variant="primary"   type="submit" @click="login">
                        Sign in
                    </b-button>
                </b-col>
            <!-- </validation-observer> -->
           </div>
        </div> 
</template>
<script>
export default {
    data(){
        return {
            userEmail:'',
            userPassword:'',
            wrongCredentials:false,
        }
    },
  methods:{
      login(){
          if(this.userEmail==='test' && this.userPassword==='test'){
            localStorage.setItem('userData', JSON.stringify('testUser'))
             this.wrongCredentials = false
            return this.$router.push({ name: "home"})
          }
          else{
              this.wrongCredentials = true
          }
      }
  }
}
</script>
