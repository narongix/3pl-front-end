import axios from "axios"
import ApiConfig from "../ApiConfig"

export default{
    async getProducts(offset, limit, myProductName){
        const res = await axios.get(`/product/list?limit=${ limit }&offset=${ offset }&product_name=${ myProductName }`,ApiConfig.header())
        return res.data
    }
}