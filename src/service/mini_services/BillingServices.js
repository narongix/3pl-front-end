import ApiConfig from "../ApiConfig";

export default{
    async onFetchBillingList({offset, limit, userId}){
        const res = await ApiConfig.getMethods({
            api: '/bill',
            params:{
                offset: offset,
                limit: limit,
                user_id: userId
            }
        });

        return res.data ?? [];
    },

    async onFetchDetailBilling({userId, month, year}){
        const res = await ApiConfig.getMethods({
            api: "bill_detail",
            params:{
                user_id: userId,
                month: month,
                year: year,
            }
        });
        return res.data
    },

    async getTransferTrx({month, year, transferType}){
        const res = await ApiConfig.getMethods({
            api: "bill_detail/transfers_trx",
            params:{
                month: month,
                year: year,
                transfer_type: transferType
            }
        });

        return res.data;
    }
}