<template>
 <div class="container">
        <!-- Menu card -->
        <!-- Regular card -->
        <div class="regular-card work">
            <div class="timer-card">
                <div class="row">
                    <div class="col-9">
                         <div class="hours">
                               <span class="hours">{{ hours }} hrs </span>
                                 <span class="minutes">{{ showTime(minutes) }} m</span>
                         </div>
                     <h4 class="">Current Session</h4>
                    </div>
                    <div class="col-3 text-right">
                        <div class="button-switch">
                            <input type="checkbox" id="switch-blue" class="switch" :checked ="trackingOn"  @click="startTimer" />
                            <label for="switch-blue" class="lbl-off">Off</label>
                            <label for="switch-blue" class="lbl-on">On</label>
                        </div>
                        <h3 :class="online ? 'text-success' : 'text-danger'">{{ online ? 'Online' : "Offline"  }}</h3>
                    </div>
                </div>
                <div class="row ">
                    <div class="col-6"> 
                    <h6 class="title">{{ todaysTime.hours }} hrs {{ showTime(todaysTime.minutes) }} m</h6>
                     <h4 class="description ">Today ({{allDays[todayDate.getDay()]}})</h4>
                    </div>
                    <!-- <div>
                          <b-form-checkbox v-model="checked" name="check-button" switch></b-form-checkbox>
                    </div> -->
                    <div class="col-6 week-description">
                        <h6 class="title text-right "> <span :class="weeksTime.hours>limit ? 'text-red' : ''"> {{showTime(weeksTime.hours)}}:{{showTime(weeksTime.minutes)}} </span> of {{limit}} hrs</h6>
                        <h4 class="description ">This Week (UTC) </h4>
                    </div>
                </div>
            </div>
        </div>

            <!-- ScreenShot -->
       <screen-captured-image :image="image"></screen-captured-image>
       <idle-modal @stillWorking="stillWorking" @notWorking="notWorking" :toggle="toggleWorkingModal"></idle-modal>
    </div>
 </template>
<script>
const electron = window.require("electron");
const { desktopCapturer } = electron; //ipcRenderer also needed to listen event
import { powerMonitor, Notification } from "@electron/remote";
import IdleModal from '../common/IdleModal.vue'
import ScreenCapturedImage from '../common/ScreenCapturedImage.vue'

