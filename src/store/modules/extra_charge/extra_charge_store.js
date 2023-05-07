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
        },
        deleteExtraChargeState(state, id){
            const index = state.extraChages.findIndex((e)=>e.id == id);
            if(index>=0){
                state.extraChages.splice(index, 1);
            }
        }
    },
    actions:{
        async onFetchExtraCharges({ commit }, {offset, limit, name}){
            const param = {
                limit,
                offset,
                name
            }
            const extraCharges = await ApiService.fetchExtraCharges(param);
            commit("updateExtraChargeState", extraCharges.rows);
            return extraCharges;
        },

        async onUpdateExtraCharge({ commit }, newExtraCharge){
            const data = {
                id: newExtraCharge.id,
                item_code: newExtraCharge.item_code,
                amount: newExtraCharge.amount,
                description: newExtraCharge.description
            };

            await ApiService.updateExtraCharge(data);
            commit("updateExtraChargeState", [data]);
        },

        async onDeleteExtraCharge({ commit }, id){
            const body = {
                id: id
            };
            await ApiService.deletedExtraCharge(body);
            commit("deleteExtraChargeState", id);
        },

        async onAddExtraCharge({ commit }, newExtraCharge){
            const data = await ApiService.createExtraCharge(newExtraCharge);
            commit("updateExtraChargeState", [data]);
            return data;
        }
    }
}