import ApiConfig from "../ApiConfig";

export default {
    async fetchExtraCharges(){
        const resp = await ApiConfig.getMethods({api: "/extra_charge"});
        return resp.data;
    },

    async updateExtraCharge(body){
        const resp = await ApiConfig.patchMethods({
            api: "/extra_charge",
            data: body
        });
        return resp.data;
    },

    async createExtraCharge(body){
        const resp = await ApiConfig.postMethods({
            api: "/extra_charge", 
            data: body
        });
        return resp.data;
    }
}