import apolloProvider from '../../vue-apollo'
import mutation from './mutations'
import queries from './queries'
export default{
startActivity(data){
    return apolloProvider.mutate({
      mutation:mutation.startActivity,
      variables:{
        ...data,
      }
    })
  },
  endActivity(data){
    return apolloProvider.mutate({
      mutation:mutation.endActivity,
      variables:{
        ...data
      }
    })
  },
  postScreencastActivity(data){
    return apolloProvider.mutate({
      mutation:mutation.postScreencastActivity,
      context: {
        hasUpload: true // Important!
      },
      variables:{
        ...data
      }
    })
  },
  getTotalTime(data){
    return apolloProvider.query({
      fetchPolicy: 'no-cache',
      query:queries.TOTAL_TIME_QUERY,
      variables:{ 
        ...data
      }
    })
  },
  setAppActivity(data){
    return apolloProvider.mutate({
      mutation:mutation.postAppActivity,
      variables:{
        ...data
      }
    })
  },
  setWebActivity(data){
    return apolloProvider.mutate({
    mutation:mutation.postWebActivity,
    variables:{
      ...data
    }
  })
  },

  touchActivity(data){
      return apolloProvider.mutate({
          mutation:mutation.touchActivity,
          variables:{
              ...data
          }
      })
  },
  getLatestScreenCapture(data){
    return apolloProvider.query({
      query:queries.LATEST_SCREEN_CAPTURE,
      variables:{
        ...data
      }
    })
  }
}