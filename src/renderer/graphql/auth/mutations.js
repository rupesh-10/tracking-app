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
          projectRoles{
            total
            data{
              project{
                uuid
                name
              }
            }
          }
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

startActivity: gql `
mutation startActivity($projectUid:String!) {
  startActivity(projectUid:$projectUid){
    uuid
  }
}
`,

endActivity: gql `
mutation endActivity($projectUid:String!,$activityUid:String!) {
  endActivity(projectUid:$projectUid,activityUid:$activityUid){
    uuid
  }
}
`,

postScreencastActivity:gql`
 mutation postScreencastActivity($activityUid:String!,$startTime:DateTime!,$endTime:DateTime!,$image:Upload!){
    postScreencastActivity(activityUid:$activityUid,input:{startTime:$startTime,endTime:$endTime,image:$image},meta:{mouseMoves:10,keyClicks:10}){
      startedAt
   }
 }
`
}