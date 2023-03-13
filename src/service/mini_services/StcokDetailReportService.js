import ApiConfig from "../ApiConfig";

export default {
    async onFetchStockReportTotal({params}){
        const res = await ApiConfig.getMethods({
            api: "/stock_detailed_total",
            params: params,
        });
        return res.data;
    },

    async getStockedDetailReport({params}){
        const res = await ApiConfig.getMethods({
            api: "/stock_detailed",
            params: params
        })
        return res.data;
    },
}