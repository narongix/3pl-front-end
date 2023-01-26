import axios from "axios"
import ApiConfig from "../ApiConfig.js"


export default{
    async login(data){
        const response = await axios.post("/login", data, ApiConfig.header()).catch((e)=>{
            delete e["stack"]
            if(e.response){
                throw e.response.status
            }
            
            throw e 
        })
        return response.data
    },

    async logout(){
        const response = await axios.post("/logout",{}, ApiConfig.header())
        return response.data
    }
}