import {formatDate,fancyTimeFormat} from '../../const/timer'
import useApollo from '../../graphql/useApollo'

export default{
    namespaced:true,
    state:{
        hours:0,
        minutes:0,
        seconds:0,
        online:navigator.onLine,
        trackingOn:false,
        image:require('../../assets/images/no-image.jpg'),
        isNotWorking:true,
        userIsIdle:false,
        idleTime:0,
        startSession:null,
        endSession:null,
        todaysTime:{hours:0,minutes:0},
        weeksTime:{hours:0, minutes:0},
        screenShotTime:null,
        latestCaptured: 0,
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
        },
        SET_START_SESSION(state,payload){
            state.startSession = payload
        },
        SET_END_SESSION(state,payload){
            state.endSession = payload
        },
        SET_TODAYS_TIME(state,payload){
            state.todaysTime = payload
        },
        SET_WEEKS_TIME(state,payload){
            state.weeksTime = payload
        },
        SET_SCREENSHOT_TIME(state,payload){{
            state.screenShotTime = payload
        }},
        SET_LATEST_CAPTURED(state,payload){
            state.latestCaptured = payload
        }
    },
    actions:{
          saveScreenshot({state},image){
            function urltoFile(url, filename, mimeType){
                return (fetch(url)
                    .then(function(res){return res.arrayBuffer();})
                    .then(function(buf){return new File([buf], filename,{type:mimeType});})
                );
            }

            if(state.online){
               urltoFile(image,'screenshot.png','image/png').then(file=>{
                   console.log(file)
                   const currentTime = new Date()
                    useApollo.auth.postScreencastActivity({activityUid:localStorage.getItem('activityUid'),startTime:formatDate(currentTime),endTime:formatDate(currentTime),image:file}).then(()=>{
                      
                    })
               })
            
            }else{
                // var base64Data = image.replace(/^data:image\/png;base64,/, "");
                // localStorage.setItem('screenshots'+Date.now(), base64Data);
            //     fs.writeFile('screenshots/'+Date.now()+".png", base64Data, 'base64', function(err) {
                  console.log('offline');
            // })

          }
        },
        generateRandomScreenshotTime({commit}){
                const max = 2
                const min = 1
                
                let difference = max - min;
                let rand = Math.random();
                rand = Math.floor( rand * difference);
                rand = rand + min;
                commit('SET_SCREENSHOT_TIME',rand)
        },

        startActivity(){
            const project = JSON.parse(localStorage.getItem('selectedProject'))
            useApollo.auth.startActivity({projectUid:project.uuid}).then(res=>{
                localStorage.setItem('activityUid',res.data.startActivity.uuid)
            })
        },
        endActivity({dispatch}){
            const project = JSON.parse(localStorage.getItem('selectedProject'))
            useApollo.auth.endActivity({projectUid:project.uuid,activityUid:localStorage.getItem('activityUid')}).then(res=>{
                console.log(res)
                localStorage.removeItem('activityUid')
                dispatch('getTotalTodayTime')
                dispatch('getTotalWeeksTime')
            }).catch(error=>{
                console.log(error)
            })
        },
        getTotalTodayTime({commit}){
            const project = JSON.parse(localStorage.getItem('selectedProject'))
            const currentTime = new Date()
            const todaysTime = new Date().setHours(0,0,0,0)
              // Todays Total Time
              useApollo.auth.getTotalTime({keyword:project.uuid,startTime:formatDate(new Date(todaysTime)),endTime:formatDate(currentTime)}).then(res=>{
                const activities = res.data.me.projects.data[0].activities.data
                let totalTime = 0
                activities.forEach(activity=>{
                    totalTime+=activity.duration
                })
                console.log(fancyTimeFormat(totalTime))
                commit('SET_TODAYS_TIME',fancyTimeFormat(totalTime))
            })

        },
        getTotalWeeksTime({commit}){
            const project = JSON.parse(localStorage.getItem('selectedProject'))
            const currentTime = new Date()
            const weekFirstDay = currentTime.getDate() - currentTime.getDay();
            const weeksTime = new Date(currentTime.setDate(weekFirstDay)).setHours(0,0,0,0)
            useApollo.auth.getTotalTime({keyword:project.uuid,startTime:formatDate(new Date(weeksTime)),endTime:formatDate(new Date())}).then(res=>{
                const activities = res.data.me.projects.data[0].activities.data
                let totalTime = 0
                activities.forEach(activity=>{
                    totalTime+=activity.duration
                })
                console.log(fancyTimeFormat(totalTime))
                commit('SET_WEEKS_TIME',fancyTimeFormat(totalTime))
            })
        }
    }
}