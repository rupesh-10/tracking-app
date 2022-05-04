<template>
       <div class="regular-card work p-3">
           <div class="login-card">
               <div class="login-info">
                   <img src="../../assets/logo.svg">
                   <h1>WORK ZONE 1</h1>
                   <p>
                       Please sign-in to your account
                   </p>
               </div>
        <!-- <Form
             ref="loginForm"
             v-slot="errors"
            > -->
                <b-form
                    class="auth-login-form mt-1"
                >
                <p class="text-danger" style="font-size:16px;" v-if="formError">{{ errorMessage }}</p>
                    <b-form-group
                    label="Email *"
                    label-for="login-email"
                    >
                    <!-- <Field
                        name="Email"
                        vid="email"
                        rules="required|email|max:256"
                    > -->
                    <b-form-input
                        id="login-email"
                        v-model="userEmail"
                        name="login-email"
                        class="pt-2"
                        type="email"
                        placeholder="john@example.com"
                        @keydown.space.prevent
                        />
                        <!-- <small class="text-danger">{{ errors[0] }}</small> -->
                    <!-- </Field> -->
                    </b-form-group>

                 <b-form-group
                    label="Password *"
                    class="pt-4"
                    label-for="login-password"
                    >
                    <!-- <Field
                        name="Password"
                        vid="password"
                        rules="required|max:256"
                    > -->
                    <b-input-group >
                    <b-form-input
                        id="login-password"
                        v-model="userPassword"
                        name="login-password"
                        @keydown.space.prevent
                        :type="passwordFieldType"
                    />
                 <b-input-group-append is-text @click="togglePasswordVisibility">
                     <span class="btn" style="cursor:pointer;">
                    <b-icon :icon="passwordToggleIcon" scale="1.5"></b-icon>
                     <!-- <i :class="`fa fa-${passwordToggleIcon}`" style="height" ></i> -->
                     </span>
                  </b-input-group-append>
                    </b-input-group>
                        <!-- <small class="text-danger">{{ errors[0] }}</small>
                    </Field> -->
                    </b-form-group>
                </b-form>

                <b-col md="12" class="text-center mt-4 pt-4">
                    <b-button variant="primary"   type="submit" @click="login" :disabled="isProcessing">
                        <b-spinner variant="" v-if="isProcessing">

                        </b-spinner>
                        Sign in
                    </b-button>
                </b-col>
            <!-- </Form> -->
           </div>
        </div> 
</template>
<script>
// import { Field, Form } from 'vee-validate'
import useApollo from '../../graphql/useApollo'
import useJwt from '../../auth/jwt/useJwt'
// import {showSuccessMessage, showErrorMessage} from '../../const/toast'

export default {
    // components:{
    //     Field,
    //     Form
    // },
    data(){
        return {
            userEmail:'',
            userPassword:'',
            formError:false,
            errorMessage:'',
            isProcessing:false,
            passwordFieldType:'password',

        }
    },
    computed:{
    passwordToggleIcon() {
        return this.passwordFieldType === 'password' ? 'eye' : 'eye-slash'
    },
    },
  methods:{
      login(){
          this.formError = false
          if(this.userEmail=='' || this.userPassword ==''){
              this.formError = true
              this.errorMessage = "Please fill all required fields"
              return 
          }
          if(!this.$store.state.timer.online){
              this.$toast.error(`Connection Lost !!!`)
              return 
          }
          this.isProcessing = true;
          useApollo.auth.login({username:this.userEmail, password:this.userPassword}).then(response=>{
                 const userData = response.data.login
                this.$store.commit('auth/SET_USER_DATA',userData.user)
                useJwt.setToken(userData.access_token)
                setTimeout(() => {
                    this.$router.replace({ name: 'projects' }).then(() => {
                    this.$toast.success(`Welcome ${userData.user.name}`)
                    this.$store.commit('auth/SET_LOGGED_IN',true)
                    
                })
                }, 500)
                }).catch(()=>{
                   this.$toast.error(`Invalid Credentials`)
                   this.formError = true
                   this.errorMessage = "Invalid Credentials"
                }
                ).finally(()=>{
                    this.isProcessing = false
                })
      },
      togglePasswordVisibility(){
          this.passwordFieldType = this.passwordFieldType==='password' ? 'text' : 'password'
      }
  }
}
</script>