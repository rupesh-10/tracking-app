import Vue from 'vue'
import VueApollo from 'vue-apollo'
import { ApolloClient } from 'apollo-client'
import { setContext } from 'apollo-link-context'
import jwtDefaultConfig from './auth/jwt/const/jwtDefaultConfig'
// import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createUploadLink } from 'apollo-upload-client'

const graphqlURL = "http://gec-workplace.test/graphql"

const cache = new InMemoryCache()
// const { typeDefs } = require('./server-schema')

Vue.use(VueApollo)
const AUTH_TOKEN = 'accessToken'

const httpLink = createUploadLink({
  uri: graphqlURL,
})

const authLink = setContext(async (_, { headers }) => {
  // Use your async token function here:
  const token = await localStorage.getItem(AUTH_TOKEN)
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: `${jwtDefaultConfig.tokenType} ${token}` || '',
    },
  }
})

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,

})

export default apolloProvider.defaultClient
