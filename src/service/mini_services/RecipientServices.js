import axios from "axios"
import ApiConfig from "../ApiConfig.js"

export default{
    async getRecipients(offset, limit){
        const res = await axios.get(`/user_contacts?offset=${ offset }&limit=${ limit }`, ApiConfig.header())
        return res.data
    }
}