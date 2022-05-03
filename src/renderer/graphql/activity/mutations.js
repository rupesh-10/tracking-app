import gql from 'graphql-tag'
export default{
startActivity: gql `
mutation startActivity($projectUid:String!,$startTime:DateTime) {
  startActivity(projectUid:$projectUid,startTime:$startTime){
    uuid
    startedAt
  }
}
`,

endActivity: gql `
mutation endActivity($projectUid:String!,$activityUid:String!) {
  endActivity(projectUid:$projectUid,activityUid:$activityUid){
    uuid
    startedAt
    endedAt
  }
}
`,

postScreencastActivity:gql`
 mutation postScreencastActivity($activityUid:String!,$startTime:DateTime!,$endTime:DateTime!,$images:[Upload!]!,$mouseMoves:Int!,$keyClicks:Int!){
    postScreencastActivity(activityUid:$activityUid,input:{startTime:$startTime,endTime:$endTime,images:$images},meta:{mouseMoves:$mouseMoves,keyClicks:$keyClicks}){
      startedAt
   }
 }
`,

postAppActivity:gql`
  mutation postApplicationActivity($activityUid:String!,$startTime:DateTime!,$endTime:DateTime!,$name:String!,$mouseMoves:Int!,$keyClicks:Int!,$idleTime:Int){
    postApplicationActivity(activityUid:$activityUid,input:{name:$name,startTime:$startTime,endTime:$endTime},meta:{mouseMoves:$mouseMoves,keyClicks:$keyClicks,idleTime:$idleTime}){
      startedAt
      endedAt
    }
  }
`,

postWebActivity:gql`
  mutation postWebsiteActivity($activityUid:String!,$startTime:DateTime!,$endTime:DateTime!,$name:String!,$url:String!,$mouseMoves:Int!,$keyClicks:Int!,$idleTime:Int){
    postWebsiteActivity(activityUid:$activityUid,input:{name:$url,browser:$name,startTime:$startTime,endTime:$endTime},meta:{mouseMoves:$mouseMoves,keyClicks:$keyClicks,idleTime:$idleTime}){
      startedAt
      endedAt
    }
  }
`,
touchActivity:gql`
mutation TouchActivity($projectUid:String!,$activityUid:String!){
  touchActivity(projectUid:$projectUid,activityUid:$activityUid){
    completed
    startedAt
    endedAt
    duration
    idleDuration
  }
}
`
}