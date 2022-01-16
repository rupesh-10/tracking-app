<template>
    <div>
        <img :src="image" width="100%" height="100%">
    </div>
</template>
<script>
export default{
    mounted(){
        console.log('mounted')
    },
    computed:{
        image:{
            get(){
                return this.$store.state.timer.image
            }
        }
    }
}
</script>