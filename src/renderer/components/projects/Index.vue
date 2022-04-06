<template>
    <div>
        <div class="projects w-100">
            <div class="search-project">
                <input class="form-control" placeholder="Search Projects">
            </div>
            <div class="mt-3">
                <h3 class="text-white">Please Select Project</h3>
            </div>
            <div class="project-row project-card mt-3 p-3" v-for="(project,index) in projects" :key="project.project.uuid">
                <div class="col-md-10">
                <h3 class="project-name" @click="selectProject(project)">{{ project.project.name }}</h3>
                <h5>{{ project.project.company.name }}</h5>
                </div>
                <div class="col-md-2">
                    {{ getProjectWeekTime(project.project.uuid,index) }} of 50hrs
                </div>
            </div>
            <hr>
        </div>
    </div>
</template>
<script>
export default{
    computed:{
        projects(){
            return JSON.parse(localStorage.getItem('userData')).projectRoles.data
        },
      
    },
    methods:{
        selectProject(project){
            this.$store.commit('timer/SET_PROJECT',project.project)
             this.$store.dispatch('timer/getTotalTodayTime')
             this.$store.dispatch('timer/getTotalWeeksTime')
             this.$store.dispatch('timer/fetchImage')
             this.$router.replace({name:'home'})                                                                                                                
        },
         getProjectWeekTime(uuid,index){
          this.$store.dispatch('timer/getTotalWeeksTime',uuid).then(res=>{
              this.projectWeeksTime[index] = res
          })
        }
    }
}
</script>
