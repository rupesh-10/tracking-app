<template>
<div class="regular-card work">
    <b-card>
    <b-button variant="primary"> <router-link to="/" class="router-link" style="color:white;"> <h4> <i class="fa fa-arrow-left"></i> Go Back </h4> </router-link></b-button>
    <h3 class="pt-2">Settings :</h3>
    <b-form-checkbox
      id="checkbox-1"
     @change="screenCaptureSoundChanged"
      name="checkbox-1"
      :checked="screenCaptureSound"
    >
    <h4 class="p-2"> Turn On Screen Capture Sound </h4>
    </b-form-checkbox>
     <b-form-checkbox
      id="checkbox-1"
     @change="shortCutChanged"
      name="checkbox-1"
      :checked="shortCutEnabled"
    >
    <h4 class="p-2"> Turn On Global ShortCut (Ctrl+Shift+Alt+S) </h4>
    </b-form-checkbox>
    </b-card>
  </div>
</template>
<script>

export default ({
   data(){
       return {
           screenCaptureSound: localStorage.getItem('screenCaptureSound'),
           shortCutEnabled: localStorage.getItem('shortCutEnabled'),
       }
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
