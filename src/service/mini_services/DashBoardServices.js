import ApiConfig from "../ApiConfig";

export default{
    async fetchMontlyMetric(params){
        const resp = await ApiConfig.getMethods({
            api: "dashboard/monthly_metrics",
            params: params
        });

        return resp.data;
    },

    async fetchMontlyMetricPeriod(params){
        const resp = await ApiConfig.getMethods({
            api: "/dashboard/transfer_metrics_period",
            params: params
        });

        return resp.data;
    },

    async fetchDailyMetric(params){
        const resp = await ApiConfig.getMethods({
            api: "dashboard/daily_metrics",
            params: params
        })

        return resp.data;
    },

    async fetchCompleteTransfer(params){
        const resp = await ApiConfig.getMethods({
            api: "dashboard/complete_transfers",
            params: params
        })

        return resp.data;
    },

    async fetchUnmeasureProduct(params){
        const resp = await ApiConfig.getMethods({
            api: "dashboard/unmeasured_products_customer",
            params: params
        });

        return resp.data;
    }
}