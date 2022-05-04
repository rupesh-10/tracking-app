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
        const startActivity = {activityUid:randToken,started_at:formatDate(moment())}
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
        if(foundActivity)foundActivity.ended_at = moment()
        localStorage.setItem('offlineActivity',JSON.stringify(offlineActivity))
        } 
        else{
            const onlineActivity =  {activityUid:currentActivity,ended_at:moment()}
            localStorage.setItem('onlineActivity',JSON.stringify([onlineActivity]))
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
               const onlineStartedOfflineActivity = {activityUid:currentActivity,screenCasts:[data]}
               localStorage.setItem('offlineActivity',JSON.stringify(onlineStartedOfflineActivity))
           }
            localStorage.setItem('offlineActivity',JSON.stringify(offlineActivity))
            this.screenCast()
        } 
    },

    appActivity(){
        localStorage.setItem('keyboardEvent',1)
        localStorage.setItem('mouseEvent',1)
    },

    offlineAppActivity(data){
        console.log('hehehehhehee')
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
            localStorage.setItem('offlineActivity',JSON.stringify(offlineActivity))
            this.screenCast()
        } 
    },


    checkOfflineActivity(){
        const offlineActivity = JSON.parse(localStorage.getItem('offlineActivity'))
        if(offlineActivity){
            offlineActivity.forEach((activity)=>{
                useApollo.activity.startActivity({projectUid:JSON.parse(localStorage.getItem('selectedProject')).uuid,startTime:activity.started_at}).then(res=>{
                    const startActivityUuid = res.data.startActivity.uuid
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
                                      console.log("hi")
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
            })
         }
    }

}