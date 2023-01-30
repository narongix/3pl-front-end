import axios from "axios"
import ApiConfig from "../ApiConfig"

export default{
    async getProducts(offset, limit){
        const res = await axios.get(`/product/list`,ApiConfig.header({
            fields:{
                params:{
                    limit: limit,
                    offset: offset
                }
            }
        }))
        return res.data
    },

    async addOnProduct(product) {
        const res = await axios.post("/product/add", product, ApiConfig.header({myHeaders:{
            "Content-Type": "application/json"
        }}))
        return res.data
    },

    async updateOnProduct(product, id) {
        const res = await axios.patch(`/product/${ id }`, product, ApiConfig.header({myHeaders:{
            "Content-Type": "application/json"
        }}))
        return res.data
    },

    async deleteOnProduct(product) {
        const res = await axios.delete("/product", ApiConfig.header({
            fields:{
                data:product
            }
        }))
        return res.data
    },

    async getProdCategories(offset, limit) {
        const res = await axios.get(`/category`, ApiConfig.header({
            fields:{
                params:{
                    limit: limit,
                    offset: offset
                }
            }
        }))
        return res.data
    },

    async addOnProductCategory(category) {
        const res = await axios.post("/category/add", category, ApiConfig.header({myHeaders:{
            "Content-Type": "application/json"
        }}))
        return res.data
    },

    async updateOnProductCategory(id, category) {
        const res = await axios.patch(`/category/${ id }`, category, ApiConfig.header({myHeaders:{
            "Content-Type": "application/json"
        }}))
        return res.data
    },

    async deleteOnProductCategory(category) {
        const res = await axios.delete("/category", {
            ...ApiConfig.header({}),
            data: category
        })
        return res.data
    }
}