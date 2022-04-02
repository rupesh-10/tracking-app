import gql from 'graphql-tag'

export default {
    TOTAL_TIME_QUERY:gql`
        query totalTime($keyword:String!,$startTime:DateTime!,$endTime:DateTime!){
            me{
              duration:activityDuration(project:{searchKey:UUID,keyword:$keyword}, between:{startTime:$startTime,endTime:$endTime})
            }
}`
}