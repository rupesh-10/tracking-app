import {formatDate,fancyTimeFormat} from '../../const/timer'
import useApollo from '../../graphql/useApollo'
const activeWindow = require('active-win');

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
        }
    },
    actions:{
          saveScreenshot({state,dispatch},image){
            function urltoFile(url, filename, mimeType){
                return (fetch(url)
                    .then(function(res){return res.arrayBuffer();})
                    .then(function(buf){return new File([buf], filename,{type:mimeType});})
                );
            }

            if(state.online){
               urltoFile(image,'screenshot.png','image/png').then(file=>{
                   const currentTime = new Date()
                    useApollo.auth.postScreencastActivity({activityUid:localStorage.getItem('activityUid'),startTime:formatDate(currentTime),endTime:formatDate(currentTime),image:file,keyClicks:parseInt(localStorage.getItem('keyboardEvent')),mouseMoves:parseInt(localStorage.getItem('mouseEvent'))}).then(()=>{
                        localStorage.removeItem('keyboardEvent')
                        localStorage.removeItem('mouseEvent')
                        if(state.trackingOn){
                        localStorage.setItem('keyboardEvent',1)
                        localStorage.setItem('mouseEvent',1)
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
          dispatch('setLatestCaptured',image)
          
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

        startActivity({dispatch}){
            const project = JSON.parse(localStorage.getItem('selectedProject'))
            dispatch('checkAppsAndWebsites')
            useApollo.auth.startActivity({projectUid:project.uuid}).then(res=>{
                localStorage.setItem('activityUid',res.data.startActivity.uuid)
                localStorage.setItem('keyboardEvent',1)
                localStorage.setItem('mouseEvent',1)
            })
        },
        endActivity({dispatch,state}){
            const project = JSON.parse(localStorage.getItem('selectedProject'))
            useApollo.auth.endActivity({projectUid:project.uuid,activityUid:localStorage.getItem('activityUid')}).then(()=>{
                localStorage.removeItem('activityUid')
                localStorage.removeItem('keyboardEvent')
                localStorage.removeItem('mouseEvent')
                localStorage.removeItem('appAndWebsiteUsed')
                dispatch('getTotalTodayTime')
                dispatch('getTotalWeeksTime')
                dispatch('setAppWebsiteTime')
                if(state.checkAppsAndWebsitesInterval) clearInterval(state.checkAppsAndWebsitesInterval)
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
                localStorage.setItem('todaysTotalTime',JSON.stringify(fancyTimeFormat(res.data.me.duration)))
                commit('SET_TODAYS_TIME',fancyTimeFormat(res.data.me.duration))
            })

        },
        getTotalWeeksTime({commit}){
            const project = JSON.parse(localStorage.getItem('selectedProject'))
            const currentTime = new Date()
            const weekFirstDay = currentTime.getDate() - currentTime.getDay();
            const weeksTime = new Date(currentTime.setDate(weekFirstDay)).setHours(0,0,0,0)
            useApollo.auth.getTotalTime({keyword:project.uuid,startTime:formatDate(new Date(weeksTime)),endTime:formatDate(new Date())}).then(res=>{
                localStorage.setItem('weeksTotalTime',JSON.stringify(fancyTimeFormat(res.data.me.duration)))
                commit('SET_WEEKS_TIME',fancyTimeFormat(res.data.me.duration))
            })
        },

        checkAppsAndWebsites({commit}){
            const interval = setInterval(
                    async () =>{
                        const source = await activeWindow()
                        const storageApplication=localStorage.getItem('appAndWebsiteUsed')
                        var lastApplicationInfo=null;
                        if(storageApplication!=null)
                            lastApplicationInfo=JSON.parse(storageApplication)
                        if(lastApplicationInfo!=null && lastApplicationInfo.id!=source.owner.processId){
                            //Check if browser was visited
                            if(lastApplicationInfo.url!=null && lastApplicationInfo.url==source.url){
                                return;
                            }
                            const activeDuration=(new Date().getTime() - lastApplicationInfo.start_time)/1000

                            if(activeDuration>15){
                                if(lastApplicationInfo.url!=null){
                                    console.log('Push to the server : ',lastApplicationInfo.url," using ",lastApplicationInfo.name,' after ', activeDuration)

                                } else{
                                    console.log('Push to the server',lastApplicationInfo.name,' after ', activeDuration)

                                }
                            }else {
                                if(lastApplicationInfo.url!=null){
                                    console.log('Discard : ',lastApplicationInfo.url," using ",lastApplicationInfo.name,' after ', activeDuration)

                                } else{
                                    console.log('Discard ',lastApplicationInfo.name,' after ', activeDuration)

                                }
                            }
                            localStorage.removeItem("appAndWebsiteUsed")
                        } else if(lastApplicationInfo==null){
                            const appAndWebsiteUsed = 
                                {
                                    id: source.owner.processId,
                                    name:source.owner.name,
                                    start_time:new Date().getTime(),
                                    url: source.url
                                }
                            
                            localStorage.setItem('appAndWebsiteUsed',JSON.stringify(appAndWebsiteUsed))
                        }
                    },
                        1000
                    )
            commit('UPDATE_CHECK_APPS_AND_WEBSITES_INTERVAL',interval) 
        },
        setAppWebsiteTime(){
            // const appAndWebsiteUsed = localStorage.getItem('appAndWebsiteUsed')
            // const project = localStorage.getItem('selectedProject')
            // useApollo.setAppWebsiteTime({activityUid:project}).then(res=>{
            //     console.log(res)
            // })

        },
        setLatestCaptured({commit},image){
            console.log(image)
            const project = JSON.parse(localStorage.getItem('selectedProject'))
            if(localStorage.getItem('latestCapturedImage')){
                let latestCaptured = JSON.parse(localStorage.getItem('latestCapturedImage'))
                let foundProject = null
                latestCaptured.forEach((capture,index)=>{
                    if(capture.project == project.uuid){
                        foundProject = index
                    }
                })
                if(foundProject) latestCaptured[foundProject].image = image
                else {
                     latestCaptured.push({
                        project:project.uuid,
                        image:image
                    })
                }
                localStorage.setItem('latestCapturedImage',JSON.stringify(latestCaptured))
            }
            else{
                const latestCaptured = [{
                    project:project.uuid,
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
              console.log(filteredLatestCapturedImage)
              if(filteredLatestCapturedImage){
                commit('SET_SCREENSHOT',filteredLatestCapturedImage.image)
              }
              else commit('SET_SCREENSHOT',require('../../assets/images/no-image.jpg')) 
            }
        },
    }
}