const moment = require('moment')
import store from '../store'
export default {
    
     startActivity(uuid){
        localStorage.removeItem('appAndWebsiteUsed')
        localStorage.setItem('activityUid',uuid)
        localStorage.setItem('keyboardEvent',1)
        localStorage.setItem('mouseEvent',1)
        localStorage.setItem('screenKeyboardEvent',1)
        localStorage.setItem('screenMouseEvent',1)
        store.dispatch('timer/touchActivity')
        console.log(store)
        store.dispatch('timer/checkAppsAndWebsites')
        store.commit('timer/SET_ACTIVITY_IDLE_TIME',0);
        store.commit('timer/SET_LAST_INACTIVITY',0);

    },
    offlineStartActivity(){
        const randToken = Math.random().toString(36).substr(2);
        const startActivity = {activityUid:randToken,started_at:moment()}
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
               localStorage.setItem('offlineActiviyt',JSON.stringify(onlineStartedOfflineActivity))
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
                if(activity.ended_at){
                    console.log(activity)
                }
            })
         }
    }

}