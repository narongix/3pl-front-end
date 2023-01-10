import axios from "axios"
import ApiConfig from "../ApiConfig.js"

export default{
    async getTransfers(offset, limit) {
        const res = await axios.get(`/transfer?offset=${ offset }&limit=${ limit }`, ApiConfig.header())
        return res.data
    },

    async createTransfer(transfer){
        let res = await axios.post("/transfer",transfer,ApiConfig.header({
            "Content-Type": "application/json"
        }))
        return res.data
    },

    async getTransferDetails(id) {
        const res = await axios.get("/transfer/details?transferId="+id, ApiConfig.header())
        return res.data;
    }, 

    async updateTransfer(data, id){
        const res = await axios.patch(`/transfer/${ id }`, data, ApiConfig.header({
            "Content-Type": "application/json"
        }))
        return res.data
    },

    async deleteTransfer(data){
        const res = await axios.delete("/transfer",{
            ...ApiConfig.header(),
            data: data
        })
        return res.data
    },

    async getTransferTypes(){
        const res = await axios.get("/transfer_types", ApiConfig.header())
        return res.data
    },
}
