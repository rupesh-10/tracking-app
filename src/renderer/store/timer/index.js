import {formatDate,fancyTimeFormat} from '../../const/timer'
import useApollo from '../../graphql/useApollo'
const activeWindow = require('active-win');
const moment = require('moment')
import localStore from '../../utils/localStore'
// const ioHook = window.require('iohook');
// const gkm = require('gkm');
     
import { powerMonitor } from "@electron/remote";


import url from 'url';

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
        activityIdleTime:0,
        lastInactivity:0,
        startSession:null,
        endSession:null,
        todaysTime:JSON.parse(localStorage.getItem('todaysTotalTime')),
        weeksTime:JSON.parse(localStorage.getItem('weeksTotalTime')),
        screenShotTime:null,
        latestCaptured:  parseInt(localStorage.getItem('latestCaptured'))||0,
        checkAppsAndWebsitesInterval:null,
        touchActivityInterval:null,
        website:null,
        application:null,
        app_website:null,
        project:JSON.parse(localStorage.getItem('selectedProject')),
        projectUid:JSON.parse(localStorage.getItem('selectedProject'))?.uuid,
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
            localStorage.setItem('latestCaptured',payload)
            state.latestCaptured = payload
        },
        UPDATE_CHECK_APPS_AND_WEBSITES_INTERVAL(state,payload){
            state.checkAppsAndWebsitesInterval = payload
        },
        SET_WEBSITE(state,payload){
            state.website = payload
        },
        SET_APPLICATION(state,payload){
            state.application = payload
        },
        SET_APP_WEBSITE(state,payload){
            state.app_website = payload
        },
        SET_TOUCH_ACTIVITY_INTERVAL(state,payload){
            state.touchActivityInterval = payload
        },
        SET_PROJECT(state,payload){
            localStorage.setItem('selectedProject',JSON.stringify(payload))
            state.project = JSON.parse(localStorage.getItem('selectedProject'))
            this.commit('timer/SET_PROJECT_UUID',state.project.uuid)
        },
        SET_PROJECT_UUID(state,payload){
            state.projectUid = payload
        },
        SET_ACTIVITY_IDLE_TIME(state,payload){
            state.activityIdleTime = payload
        },
        SET_LAST_INACTIVITY(state,payload){
            state.lastInactivity = payload
        },

    },
    actions:{
          saveScreenshot({state,dispatch},images){
            function urltoFile(fileUrl, filename, mimeType){
                return (fetch(fileUrl)
                    .then(function(res){return res.arrayBuffer();})
                    .then(function(buf){return new File([buf], filename,{type:mimeType});})
                );
            }

                const currentTime = moment()

                let convertedImages = []
                images.forEach((image,index)=>{
                     urltoFile(image,'screenshot'+index,'image/png').then(file=>{
                        convertedImages.push(file)
                        if(index == images.length-1){
                            let startTime = localStorage.getItem('startTimeForCapture')
                            if(!startTime){
                                startTime = formatDate(currentTime)
                            }
                            const data = {activityUid:localStorage.getItem('activityUid'),startTime,endTime:formatDate(currentTime),images:convertedImages,keyClicks:parseInt(localStorage.getItem('keyboardEvent')),mouseMoves:parseInt(localStorage.getItem('mouseEvent'))}
                             useApollo.activity.postScreencastActivity(data).then(()=>{
                                if(state.trackingOn){
                                  localStore.screenCast()
                                }
                            }).catch(()=>{
                                localStore.offlineScreenCast(data)
                            }).finally(()=>{
                                localStorage.setItem('startTimeForCapture',formatDate(currentTime))
                            })
                        }

                    })
                })
          dispatch('setLatestCaptured',images[0])
          
        },
        generateRandomScreenshotTime({commit}){
                let max = 10
                // const min = process.env.MIN_SCREEN_CAPTURE_TIME
                const rand = max
                // let difference = max - min;
                // let rand = Math.random();
                // rand = Math.floor( rand * difference);
                // rand = rand + min;
                commit('SET_SCREENSHOT_TIME',rand)
        },

       async startActivity({state}){
            useApollo.activity.startActivity({projectUid:state.projectUid}).then(res=>{
                localStore.startActivity(res.data.startActivity.uuid)
              
            }).catch(()=>{
                localStore.offlineStartActivity()
            })
        },
        async endActivity({dispatch,state}){
            if(state.checkAppsAndWebsitesInterval) 
            {
                clearInterval(state.checkAppsAndWebsitesInterval)
            }
            localStorage.removeItem('appAndWebsiteUsed')
            if(state.touchActivityInterval) 
            {
                clearInterval(state.touchActivityInterval)
            }
            useApollo.activity.endActivity({projectUid:state.projectUid,activityUid:localStorage.getItem('activityUid')}).then(()=>{
                dispatch('getTotalTodayTime')
                dispatch('getTotalWeeksTime')
                if(state.checkAppsAndWebsitesInterval) {clearInterval(state.checkAppsAndWebsitesInterval)}
                if(state.touchActivityInterval) {clearInterval(state.touchActivityInterval)}
                localStore.endActivity()
            }).catch(()=>{
               localStore.offlineEndActivity()
            })
        },
        getTotalTodayTime({commit,state}){
            const startTime = moment().startOf("day")
            const endTime = moment().endOf("day")
              // Todays Total Time
              useApollo.activity.getTotalTime({keyword:state.projectUid,startTime:formatDate(startTime),endTime:formatDate(endTime)}).then(res=>{
                localStorage.setItem('todaysTotalTime',JSON.stringify(fancyTimeFormat(res?.data?.me?.duration)))
                commit('SET_TODAYS_TIME',fancyTimeFormat(res?.data?.me?.duration))
            })

        },
        async getTotalWeeksTime({commit,state},projectUid=null){
            const startTime = moment().startOf("isoWeek").startOf("day")    
            const endTime = moment().endOf("isoWeek").endOf("day")
            return await useApollo.activity.getTotalTime({keyword:projectUid ? projectUid : state.projectUid,startTime:formatDate(startTime),endTime:formatDate(endTime)}).then(res=>{
                if(projectUid) return  fancyTimeFormat(res?.data?.me?.duration)
                else{
                localStorage.setItem('weeksTotalTime',JSON.stringify(fancyTimeFormat(res?.data?.me?.duration)))
                commit('SET_WEEKS_TIME',fancyTimeFormat(res?.data?.me?.duration))
                }
            })
        },

        checkAppsAndWebsites({commit,dispatch}){

            const interval = setInterval(
                    async () =>{
                        dispatch('dispatchAppAndWebsiteUsed');
                    },
                        1000
                    )
            commit('UPDATE_CHECK_APPS_AND_WEBSITES_INTERVAL',interval) 
        },
        async dispatchAppAndWebsiteUsed({commit,dispatch,state},forcePost=null){
            let source = await activeWindow()
            const systemIdleTime=powerMonitor.getSystemIdleTime();

            if(!source){
                source = { owner: {name:'desktop'},id:-1}
            }
            if(systemIdleTime>state.lastInactivity){

                commit("SET_ACTIVITY_IDLE_TIME",state.activityIdleTime+systemIdleTime-state.lastInactivity)
                commit("SET_LAST_INACTIVITY",systemIdleTime)
            } else{
                commit("SET_LAST_INACTIVITY",0)
            }
            const storageApplication=localStorage.getItem('appAndWebsiteUsed')
            var lastApplicationInfo=null;
            var urlChanged=null;
            if(storageApplication){
                lastApplicationInfo=JSON.parse(storageApplication)
                var sourceUrl=source.url;
                if(sourceUrl!=null){
                    const urlObject =url.parse(sourceUrl);
                    sourceUrl=urlObject.host
                }
                if(sourceUrl!=null){
                    if(sourceUrl!=lastApplicationInfo.url)
                        urlChanged=true;
                }
            }


            if(forcePost || urlChanged ||  (lastApplicationInfo && lastApplicationInfo.id!=source.id)){
                if(lastApplicationInfo==null)
                    return;
                const activeDuration=(moment().unix() - moment(lastApplicationInfo.start_time).unix())

                if(activeDuration>5){
                    if(lastApplicationInfo.url){
                        
                        dispatch('setWebTime',{
                                activityUid:localStorage.getItem('activityUid'),
                                name:lastApplicationInfo.name,   
                                startTime:formatDate(lastApplicationInfo.start_time),
                                endTime:formatDate(moment()),
                                url:lastApplicationInfo.url,
                                keyClicks:parseInt(localStorage.getItem('keyboardEvent')),
                                mouseMoves:parseInt(localStorage.getItem('mouseEvent')),
                                idleTime: state.activityIdleTime
                        })
                        dispatch('setAppAndWebsiteUsed',source)
                    } else{
                        dispatch('setAppTime',{
                            activityUid:localStorage.getItem('activityUid'),
                            name:lastApplicationInfo.name,
                            startTime:formatDate(lastApplicationInfo.start_time),
                            endTime:formatDate(moment()),
                            url:lastApplicationInfo.url,
                            keyClicks:parseInt(localStorage.getItem('keyboardEvent')),
                            mouseMoves:parseInt(localStorage.getItem('mouseEvent')),
                            idleTime: state.activityIdleTime
                        })
                        dispatch('setAppAndWebsiteUsed',source)
                    }
                }else {
                  dispatch('setAppAndWebsiteUsed',source)
                }
                
            } else if(lastApplicationInfo==null){
                dispatch('setAppAndWebsiteUsed',source)
            }
        },
        setAppAndWebsiteUsed({commit},source){
            var sourceUrl=source.url
            if(sourceUrl!=null){
                const urlObject =url.parse(sourceUrl);
                sourceUrl=urlObject.host

            }
            const appAndWebsiteUsed = 
            {
                id: source.id,
                name:source.owner.name,
                start_time:moment(),
                url: sourceUrl
            }
            localStorage.setItem('appAndWebsiteUsed',JSON.stringify(appAndWebsiteUsed))
            commit('SET_APP_WEBSITE',appAndWebsiteUsed)
            commit('SET_ACTIVITY_IDLE_TIME',0)
        },
        setAppTime({commit},data){            
            useApollo.activity.setAppActivity(data).then(()=>{
              localStore.appActivity()

            }).catch(()=>{
                localStore.offlineAppActivity(data)
            })
            commit('SET_APPLICATION',data)

        },
        setWebTime({commit},data){
            useApollo.activity.setWebActivity(data).then(()=>{
              localStore.appActivity()
            }).catch(()=>{
                localStore.offlineWebActivity(data)
            })
            commit('SET_WEBSITE',data)
        },
        setLatestCaptured({commit,state},image){
            if(localStorage.getItem('latestCapturedImage')){
                let latestCaptured = JSON.parse(localStorage.getItem('latestCapturedImage'))
               if(latestCaptured.find(capture=>capture.project == state.projectUid ))latestCaptured.find(capture=>capture.project == state.projectUid ).image = image
                else {
                     latestCaptured.push({
                        project:state.projectUid,
                        image: image
                    })
                }
                localStorage.setItem('latestCapturedImage',JSON.stringify(latestCaptured))
            }
            else{
                const latestCaptured = [{
                    project:state.projectUid,
                    image:image
                }]
                localStorage.setItem('latestCapturedImage',JSON.stringify(latestCaptured))
            }
            commit('SET_SCREENSHOT',image)
        },
        fetchImage({commit,state}){
            const latestCapturedImage = JSON.parse(localStorage.getItem('latestCapturedImage'))
            if(latestCapturedImage){
              const filteredLatestCapturedImage = latestCapturedImage.find(capture=>capture.project == state.projectUid )
              if(filteredLatestCapturedImage){
                
                commit('SET_SCREENSHOT',filteredLatestCapturedImage)
              }
              else commit('SET_SCREENSHOT',require('../../assets/images/no-image.jpg')) 
            }

            useApollo.activity.getLatestScreenCapture({projectUid:state.projectUid}).then(res=>{
                const screenCapture = res.data?.me?.activityRecords?.data[0]?.record?.title
                if(screenCapture) {
                    const images=screenCapture.split(",");
                    const image=images.reverse()[0];
                    commit('SET_SCREENSHOT',image)
                }
            })
        },

        touchActivity({commit,state}){
            const interval = setInterval(()=>{
                if(state.trackingOn){
                useApollo.activity.touchActivity({projectUid:state.projectUid,activityUid:localStorage.getItem('activityUid')}).then(()=>{
                    localStore.checkOfflineActivity()
                })
              }
            },60000)
            commit('SET_TOUCH_ACTIVITY_INTERVAL',interval)
        },

        startActivityTracking(){
            // gkm.events.on('key.*', function(data) {
            //     console.log(this.event + ' ' + data);
            // });
             
            // // Listen to all mouse events (click, pressed, released, moved, dragged)
            // gkm.events.on('mouse.*', function(data) {
            //     console.log(this.event + ' ' + data);
            // });
            // ioHook.on('keyup', () => {
            //     if(localStorage.getItem('keyboardEvent')){
            //       localStorage.setItem('keyboardEvent',parseInt(localStorage.getItem('keyboardEvent'))+1)
            //     }
            //     if(localStorage.getItem('screenKeyboardEvent')){
            //       localStorage.setItem('screenKeyboardEvent',parseInt(localStorage.getItem('screenKeyboardEvent'))+1)
            //     }
            //   });
      
            //   ioHook.on('mouseclick', () => {
            //     if(localStorage.getItem('mouseEvent')){
            //       localStorage.setItem('mouseEvent',parseInt(localStorage.getItem('mouseEvent'))+1)
            //     }
            //     if(localStorage.getItem('screenMouseEvent')){
            //       localStorage.setItem('screenMouseEvent',parseInt(localStorage.getItem('screenMouseEvent'))+1)
            //     }
            //   });
      
            //   // Register and start hook
            //   ioHook.start();
      
        }
    }
}