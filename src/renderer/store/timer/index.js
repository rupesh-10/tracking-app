import axios from 'axios'
const notifier  = require('node-notifier')

export default{
    namespaced:true,
    state:{
        hours:0,
        minutes:0,
        seconds:0,
        online:navigator.onLine,
        trackingOn:false,
        image:null,
        isNotWorking:true,
        userIsIdle:false,
        idleTime:0,
    },
    getters:{

    },
    mutations:{
        SET_HOURS(state,payload){
            state.hours = payload
        },
        SET_MINUTES(state,payload){
            state.minutes = payload
        },
        SET_SECONDS(state,payload){
            state.seconds = payload
        },
        SET_ONLINE(state,payload){
            state.online = payload
        },
        SET_SCREENSHOT(state,payload){
            state.image = payload
        },
        SET_TRACKING_ON(state,payload){
            state.trackingOn = payload
        },
        SET_IS_NOT_WORKING(state,payload){
            state.isNotWorking = payload
        },
        SET_USER_IS_IDLE(state,payload){
            state.userIsIdle = payload
        },
        SET_IDLE_TIME(state,payload){
            state.idleTime = payload
        }
    },
    actions:{
          saveScreenshot({state},image){
            const config = {
                headers: {
                  'content-type': 'multipart/form-data',
                }
            }
              const data = new FormData()
              data.append('image',image)
                if(state.online){
                axios.post('',data,config).then(res=>{
                    console.log(res)
                })
            }else{
                var base64Data = image.replace(/^data:image\/png;base64,/, "");
                localStorage.setItem('screenshots'+Date.now(), base64Data);
            //     fs.writeFile('screenshots/'+Date.now()+".png", base64Data, 'base64', function(err) {
            //       console.log(err);
            // })

          }
        },
        async notifyScreenCapture(){
            console.log('hawaijahaj')
            notifier.notify({
                message: 'Hello, there!',
                sound:true
                });
            }
    }
}