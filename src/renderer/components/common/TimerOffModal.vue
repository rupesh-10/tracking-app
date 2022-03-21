<template>
     <b-modal ref="timerModal" hide-header hide-footer>
        <b-row>
            <b-col>
            <h3> Tracking in Progress. Would you like to stop time tracker ?</h3>
            </b-col>
        </b-row>
        <b-row>
            <b-col style="text-align: right">
            <b-button variant="primary" @click="$emit('no')"
                >
              <h4>  No </h4>
                </b-button
            >
            <b-button variant="danger" class="ml-1" @click="$emit('yes')"
                >
                <h4>Yes</h4>
                </b-button
            >
            </b-col>
        </b-row>
        </b-modal>
</template>
<script>

export default{
    props:{
        toggle:{
            type:Boolean,
            default:false
        }
    },
    watch:{
        toggle(){
            this.toggleModal()
        }
    },
    methods:{
    toggleModal() {
        if(this.toggle)  this.$refs["timerModal"].show();
        else  this.$refs["timerModal"].hide();
      
    },
    }
}
</script>
