import axios from "axios"
import ApiConfig from "../ApiConfig.js"

export default{
    async getRecipients(offset, limit, filter){
        const res = await axios.get(`/user_contacts?offset=${ offset }&limit=${ limit }&search_string=${ filter }`, ApiConfig.header())
        return res.data
    }
}