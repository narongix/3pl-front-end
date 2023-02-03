import ApiConfig from "../ApiConfig.js"

export default{
    async getRecipients(offset, limit, filter){
        const res = await ApiConfig.getMethods({
            api: "/user_contacts?",
            params:{
                offset: offset,
                limit:limit,
                search_string:filter
            }
        })
        return res.data
    },

    async createRecipient(data){
        const res = await ApiConfig.postMethods({
            api: "/contact",
            data:data,
        })

        return res.data
    }
}