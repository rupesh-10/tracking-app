import apolloProvider from '../../vue-apollo'
import mutation from './mutations'
import queries from './queries'
// import queries from './queries'

export default {
    login(data) {
        return apolloProvider.mutate({
          mutation: mutation.LOGIN,
          variables: {
            ...data,
          },
        })
      },
      logout() {
        return apolloProvider.mutate({
          mutation: mutation.LOGOUT,
        })
      },
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
      }
}    