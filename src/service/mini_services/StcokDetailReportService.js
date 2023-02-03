import ApiConfig from "../ApiConfig";

export default{
    async getStockedDetailReport({params}){
        const res = ApiConfig.getMethods({
            api: "/stock_detailed",
            params: params
        })

        return res.data
    }
}