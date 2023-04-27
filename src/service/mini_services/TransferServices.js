import ApiConfig from "../ApiConfig.js"

export default{
    async getTransfers(params) {
        const res = await ApiConfig.getMethods({
            api: "/transfer",
            contentType: "application/x-www-form-urlencoded",
            params: params
        })
        return res.data
    },

    async createTransfer(transfer){
        const res = await ApiConfig.postMethods({
            api: "/transfer",
            data: transfer,
            contentType: "application/json"
        })
        return res.data
    },

    async getTransferDetails(id) {
        const res = await ApiConfig.getMethods({
            api: "/transfer/details",
            params:{
                transferId: id
            }
        })
        return res.data;
    }, 

    async getOperationTransfer(param){
        const res = await ApiConfig.getMethods({
            api: "/transfer/operations",
            params: param
        });

        return res.data;
    },

    async updateTransfer(data, id, params){
        const res = await ApiConfig.patchMethods({
            api: `/transfer/${ id }`,
            data: data,
            params: params,
            contentType: "application/json"
        })
        return res.data
    },

    async deleteTransfer(data){
        const res = await ApiConfig.deleteMethods({
            api: "/transfer",
            data: data
        })
        return res.data
    },

    async getTransferTypes(){
        const res = await ApiConfig.getMethods({
            api: "/transfer_types"
        })
        return res.data
    },

    async getTransferTotalRecords(params){
        const res = await ApiConfig.getMethods({
            api: "/transfer/total",
            params: params
        });
        return res.data;
    }
}
