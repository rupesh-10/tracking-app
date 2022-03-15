import apolloProvider from '../../vue-apollo'
import mutation from './mutations'
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
}    