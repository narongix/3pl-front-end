import ApiService from "../../../service/ApiService";

export default{
    namespaced: true,
    state(){
        return {
            extraChages: []
        };
    },
    getters:{
        getExtraCharges(state){
            return state.extraChages;
        }
    },
    mutations:{
        updateExtraChargeState(state, newExtraCharges){
            newExtraCharges.forEach(element => {
                const index =  state.extraChages.findIndex((e)=>e.id == element.id);
                if(index<0){
                    state.extraChages.push(element);
                }
                else{
                    state.extraChages[index] = element;
                }
            });
        }
    },
    actions:{
        async onFetchExtraCharges({ commit }){
            const extraCharges = await ApiService.fetchExtraCharges();
            commit("updateExtraChargeState", extraCharges);
            return extraCharges;
        },

        async onUpdateExtraCharge({ commit }, newExtraCharge){
            const data = await ApiService.updateExtraCharge(newExtraCharge)
            commit("updateExtraChargeState", [data]);
            return data;
        },

        async onAddExtraCharge({ commit }, newExtraCharge){
            const data = await ApiService.createExtraCharge(newExtraCharge);
            commit("updateExtraChargeState", [data]);
            return data;
        },

        async onAddTransferDetailWithExtraCharge(context, {transferId, extraChargeId}){
            const body = {
                transfer_id: transferId,
                extra_charge_id: extraChargeId
            };
            const data = await ApiService.addExtraChargeToTransferId(body);
            return data;
        }
    }
}