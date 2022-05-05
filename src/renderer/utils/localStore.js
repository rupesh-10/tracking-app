const moment = require('moment')
import store from '../store'
import {formatDate} from '../const/timer'
import useApollo from '../graphql/useApollo'

export default {
    
     startActivity(uuid){
        localStorage.removeItem('activityUid')
        localStorage.removeItem('appAndWebsiteUsed')
        localStorage.removeItem('startTimeForCapture')

        localStorage.setItem('activityUid',uuid)
        localStorage.setItem('keyboardEvent',1)
        localStorage.setItem('mouseEvent',1)
        localStorage.setItem('screenKeyboardEvent',1)
        localStorage.setItem('screenMouseEvent',1)
    
        store.dispatch('timer/touchActivity')
        store.commit('timer/SET_ACTIVITY_IDLE_TIME',0);
        store.commit('timer/SET_LAST_INACTIVITY',0);
        store.dispatch('timer/checkAppsAndWebsites')

    },
    offlineStartActivity(){
        const randToken = Math.random().toString(36).substr(2);
        const startActivity = {projectUid:JSON.parse(localStorage.getItem('selectedProject')).uuid,activityUid:randToken,started_at:formatDate(moment())}
        if(localStorage.getItem('offlineActivity')){
            let offlineActivity = JSON.parse(localStorage.getItem('offlineActivity'))
            offlineActivity.push(startActivity)
            localStorage.setItem('offlineActivity',JSON.stringify(offlineActivity))
        }
        else{
            localStorage.setItem('offlineActivity',JSON.stringify([startActivity]))
        }
        this.startActivity(randToken)
    },
    endActivity(){
        localStorage.removeItem('activityUid')
        localStorage.removeItem('keyboardEvent')
        localStorage.removeItem('mouseEvent')
        localStorage.removeItem('screenKeyboardEvent')  
        localStorage.removeItem('screenMouseEvent')
        localStorage.removeItem('appAndWebsiteUsed')
        localStorage.removeItem('startTimeForCapture')
    },
    offlineEndActivity(){
        const offlineActivity = JSON.parse(localStorage.getItem('offlineActivity'))
        const currentActivity = localStorage.getItem('activityUid')
        if(offlineActivity){
        let foundActivity = offlineActivity.find(activity => activity.activityUid == currentActivity)
        if(foundActivity)foundActivity.ended_at = formatDate(moment())
        localStorage.setItem('offlineActivity',JSON.stringify(offlineActivity))
        } 
        else{
           this.setOnlineStartedOfflineActivity(null,'endactivity')
        }
    },

    screenCast(){
        localStorage.setItem('screenKeyboardEvent',1)
        localStorage.setItem('screenMouseEvent',1)
    },

    offlineScreenCast(data){
        const offlineActivity = JSON.parse(localStorage.getItem('offlineActivity'))
        const currentActivity = localStorage.getItem('activityUid')
        if(offlineActivity){
           let foundActivity = offlineActivity.find(activity => activity.activityUid == currentActivity)
           if(foundActivity){
               let screenCasts = foundActivity.screenCasts
               if(screenCasts){
                   screenCasts.push(data)
               }
               else{
                   foundActivity.screenCasts = [data]
               }
           }
           else{
               this.setOnlineStartedOfflineActivity(data,'screencast')
           }
            localStorage.setItem('offlineActivity',JSON.stringify(offlineActivity))
            this.screenCast()
        } 
    },
    setOnlineStartedOfflineActivity(data,type){
        let onlineStartedOfflineActivity = JSON.parse(localStorage.getItem('onlineStartedOfflineActivity'))
        const currentActivity = localStorage.getItem('activityUid')
        if(onlineStartedOfflineActivity){
            let foundActivity = onlineStartedOfflineActivity.find(activity => activity.activityUid == currentActivity)
            if(foundActivity){
                let screenCasts = foundActivity.screenCasts
                let appActivities = foundActivity.appActivities
                let webActivities = foundActivity.webActivities
                switch(type){
                    case 'screencast':
                        if(screenCasts){
                            screenCasts.push(data)
                        }
                        else{
                            foundActivity.screenCasts = [data]
                        }
                        break;
                    
                    case 'app':
                        if(appActivities){
                            appActivities.push(data)
                        }
                        else{
                            foundActivity.appActivities = [data]
                        }
                        break;
                    
                    case 'website':
                        if(webActivities){
                            webActivities.push(data)
                        }
                        else{
                            foundActivity.webActivities = [data]
                        }
                        break;

                    case 'endactivity':
                        foundActivity.end_time = formatDate(moment())
                        break;
                }
               
            }
            localStorage.setItem('onlineStartedOfflineActivity',JSON.stringify(onlineStartedOfflineActivity))
        }
        else{
            switch(type){
                case 'screencast':
                     onlineStartedOfflineActivity = [{projectUid:JSON.parse(localStorage.getItem('selectedProject')).uuid,activityUid:currentActivity,screenCasts:[data]}]
                    localStorage.setItem('onlineStartedOfflineActivity',JSON.stringify(onlineStartedOfflineActivity))
                    break;

                case 'app':
                     onlineStartedOfflineActivity = [{projectUid:JSON.parse(localStorage.getItem('selectedProject')).uuid,activityUid:currentActivity,appActivities:[data]}]
                    localStorage.setItem('onlineStartedOfflineActivity',JSON.stringify(onlineStartedOfflineActivity))
                    break;
                
                case 'website':
                     onlineStartedOfflineActivity = [{projectUid:JSON.parse(localStorage.getItem('selectedProject')).uuid,activityUid:currentActivity,webActivities:[data]}]
                    localStorage.setItem('onlineStartedOfflineActivity',JSON.stringify(onlineStartedOfflineActivity))
                    break;
                case 'endactivity':
                    onlineStartedOfflineActivity = [{projectUid:JSON.parse(localStorage.getItem('selectedProject')).uuid,activityUid:currentActivity,end_time:formatDate(moment())}]
                    localStorage.setItem('onlineStartedOfflineActivity',JSON.stringify(onlineStartedOfflineActivity))
                    break;
            }
            
        }
    },

    appActivity(){
        localStorage.setItem('keyboardEvent',1)
        localStorage.setItem('mouseEvent',1)
    },

    offlineAppActivity(data){
        const offlineActivity = JSON.parse(localStorage.getItem('offlineActivity'))
        const currentActivity = localStorage.getItem('activityUid')
        if(offlineActivity){
           let foundActivity = offlineActivity.find(activity => activity.activityUid == currentActivity)
           if(foundActivity){
               let appActivities = foundActivity.appActivities
               if(appActivities){
                appActivities.push(data)
               }
               else{
                   foundActivity.appActivities = [data]
               }
           }
           else{
            this.setOnlineStartedOfflineActivity(data,'app')
           }
            localStorage.setItem('offlineActivity',JSON.stringify(offlineActivity))
        } 
    },

    offlineWebActivity(data){
        const offlineActivity = JSON.parse(localStorage.getItem('offlineActivity'))
        const currentActivity = localStorage.getItem('activityUid')
        if(offlineActivity){
           let foundActivity = offlineActivity.find(activity => activity.activityUid == currentActivity)
           if(foundActivity){
               let webActivities = foundActivity.webActivities
               if(webActivities){
                webActivities.push(data)
               }
               else{
                   foundActivity.webActivities = [data]
               }
           }
           else{
            this.setOnlineStartedOfflineActivity(data,'website')
           }
            localStorage.setItem('offlineActivity',JSON.stringify(offlineActivity))
            this.screenCast()
        } 
    },

    async postOfflineActivity(){
        const offlineActivity = JSON.parse(localStorage.getItem('offlineActivity'))
        if(offlineActivity){
            offlineActivity.forEach((activity,activityIndex)=>{
                useApollo.activity.startActivity({projectUid:activity.projectUid,startTime:activity.started_at}).then(res=>{
                const startActivityUuid = res.data.startActivity.uuid
                if(!activity.ended_at){
                    localStorage.setItem('activityUid',startActivityUuid)
                }
                if(activity.screenCasts){
                    activity.screenCasts.forEach(async (screenCast,screenCastIndex)=>{
                        const screenCaptureImages = screenCast.images
                        function urltoFile(fileUrl, filename, mimeType){
                            return (fetch(fileUrl)
                                .then(function(res){return res.arrayBuffer();})
                                .then(function(buf){return new File([buf], filename,{type:mimeType});})
                            );
                        }
                        let convertedImages = []
                       await screenCaptureImages.forEach(async (image,index)=>{
                            await urltoFile(image,'screenshot'+index,'image/png').then(async(file)=>{
                               convertedImages.push(file)
                               if(index == screenCaptureImages.length-1){
                                   const data = {activityUid:startActivityUuid,startTime:screenCast.startTime,endTime:screenCast.endTime,images:convertedImages,keyClicks:screenCast.keyClicks,mouseMoves:screenCast.mouseMoves}
                                   await useApollo.activity.postScreencastActivity(data).then(()=>{
                                        offlineActivity[activityIndex].screenCasts.splice(screenCastIndex)
                                        checkEmptyActivity(activityIndex)
                                   })
                               }
       
                           })
                       })
                        // useApollo.activity.postScreencastActivity({activityUid:startActivityUuid,startTime:screenCast.startTime,endTime:screenCast.endTime,images:screenCast.images,mouseMoves:screenCast.mouseMoves,keyClicks:screenCast.keyClicks}).then(()=>{})
                    })
                }
                    if(activity.appActivities){
                    activity.appActivities.forEach((appActivity,appIndex)=>{
                        useApollo.activity.setAppActivity({activityUid:startActivityUuid,name:appActivity.name,startTime:appActivity.startTime,endTime:appActivity.endTime,idleTime:appActivity.idleTime,keyClicks:appActivity.keyClicks,mouseMoves:appActivity.mouseMoves}).then(()=>{
                            offlineActivity[activityIndex].appActivities.splice(appIndex)
                            checkEmptyActivity(activityIndex)

                        })
                    })
                }

                    if(activity.webActivities){
                    activity.webActivities.forEach((webActivity,webIndex)=>{
                        useApollo.activity.setWebActivity({activityUid:startActivityUuid,name:webActivity.url,startTime:webActivity.startTime,endTime:webActivity.endTime,idleTime:webActivity.idleTime,keyClicks:webActivity.keyClicks,mouseMoves:webActivity.mouseMoves}).then(()=>{
                            offlineActivity[activityIndex].webActivities.splice(webIndex)
                            checkEmptyActivity(activityIndex)

                        })
                    })
                }
                function checkEmptyActivity(activityIndex){
                    const activity = offlineActivity[activityIndex]
                    console.log((activity.screenCasts.length===0) && (!activity.appActivities || activity.appActivities.length===0) && (!activity.webActivities ||activity.webActivities.length===0)  )
                    if((activity.screenCasts.length===0) && (!activity.appActivities || activity.appActivities.length===0) && (!activity.webActivities ||activity.webActivities.length===0)){
                        if(activity.ended_at){
                            useApollo.activity.endActivity({projectUid:activity.projectUid,activityUid:startActivityUuid,endTime:activity.ended_at})
                        }
                        offlineActivity.splice(activityIndex)
                    }
                    if(offlineActivity.length===0){
                        localStorage.removeItem('offlineActivity')
                    }
                    else{
                        localStorage.setItem('offlineActivity',JSON.stringify(offlineActivity))
                    }
    
                    }
                })
            })
         }
    },

    postOnlineCreatedOfflineActivity(){
        const onlineStartedOfflineActivity = JSON.parse(localStorage.getItem('onlineStartedOfflineActivity'))
        if(onlineStartedOfflineActivity){
            onlineStartedOfflineActivity.forEach((activity)=>{
                    const startActivityUuid = activity.activityUid
                    activity.screenCasts.forEach((screenCast)=>{
                        const screenCaptureImages = screenCast.images
                        function urltoFile(fileUrl, filename, mimeType){
                            return (fetch(fileUrl)
                                .then(function(res){return res.arrayBuffer();})
                                .then(function(buf){return new File([buf], filename,{type:mimeType});})
                            );
                        }
                        let convertedImages = []
                        screenCaptureImages.forEach((image,index)=>{
                            urltoFile(image,'screenshot'+index,'image/png').then(file=>{
                               convertedImages.push(file)
                               if(index == screenCaptureImages.length-1){
                                   const data = {activityUid:startActivityUuid,startTime:screenCast.startTime,endTime:screenCast.endTime,images:convertedImages,keyClicks:screenCast.keyClicks,mouseMoves:screenCast.mouseMoves}
                                    useApollo.activity.postScreencastActivity(data).then(()=>{
                                      
                                   })
                               }
       
                           })
                       })
                        // useApollo.activity.postScreencastActivity({activityUid:startActivityUuid,startTime:screenCast.startTime,endTime:screenCast.endTime,images:screenCast.images,mouseMoves:screenCast.mouseMoves,keyClicks:screenCast.keyClicks}).then(()=>{})
                    })
                    activity.appActivities.forEach((appActivity)=>{
                        useApollo.activity.setAppActivity({activityUid:startActivityUuid,name:appActivity.name,startTime:appActivity.startTime,endTime:appActivity.endTime,idleTime:appActivity.idleTime,keyClicks:appActivity.keyClicks,mouseMoves:appActivity.mouseMoves}).then(()=>{})
                    })
                    activity.webActivities.forEach((webActivity)=>{
                        useApollo.activity.setWebActivity({activityUid:startActivityUuid,name:webActivity.url,startTime:webActivity.startTime,endTime:webActivity.endTime,idleTime:webActivity.idleTime,keyClicks:webActivity.keyClicks,mouseMoves:webActivity.mouseMoves}).then(()=>{})
                    })
            })
         }
    },

    checkOfflineActivity(){
        this.postOfflineActivity()
        this.postOnlineCreatedOfflineActivity()
    },
    

}