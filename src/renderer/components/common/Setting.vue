<template>
<div class="regular-card work">
    <b-card>
    <b-button variant="primary"> <router-link to="/" class="router-link" style="color:white;"> <h4> <i class="fa fa-arrow-left"></i> Go Back </h4> </router-link></b-button>
    <h3 class="pt-2">Settings :</h3>
    <b-form-checkbox
      id="screen-capture"
     @change="screenCaptureSoundChanged"
      name="screen-capture"
      :checked="screenCaptureSound"
    >
    <h4 class="p-2"> Turn On Screen Capture Sound </h4>
    </b-form-checkbox>
     <b-form-checkbox
      id="shortcut"
     @change="shortCutChanged"
      name="shortcut"
      :checked="shortCutEnabled"
    >
    <h4 class="p-2"> Turn On Global ShortCut (Ctrl+Shift+Alt+S) </h4>
    </b-form-checkbox>
    </b-card>
  </div>
</template>
<script>

export default ({
    computed:{
        screenCaptureSound:{
            get(){
                return this.$store.state.timer.screenCaptureSound
            },
            set(value){
                this.$store.commit('timer/SET_SCREEN_CAPTURE_SOUND',value)
            }
        },
        shortCutEnabled:{
            get(){
                return this.$store.state.timer.shortCutEnabled
            },
            set(value){
                this.$store.commit('timer/SET_SHORCUT_ENABLED',value)
            }
        },

    },
   methods:{
       screenCaptureSoundChanged(value){
           this.screenCaptureSound = value
           localStorage.setItem('screenCaptureSound',value)
       },
       shortCutChanged(value){
           this.shortCutEnabled = value
           localStorage.setItem('shortCutEnabled',value)
       }
   }
})
</script>
