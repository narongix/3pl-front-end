import ApiConfig from "../ApiConfig";

export default{
    async onFetchBillingList(params){
        const res = await ApiConfig.getMethods({
            api: '/bill',
            params:params
        });

        return res.data ?? [];
    },

    async onFetchDetailBilling(params){
        const res = await ApiConfig.getMethods({
            api: "bill_detail",
            params:params
        });
        return res.data
    },

    async getTransferTrx(params){
        const res = await ApiConfig.getMethods({
            api: "bill_detail/transfers_trx",
            params:params,
        });

        return res.data;
    },

    async getVolumeTotal(params){
        const res = await ApiConfig.getMethods({
            api: "bill_detail/volume_trx",
            params: params
        });

        return res.data;
    },

    async getVolumeByDate(params){
        const res = await ApiConfig.getMethods({
            api: "bill_detail/volume_trx/product",
            params:params
        });

        return res.data;
    }
}