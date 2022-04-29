<template>
     <b-modal ref="timerInfoModal" hide-header hide-footer>
        <b-row>
            <b-col>
            <h2>Timer Off Due to Inactivity.</h2>
            </b-col>
        </b-row>
        <b-row>
            <b-col style="text-align: right">
            <b-button variant="danger" class="ml-1" @click="$emit('ok')"
                >
                <h4>Ok</h4>
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
        if(this.toggle)  this.$refs["timerInfoModal"].show();
        else  this.$refs["timerInfoModal"].hide();
      
    },
    }
}
</script>
