import ApiConfig from "../ApiConfig.js"

export default{
    async getRecipients(params){
        const res = await ApiConfig.getMethods({
            api: "/user_contacts?",
            params:params
        })
        return res.data
    },

    async createRecipient(data){
        const res = await ApiConfig.postMethods({
            api: "/contact",
            data: data,
        })

        return res.data
    }
}