import axios from "axios"
import ApiConfig from "../ApiConfig.js"

export default{
    async getTransfers(params) {
        const res = await axios.get(`/transfer`, ApiConfig.header({
            myHeaders:{
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            fields:{
                arams:params 
            }
        }))

        return res.data
    },

    async createTransfer(transfer){
        let res = await axios.post("/transfer",transfer,ApiConfig.header({
            myHeaders:{
                "Content-Type": "application/json"
            }
        }))
        return res.data
    },

    async getTransferDetails(id) {
        const res = await axios.get("/transfer/details?transferId="+id, ApiConfig.header({}))
        return res.data;
    }, 

    async updateTransfer(data, id){
        const res = await axios.patch(`/transfer/${ id }`, data, ApiConfig.header({
            myHeaders:{
                "Content-Type": "application/json"
            }
        }))
        return res.data
    },

    async deleteTransfer(data){
        const res = await axios.delete("/transfer",ApiConfig.header({
            fields:{
                data:data
            }
        }))
        return res.data
    },

    async getTransferTypes(){
        const res = await axios.get("/transfer_types", ApiConfig.header({}))
        return res.data
    },
}
