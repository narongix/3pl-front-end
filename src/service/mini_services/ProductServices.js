import axios from "axios"
import ApiConfig from "../ApiConfig"

export default{
    async getProducts(offset, limit){
        const res = await axios.get(`/product/list?limit=${ limit }&offset=${ offset }&product_name=`,ApiConfig.header())
        return res.data
    }
}