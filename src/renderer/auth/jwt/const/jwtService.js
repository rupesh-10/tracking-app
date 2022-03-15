import jwtDefaultConfig from './jwtDefaultConfig'
export default class JwtService {
    jwtConfig = { ...jwtDefaultConfig };
  
    login(){
        
    }

    getToken() {
        return localStorage.getItem(this.jwtConfig.storageTokenKeyName)
      }    
    
    setToken(value) {
        localStorage.setItem(this.jwtConfig.storageTokenKeyName, value)
    }
}