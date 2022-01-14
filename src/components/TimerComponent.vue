<template>
<div>
<b-row>
    <h2>GEC Tracker</h2>
    <div class="timer">
        <p class="timer-label">Total Time Spent</p>
        <p class="timer-text"><span class="hours">{{ hours }}</span>:<span class="minutes">{{ minutes }}</span>:<span class="seconds">{{ seconds }}</span></p>
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
</div>
</template>
<script>
import {BRow,BCol} from 'bootstrap-vue'
const electron = window.require('electron')
const {desktopCapturer} = electron
  


export default{
    components:{
        BRow,
        BCol
    },
    data(){
        return{
           timeInterval:null,
           memo:'',
        }
    },
    mounted(){
        window.addEventListener('online', this.updateOnlineStatus)
        window.addEventListener('offline', this.updateOnlineStatus)
        this.updateOnlineStatus()
    //    electron.ipcRenderer.on('computer-suspend', () => {
    //      console.log("logging in");
    //  })
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
        }
    },
    methods:{
        startTimer(){
        if(!this.trackingOn) {
            this.timeInterval = setInterval(this.timer, 1000)
            this.trackingOn = true
            return 
        }
        clearInterval(this.timeInterval)
        this.trackingOn = false
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
                 this.fullscreenScreenshot(function(base64data){
                        // Draw image in the img tag
                       this.image = base64data
                       this.$store.dispatch("timer/saveScreenshot",this.image)
                    },'image/png');
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
                            console.log(stream)
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