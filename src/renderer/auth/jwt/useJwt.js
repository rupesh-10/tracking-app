import useJwt from './const/useJwt'
import axios from 'axios'

const { jwt } = useJwt(axios, {})
export default jwt
