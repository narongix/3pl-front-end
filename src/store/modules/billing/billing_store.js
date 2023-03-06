import ApiService from "../../../service/ApiService";
import store from "../..";

export default{
    namespaced: true,
    state(){
        return{
            billingList: [],
        }
    },
    getters:{
        getBilling(state){
            return state.billingList
        },
    },
    mutations:{
        updateBillingState(state, data){
            data.forEach(element => {
                const index = state.billingList.findIndex((e)=>e.id == element.id)
                if(index<0){
                    state.billingList.push(element)
                }
                else{
                    state.billingList[index] = element
                }
            });
        },

        setBillingDetail(state, data){
            state.billingDetail = data
        },

        onClearState(state){
            state.billingList.length=0
            state.billingDetail=null
        }
    },
    actions:{
        async onFetchBilling({ commit, state }, {limit, offset}){
            const data = await ApiService.onFetchBillingList({
                userId: store.getters['auth/getUserId'],
                offset: offset, 
                limit:limit
            });

            commit("updateBillingState", data)

            return state.billingList
        },

        async onFetchDetailBilling({ state }, {month, year}){
            const data = await ApiService.onFetchDetailBilling({
                userId: store.getters['auth/getUserId'],
                month: month,
                year: year,
            });

            // Keep this here or else, error. 
            // the web will throw an error
            // if we don't use it
            state.billingList
            
            return data
        },

        async onFetchTransferTrx({ state }, {offset, limit, month, year, transferType}){
            const data = await ApiService.getTransferTrx({
                offset: offset,
                limit: limit,
                month: month,
                year: year,
                transferType: transferType
            });
            state.billingList
            return data;
        }
    }
}