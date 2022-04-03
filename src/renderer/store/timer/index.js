import {formatDate,fancyTimeFormat} from '../../const/timer'
import useApollo from '../../graphql/useApollo'
const activeWindow = require('active-win');
const moment = require('moment')

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
        startSession:null,
        endSession:null,
        todaysTime:JSON.parse(localStorage.getItem('todaysTotalTime')),
        weeksTime:JSON.parse(localStorage.getItem('weeksTotalTime')),
        screenShotTime:null,
        latestCaptured: 0,
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
        }

    },
    actions:{
          saveScreenshot({state,dispatch},images){
            function urltoFile(fileUrl, filename, mimeType){
                return (fetch(fileUrl)
                    .then(function(res){return res.arrayBuffer();})
                    .then(function(buf){return new File([buf], filename,{type:mimeType});})
                );
            }

            if(state.online){
                const currentTime = moment()

                let convertedImages = []
                images.forEach((image,index)=>{
                     urltoFile(image,'screenshot'+index,'image/png').then(file=>{
                        convertedImages.push(file)
                        if(index == images.length-1){
                             useApollo.activity.postScreencastActivity({activityUid:localStorage.getItem('activityUid'),startTime:formatDate(currentTime),endTime:formatDate(currentTime),images:convertedImages,keyClicks:parseInt(localStorage.getItem('keyboardEvent')),mouseMoves:parseInt(localStorage.getItem('mouseEvent'))}).then(()=>{
                                console.log(convertedImages)
                                localStorage.setItem('keyboardEvent',1)
                                localStorage.setItem('mouseEvent',1)
                                if(state.trackingOn){
                                    localStorage.setItem('screenKeyboardEvent',1)
                                    localStorage.setItem('screenMouseEvent',1)
                                }
                            })  
                        }

                    })
                })
                       
            }else{
                // var base64Data = image.replace(/^data:image\/png;base64,/, "");
                // localStorage.setItem('screenshots'+Date.now(), base64Data);
            //     fs.writeFile('screenshots/'+Date.now()+".png", base64Data, 'base64', function(err) {
                  console.log('offline');
            // })

          }
          dispatch('setLatestCaptured',images[0])
          
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

        startActivity({dispatch,state}){
            dispatch('checkAppsAndWebsites')
            useApollo.activity.startActivity({projectUid:state.projectUid}).then(res=>{
                localStorage.setItem('activityUid',res.data.startActivity.uuid)
                localStorage.setItem('keyboardEvent',1)
                localStorage.setItem('mouseEvent',1)
                localStorage.setItem('screenKeyboardEvent',1)
                localStorage.setItem('screenMouseEvent',1)
                dispatch('touchActivity')
            })
        },
        endActivity({dispatch,state}){
            useApollo.activity.endActivity({projectUid:state.projectUid,activityUid:localStorage.getItem('activityUid')}).then(()=>{
                localStorage.removeItem('activityUid')
                localStorage.removeItem('keyboardEvent')
                localStorage.removeItem('mouseEvent')
                localStorage.removeItem('screenKeyboardEvent')
                localStorage.removeItem('screenMouseEvent')
                localStorage.removeItem('appAndWebsiteUsed')
                dispatch('getTotalTodayTime')
                dispatch('getTotalWeeksTime')
                if(state.checkAppsAndWebsitesInterval) clearInterval(state.checkAppsAndWebsitesInterval)
                if(state.touchActivityInterval) clearInterval(state.touchActivityInterval)
            }).catch(error=>{
                console.log(error)
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
        getTotalWeeksTime({commit,state}){
            const startTime = moment().startOf("isoWeek").startOf("day")    
            const endTime = moment().endOf("isoWeek").endOf("day")
            useApollo.activity.getTotalTime({keyword:state.projectUid,startTime:formatDate(startTime),endTime:formatDate(endTime)}).then(res=>{
                localStorage.setItem('weeksTotalTime',JSON.stringify(fancyTimeFormat(res?.data?.me?.duration)))
                commit('SET_WEEKS_TIME',fancyTimeFormat(res?.data?.me?.duration))
            })
        },

        checkAppsAndWebsites({commit,dispatch}){
            const interval = setInterval(
                    async () =>{
                        const source = await activeWindow()
                        const storageApplication=localStorage.getItem('appAndWebsiteUsed')
                        var lastApplicationInfo=null;
                        if(storageApplication)
                        lastApplicationInfo=JSON.parse(storageApplication)
                        const urlChanged=(lastApplicationInfo && lastApplicationInfo.url && lastApplicationInfo.url==source.url)
                        if(urlChanged || (lastApplicationInfo && lastApplicationInfo.id!=source.id)){
                            // //Check if browser was visited
                            // if(lastApplicationInfo.url && lastApplicationInfo.url==source.url){
                            //     return;
                            // }
                            const activeDuration=(moment().unix() - moment(lastApplicationInfo.start_time).unix())

                            if(activeDuration>15){
                                if(lastApplicationInfo.url){
                                    dispatch('setWebTime',{activityUid:localStorage.getItem('activityUid'),name:lastApplicationInfo.name,startTime:formatDate(lastApplicationInfo.start_time),endTime:formatDate(moment()),url:lastApplicationInfo.url,keyClicks:parseInt(localStorage.getItem('keyboardEvent')),mouseMoves:parseInt(localStorage.getItem('mouseEvent'))})
                                     dispatch('setAppAndWebsiteUsed',source)
                                    

                                } else{
                                    dispatch('setAppTime',{activityUid:localStorage.getItem('activityUid'),name:lastApplicationInfo.name,startTime:formatDate(lastApplicationInfo.start_time),endTime:formatDate(moment()),url:lastApplicationInfo.url,keyClicks:parseInt(localStorage.getItem('keyboardEvent')),mouseMoves:parseInt(localStorage.getItem('mouseEvent'))})
                                    dispatch('setAppAndWebsiteUsed',source)

                                }
                            }else {
                              dispatch('setAppAndWebsiteUsed',source)
                            }
                            localStorage.removeItem("appAndWebsiteUsed")
                        } else if(lastApplicationInfo==null){
                            dispatch('setAppAndWebsiteUsed',source)
                        }
                    },
                        1000
                    )
            commit('UPDATE_CHECK_APPS_AND_WEBSITES_INTERVAL',interval) 
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
        },
        setAppTime({commit},data){            
            useApollo.activity.setAppActivity(data).then(()=>{
                localStorage.setItem('keyboardEvent',1)
                localStorage.setItem('mouseEvent',1)

            })
            commit('SET_APPLICATION',data)

        },
        setWebTime({commit},data){
            useApollo.activity.setWebActivity(data).then(()=>{
                localStorage.setItem('keyboardEvent',1)
                localStorage.setItem('mouseEvent',1)
            })
            commit('SET_WEBSITE',data)
        },
        setLatestCaptured({commit,state},image){
            if(localStorage.getItem('latestCapturedImage')){
                let latestCaptured = JSON.parse(localStorage.getItem('latestCapturedImage'))
                let foundProject = null
                 latestCaptured.forEach((capture,index)=>{
                    if(capture.project == state.projectUid){
                        foundProject = index
                    }
                })
                if(foundProject) {
                    latestCaptured[foundProject].image = image
                }
                else {
                     latestCaptured.push({
                        project:state.projectUid,
                        image: image
                    })
                }
                localStorage.setItem('latestCapturedImage',JSON.stringify(latestCaptured))
            }
            else{
                console.log('yo arko else me')
                const latestCaptured = [{
                    project:state.projectUid,
                    image:image
                }]
                localStorage.setItem('latestCapturedImage',JSON.stringify(latestCaptured))
            }
            commit('SET_SCREENSHOT',image)
        },
        fetchImage({commit}){
            const selectedProject= JSON.parse(localStorage.getItem('selectedProject'))
            const latestCapturedImage = JSON.parse(localStorage.getItem('latestCapturedImage'))
            if(latestCapturedImage){
              const filteredLatestCapturedImage = latestCapturedImage.find(capture=>capture.project == selectedProject?.uuid )
              if(filteredLatestCapturedImage){
                commit('SET_SCREENSHOT',filteredLatestCapturedImage.image)
              }
              else commit('SET_SCREENSHOT',require('../../assets/images/no-image.jpg')) 
            }
        },

        touchActivity({commit,state}){
            const interval = setInterval(()=>{
                useApollo.activity.touchActivity({projectUid:state.projectUid,activityUid:localStorage.getItem('activityUid')}).then(res=>{
                    console.log(res)
                })
            },60000)
            commit('SET_TOUCH_ACTIVITY_INTERVAL',interval)
        }
    }
}