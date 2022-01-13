<template>
<div>
<b-row>
    <h2>GEC Tracker</h2>
    <div class="timer">
        <p class="timer-label">Total Time Spent</p>
        <p class="timer-text"><span class="hours">{{ hours }}</span>:<span class="minutes">{{ minutes }}</span>:<span class="seconds">{{ seconds }}</span></p>
    </div>
    <button class="btn start btn-primary" @click="startTimer">Start</button>
    <!-- <img :src="image"> -->
</b-row>
</div>
</template>
<script>
import {BRow} from 'bootstrap-vue'

export default{
    components:{
        BRow,
    },
    data(){
        return{
           
        }
    },
    mounted(){
        window.addEventListener('online', this.updateOnlineStatus)
        window.addEventListener('offline', this.updateOnlineStatus)
        this.updateOnlineStatus()
    },  
    computed:{
        hours:{
            get(){
               return this.$store.state.timer.hours
            },
            set(value){
                this.$store.commit("timer/SET_HOURS",value)
            }
        },
         minutes:{
            get(){
               return this.$store.state.timer.minutes
            },
            set(value){
                this.$store.commit("timer/SET_MINUTES",value)
            }
        },
        seconds:{
        get(){
            return this.$store.state.timer.seconds
        },
        set(value){
            this.$store.commit("timer/SET_SECONDS",value)
        }
        },
        online:{
            get(){
                return this.$store.state.timer.online
            },
            set(value){
                this.$store.commit("timer/SET_ONLINE",value)
            }
        },
        image:{
            get(){
                return this.$store.state.timer.image
            }
        }
    },
    methods:{
        startTimer(){
          setInterval(this.timer, 1000);
        },
        checkTime(i){
            if(i<10){
                return '0'+ i
            }
            return i
        },
        timer(){
            this.seconds++
            this.seconds = this.checkTime(this.seconds)
            if(this.seconds==10){
                this.$store.dispatch('timer/fullscreenScreenshot')
            }
                if (this.seconds == 60) {
                    this.minutes = ++this.minutes;
                    this.seconds = 0;
                    this.minutes = this.checkTime(this.minutes)
                }

                if (this.minutes == 60) {
                    this.minutes = 0;
                    this.hours = ++this.hours;
                    this.hours = this.checkTime(this.hours)
                }

        },
        updateOnlineStatus(){
            if(this.online && !navigator.onLine){
                console.log('Connection Lost !!!!')
            }
            this.online = navigator.onLine
        }
    }
}
</script>
<style scoped lang="css">
.timer {
  text-align: center;
  color: #4A4A4A;
  margin-bottom: 20px;
}

.timer-label {
  margin-bottom: 5px;
}

.timer-text {
  font-size: 1.5rem;
  font-weight: 700;
}
</style>