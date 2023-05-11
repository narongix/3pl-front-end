import axios from "axios"
import ApiConfig from "../ApiConfig.js"

export default{
    async login(data){
        const response = await ApiConfig.postMethods({api: "/login", data: data});
        return response.data
    },

    async logout(){
        const response = await axios.post("/logout",{}, ApiConfig.header({}));
        return response.data
    }
}