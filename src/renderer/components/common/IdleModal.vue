<template>
     <b-modal ref="workingModal" hide-header hide-footer>
        <b-row>
            <b-col>
            <h3>Are you still working ? We couldn't track your activity</h3>
            </b-col>
        </b-row>
        <b-row>
            <b-col style="text-align: right">
            <b-button variant="primary" @click="emit('stillWorking')"
                >
              <h4>  Yes, I'm working </h4>
                </b-button
            >
            <b-button variant="danger" class="ml-1" @click="emit('notWorking')"
                >
                <h4>Stop Timer</h4>
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
        if(this.toggle)  this.$refs["workingModal"].show();
        else  this.$refs["workingModal"].hide();
      
    },
    }
}
</script>
