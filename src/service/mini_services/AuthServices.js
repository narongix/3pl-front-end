import axios from "axios"
import ApiConfig from "../ApiConfig.js"

export default{
    async login(data){
        const response = await axios.post("/login", data, ApiConfig.header({})).catch((e)=>{
            delete e["stack"]
            if(e.response.data){    
                const data = {
                    status:e.response.status,
                    errorMessage: e.response.data.errorMessage
                }
                throw data
            }
            throw e 
        })
        return response.data
    },

    async logout(){
        const response = await axios.post("/logout",{}, ApiConfig.header({}));
        return response.data
    }
}