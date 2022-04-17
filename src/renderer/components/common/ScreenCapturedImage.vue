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
                <div class="row pt-2">
                    <div class="col-md-12">
                        <h4 class="mt-1 ml-1"><a href="#" style="text-decoration:none;" @click="openWorkDiary">View Work Diary</a></h4>
                    </div>
                </div>
            </div>
        </div>
</template>
<script>
const electron = window.require("electron");
const { shell } = electron; 

export default {
  props: {
    image: {
     type:String,
     default:'',
    },
  },
  methods:{
      openWorkDiary(){
          const url = window.process.env.WORK_DIARY_URL
          shell.openExternal(url);
      }
  }
};
</script>