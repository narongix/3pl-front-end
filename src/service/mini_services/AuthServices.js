import axios from "axios"
import ApiConfig from "../ApiConfig.js"

export default{
    async login(data){
        const response = await axios.post("/login", data, ApiConfig.header())
        return response.data
    }
}