<template>
<div>
<b-row>
    <h2>GEC Tracker</h2>
    <div class="timer">
        <p class="timer-label">Total Time Spent</p>
        <p class="timer-text"><span class="hours">{{ showTime(hours) }}</span>:<span class="minutes">{{ showTime(minutes) }}</span>:<span class="seconds">{{ showTime(seconds) }}</span></p>
    </div>
    <b-col class="text-center" md="12">
    <button class="btn w-50 start btn-primary" @click="startTimer">{{ trackingOn ? 'Stop' : 'Start' }}</button>
    </b-col>
    <!-- <img :src="image"> -->
</b-row>
<b-row class="p-2">
    <b-col md="12">
    <b-col md="12" class="p-1" style="text-align:left;">
    <label>Memo: </label>
    </b-col>
    <input class="form-control w-100" placeholder="What are you doing ?">
    </b-col>
</b-row>
<b-row v-if="image">
    <b-col md="12" class="text-left pt-2">
    <h5>Latest Screen Capture: </h5>
    <img :src="image" height="160" width="340">
    </b-col>
</b-row>
  <b-modal v-if="true" ref="workingModal" hide-header hide-footer >
      <b-row>
        <b-col>
          <h6>Are you still working ? We couldn't track your activity</h6>
        </b-col>
      </b-row>
      <b-row>
        <b-col style="text-align:right;">
            <b-button variant="primary" @click="stillWorking">Yes, I'm working</b-button>
            <b-button variant="danger" class="ml-1" @click="notWorking">Stop Timer</b-button>
        </b-col>
      </b-row>
    </b-modal>
</div>
</template>
<script>
import {BRow,BCol,BModal} from 'bootstrap-vue'
const electron = window.require('electron')
const {desktopCapturer,ipcRenderer} = electron
import {powerMonitor} from '@electron/remote'

export default{
    components:{
        BRow,
        BCol,
        BModal
    },
    data(){
        return{
           timeInterval:null,
           memo:'',
           isWorking:true,
        }
    },
    mounted(){
        window.addEventListener('online', this.updateOnlineStatus)
        window.addEventListener('offline', this.updateOnlineStatus)
        this.updateOnlineStatus()
        powerMonitor.on('suspend',()=>{
            this.updateTime()
            })
        this.getIdleTime()
   

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
            },
            set(value){
                return this.$store.commit("timer/SET_SCREENSHOT",value)
            }
        },
        trackingOn:{
            get(){
                return this.$store.state.timer.trackingOn
            },
            set(value){
                return this.$store.commit("timer/SET_TRACKING_ON",value)
            }
        },
        userIsIdle:{
            get(){
                return this.$store.state.timer.userIsIdle
            },
            set(value){
                return this.$store.commit("timer/SET_USER_IS_IDLE",value)
            }
        },
        idleTime:{
            get(){
                return this.$store.state.timer.idleTime
            },
            set(value){
                 this.$store.commit("timer/SET_IDLE_TIME",value)
            }
        }
    },
    watch:{
        trackingOn(value){
            if(value===true){
                this.isWorking = true
            }
             this.timer()
        },
        idleTime(value){
            if(value > 10 && this.trackingOn){
                this.isWorking = false
                this.showModal()
                setTimeout(this.idle,10000)
            }
        }
    },
    methods:{
        getIdleTime(){
            setInterval(()=>{
                this.idleTime = powerMonitor.getSystemIdleTime()
            },1000)
        },
        startTimer(){
        if(!this.trackingOn) {
            this.timeInterval = setInterval(this.timer, 1000)
            this.trackingOn = true
            return 
        }
        clearInterval(this.timeInterval)
        this.trackingOn = false
        },
        
        showTime(i){
            if(i<10){
                return '0'+ i
            }
            return i
        },
    
        timer(){
            this.seconds++
            if(this.seconds==10){
                 this.fullscreenScreenshot(function(base64data){
                        // Draw image in the img tag
                       this.image = base64data
                       this.$store.dispatch("timer/saveScreenshot",this.image)
                       this.notifyScreenCapture()
                    },'image/png');
            }
                if (this.seconds == 60) {
                    this.minutes = ++this.minutes;
                    this.seconds = 0;
                }

                if (this.minutes == 60) {
                    this.minutes = 0;
                    this.hours = ++this.hours;
                }

        },
        updateOnlineStatus(){
            this.online = navigator.onLine
        },
    fullscreenScreenshot(callback, imageFormat) {
            var _this = this;
            this.callback = callback;
            imageFormat = imageFormat || 'image/jpeg';
            
            this.handleStream = (stream) => {
                // Create hidden video tag
                var video = document.createElement('video');
                video.style.cssText = 'position:absolute;top:-10000px;left:-10000px;';
        
                
                
                // Event connected to stream
                video.onloadedmetadata = function () {
                    // Set video ORIGINAL height (screenshot)
                    video.style.height = this.videoHeight + 'px'; // videoHeight
                    video.style.width = this.videoWidth + 'px'; // videoWidth
        
                    video.play();
        
                    // Create canvas
                    var canvas = document.createElement('canvas');
                    canvas.width = this.videoWidth;
                    canvas.height = this.videoHeight;
                    var ctx = canvas.getContext('2d');
                    // Draw video on canvas
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
                    if (_this.callback) {
                        // Save screenshot to base64
                        _this.callback(canvas.toDataURL(imageFormat));
                    } else {
                        console.log('Need callback!');
                    }
        
                    // Remove hidden video tag
                    video.remove();
                    try {
                        // Destroy connect to stream
                        stream.getTracks()[0].stop();
                    } catch (e) {
                        console.log(e)
                    }
                }
                
                video.srcObject = stream;
                document.body.appendChild(video);
            };
        
            this.handleError = function(e) {
                console.log(e);
            };
        
            desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
                console.log(sources);
                
                for (const source of sources) {
                    // Filter: main screen
                    if ((source.name === "Entire Screen") || (source.name === "Screen 1") || (source.name === "Screen 2")) {
                        try{
                            const stream = await navigator.mediaDevices.getUserMedia({
                                audio: false,
                                video: {
                                    mandatory: {
                                        chromeMediaSource: 'desktop',
                                        chromeMediaSourceId: source.id,
                                        minWidth: 1280,
                                        maxWidth: 4000,
                                        minHeight: 720,
                                        maxHeight: 4000
                                    }
                                }
                            });
                            _this.handleStream(stream);
                        } catch (e) {
                            _this.handleError(e);
                        }
                    }
                }
            });
        },
        updateTime(){
            if(this.trackingOn){
                this.startTimer()
            }
        },

        showModal(){
            this.$refs['workingModal'].show()
        },
        hideModal(){
            this.$refs['workingModal'].hide()
        },
        notWorking(){
            this.startTimer()
            this.hideModal()
        },
        stillWorking(){
            this.isWorking = true
            this.hideModal()
        },
        idle(){
            if(!this.isWorking && this.trackingOn){
                this.hideModal()
                this.startTimer()
            }
        },
     notifyScreenCapture(){
         ipcRenderer.send('notify-screencaptured')
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
.ml-1{
    margin-left:10px;
}
</style>