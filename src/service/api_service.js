import axios from "axios"

export default {
    async getProducts(offset, limit){
        const string = `list?offset=${ offset }&limit=${ limit }`
        console.log("stringgg: "+string)
        const res = await axios.get(`/product/${string}`, header())
        return res.data
    },

    async getTransfers(offset, limit) {
        const res = await axios.get(`/transfer?offset=${ offset }&limit=${ limit }`, header())
        return res.data
    },

    async createTransfer(transfer){
        let res = await axios.post("/transfer",transfer,header({
            "Content-Type": "application/json"
        }))
        return res
    },

    async getTransferDetails(id) {
        const res = await axios.get("/transfer/details?transferId="+id, header())
        return res.data;
    }, 

    async updateTransfer(data, id){
        const res = await axios.patch(`/transfer/${ id }`, data, header({
            "Content-Type": "application/json"
        }))
        return res.data
    },

    async deleteTransfer(data){
        const res = await axios.delete("/transfer",{
            ...header(),
            data: data
        })
        return res.data
    },

    async getTransferTypes(){
        const res = await axios.get("/transfer_types", header())
        return res.data
    },

    async getRecipients(offset, limit){
        const res = await axios.get(`/user_contacts?offset=${ offset }&limit=${ limit }`, header())
        return res.data
    }
}


function header(myHeaders){
    return {
        baseURL: process.env.VUE_APP_API_BASE_URL,
        headers:{
            ...myHeaders,
            "Authorization": "Bearer "+ localStorage.getItem("accessToken")
        } 
    }
}