import gql from 'graphql-tag'

export default {
  LOGIN: gql`
    mutation login($username: String!, $password: String!) {
      login(input: { username: $username, password: $password }) {
        access_token
        refresh_token
        expires_in
        user {
          id
          name
        }
      }
    }
  `,
  LOGOUT: gql`
  mutation logout {
    logout {
      status
      message
    }
  }
`,
}