export default {
  components: {
    IdleModal,
    ScreenCapturedImage
  },
  data() {
    return {
      timeInterval: null,
      memo: "",
      isWorking: true,
      limit:40,
      allDays: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
      todayDate: new Date(),
      toggleWorkingModal:false,
      
    };
  },
  mounted() {
    window.addEventListener("online", this.updateOnlineStatus);
    window.addEventListener("offline", this.updateOnlineStatus);
    this.updateOnlineStatus();
    powerMonitor.on("suspend", () => {
      this.updateTime();
    });
    this.getIdleTime();
    this.$store.dispatch('timer/generateRandomScreenshotTime')
    this.$store.dispatch('timer/getTotalTodayTime')
    this.$store.dispatch('timer/getTotalWeeksTime')
  },
  computed: {
    hours: {
      get() {
        return this.$store.state.timer.hours;
      },
      set(value) {
        this.$store.commit("timer/SET_HOURS", value);
      },
    },
    minutes: {
      get() {
        return this.$store.state.timer.minutes;
      },
      set(value) {
        this.$store.commit("timer/SET_MINUTES", value);
      },
    },
    seconds: {
      get() {
        return this.$store.state.timer.seconds;
      },
      set(value) {
        this.$store.commit("timer/SET_SECONDS", value);
      },
    },
    todaysTime:{
        get(){
            return this.$store.state.timer.todaysTime
        },
        set(value){
            this.$store.commit("timer/SET_TODAYS_TIME",value)
        }
    },
    weeksTime:{
        get(){
            return this.$store.state.timer.weeksTime
        },
        set(value){
            this.$store.commit("timer/SET_WEEKS_TIME",value)
        }
    },
    online: {
      get() {
        return this.$store.state.timer.online;
      },
      set(value) {
        this.$store.commit("timer/SET_ONLINE", value);
      },
    },
    image: {
      get() {
        return this.$store.state.timer.image;
      },
      set(value) {
        return this.$store.commit("timer/SET_SCREENSHOT", value);
      },
    },
    trackingOn: {
      get() {
        return this.$store.state.timer.trackingOn;
      },
      set(value) {
        return this.$store.commit("timer/SET_TRACKING_ON", value);
      },
    },
    userIsIdle: {
      get() {
        return this.$store.state.timer.userIsIdle;
      },
      set(value) {
        return this.$store.commit("timer/SET_USER_IS_IDLE", value);
      },
    },
    idleTime: {
      get() {
        return this.$store.state.timer.idleTime;
      },
      set(value) {
        this.$store.commit("timer/SET_IDLE_TIME", value);
      },
    },
    startSession: {
      get() {
        return this.$store.state.timer.startSession;
      },
      set(value) {
        this.$store.commit("timer/SET_START_SESSION", value);
      },
    },
    endSession: {
      get() {
        return this.$store.state.timer.endSession;
      },
      set(value) {
        this.$store.commit("timer/SET_END_SESSION", value);
      },
    },
    screenShotTime:{
        get(){
            return this.$store.state.timer.screenShotTime
        }
    },
    latestCaptured:{
      get(){
        return this.$store.state.timer.latestCaptured
      },
      set(value){
        this.$store.commit("timer/SET_LATEST_CAPTURED",value)
      }
    }
  },
  watch: {
    trackingOn(value) {
      if (value === true) {
        this.isWorking = true;
      }
      this.timer();
    },
    idleTime(value) {
      if (value > 300 && this.trackingOn) {
        this.isWorking = false;
       this.toggleWorkingModal = true
        setTimeout(this.idle, 10000);
      }
    },
    online(oldValue,newValue){
        if (oldValue && !newValue) {
        this.sendNotification({
          title: "Connection Lost",
          body: "We couldn't find network, Please check your internet connection",
        });
      }
      if(!oldValue && newValue){
        this.sendNotification({
          title: "Connection Back",
          body: "Your Connection Restore!!",
        });
      }
    }
  },
  methods: {
    getIdleTime() {
      setInterval(() => {
        this.idleTime = powerMonitor.getSystemIdleTime();
      }, 1000);
    },
    startTimer() {
      if (!this.trackingOn) {
        this.startSession = new Date();
        this.$store.dispatch('timer/startActivity')
        this.timeInterval = setInterval(this.timer, 1000);
        this.trackingOn = true;
        return;
      }
      this.endSession = new Date();
      clearInterval(this.timeInterval);
      this.$store.dispatch('timer/endActivity')
      this.trackingOn = false;
       this.resetTime()
    },

    showTime(i) {
      if (i < 10) {
        return "0" + i;
      }
      return i;
    },
    resetTime(){
        this.hours = 0
        this.minutes = 0
        this.seconds = 0
    },
    timer() {
      this.seconds++;
      if (this.seconds == 60) {
        this.minutes = ++this.minutes;
        this.latestCaptured = ++this.latestCaptured
        this.weeksTime.minutes = ++this.weeksTime.minutes
        this.todaysTime.minutes = ++this.todaysTime.minutes
         if (this.latestCaptured == this.screenShotTime) {
        this.fullscreenScreenshot(function (base64data) {
          // Draw image in the img tag
          this.image = base64data;
          this.$store.dispatch("timer/saveScreenshot", this.image);
          this.notifyScreenCapture(this.image);
        }, "image/png");
        this.$store.dispatch('timer/generateRandomScreenshotTime')

        this.$store.commit('timer/SET_LATEST_CAPTURED',0)

        }
          this.seconds = 0;
      }

      if (this.minutes == 60) {
        this.minutes = 0;
        if(this.weeksTime.minutes >=60)  this.weeksTime.minutes = 0;
        if(this.todaysTime.minutes >= 60) this.todaysTime.minutes = 0;
        this.todaysTime.hours = ++this.todaysTime.hours
        this.weeksTime.hours = ++this.weeksTime.hours
        this.hours = ++this.hours;
      }
    },
    updateOnlineStatus() {
      this.online = navigator.onLine;
    },
    fullscreenScreenshot(callback, imageFormat) {
      var _this = this;
      this.callback = callback;
      imageFormat = imageFormat || "image/jpeg";

      this.handleStream = (stream) => {
        // Create hidden video tag
        var video = document.createElement("video");
        video.style.cssText = "position:absolute;top:-10000px;left:-10000px;";

        // Event connected to stream
        video.onloadedmetadata = function () {
          // Set video ORIGINAL height (screenshot)
          video.style.height = this.videoHeight + "px"; // videoHeight
          video.style.width = this.videoWidth + "px"; // videoWidth

          video.play();

          // Create canvas
          var canvas = document.createElement("canvas");
          canvas.width = this.videoWidth;
          canvas.height = this.videoHeight;
          var ctx = canvas.getContext("2d");
          // Draw video on canvas
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          if (_this.callback) {
            // Save screenshot to base64
            _this.callback(canvas.toDataURL(imageFormat));
          } else {
            console.log("Need callback!");
          }

          // Remove hidden video tag
          video.remove();
          try {
            // Destroy connect to stream
            stream.getTracks()[0].stop();
          } catch (e) {
            console.log(e);
          }
        };

        video.srcObject = stream;
        document.body.appendChild(video);
      };

      this.handleError = function (e) {
        console.log(e);
      };

      desktopCapturer
        .getSources({ types: ["window", "screen"] })
        .then(async (sources) => {
          //console.log(sources);

          for (const source of sources) {
            // Filter: main screen
            if (
              source.name === "Entire Screen" ||
              source.name === "Screen 1" ||
              source.name === "Screen 2"
            ) {
              try {
                const stream = await navigator.mediaDevices.getUserMedia({
                  audio: false,
                  video: {
                    mandatory: {
                      chromeMediaSource: "desktop",
                      chromeMediaSourceId: source.id,
                      minWidth: 1280,
                      maxWidth: 4000,
                      minHeight: 720,
                      maxHeight: 4000,
                    },
                  },
                });
                _this.handleStream(stream);
              } catch (e) {
                _this.handleError(e);
              }
            }
          }
        });
    },
    updateTime() {
      if (this.trackingOn) {
        this.startTimer();
      }
    },
    notWorking() {
      this.startTimer();
      this.toggleWorkingModal = false
    },

    stillWorking() {
      this.isWorking = true;
     this.toggleWorkingModal = false
    },

    idle() {
      if (!this.isWorking && this.trackingOn) {
        this.toggleWorkingModal = false
        this.startTimer();
        this.sendNotification({
          title: "Inactive User!!",
          body: "We couldn't track your activity so, turned off the timer.",
          timeoutType: "never",
        });
      }
    },
    notifyScreenCapture() {
      var audio = new Audio(require("../../assets/audio/screen.mp3"));
      audio.play();
     // ipcRenderer.send("notify-screencaptured", image);
    },
    sendNotification(notification) {
      const options = {
        title: notification.title,
        body: notification.body,
        silent: false,
        icon: require("../../assets/logo.png"),
        hasReply: true,
        timeoutType: "never",
        timeout: notification.timeoutType === "never" ? null : 10,
        sound: require("../../assets/audio/screen.mp3"),
        urgency: "critical",
      };
      const customNotification = new Notification(options);
      customNotification.show();
    },
  },
};
</script>