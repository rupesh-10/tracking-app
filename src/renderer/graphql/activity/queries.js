import gql from 'graphql-tag'

export default {
    TOTAL_TIME_QUERY:gql`
        query totalTime($keyword:String!,$startTime:DateTime!,$endTime:DateTime!){
            me{
              duration:activityDuration(project:{searchKey:UUID,keyword:$keyword}, between:{startTime:$startTime,endTime:$endTime})
            }
}`,

  LATEST_SCREEN_CAPTURE:gql`
    query latestScreenCapture($projectUid:String!) {
      me{
      uuid
      name
      activityRecords(activityType:SCREENCAST
        	orderBy: { column: START_TIME, order: DESC}
        	first: 1
          project:{searchKey:UUID,keyword:$projectUid}
      ){
        data{
          record{
            ... on Screencast{
              title
            }
          }
        }
      }
      }
    }
  `
}