import gql from 'graphql-tag'

export default {
    TOTAL_TIME_QUERY:gql`
        query totalTime($keyword:String!,$startTime:DateTime!,$endTime:DateTime!){
            me{
            projects(project:{searchKey:UUID,keyword:$keyword}){
            data{
                activities(between:{startTime:$startTime,endTime:$endTime},first:-1){
                total
                data{
                    duration
                }
                }
            }
        }
            }
}`
}