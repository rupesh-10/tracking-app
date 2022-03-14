<template>
   <div class="regular-card work">
            <div class="screen-shot-card">
                <div class="row">
                    <h2 class="">Latest Screenshot: </h2>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <img :src="image">
                    </div>
                </div>
            </div>
        </div>
</template>
<script>
export default {
  props: {
    image: {
     type:String,
     default:'',
    },
  },
};
</script>