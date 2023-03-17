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
        async onFetchBilling({ commit }, { limit, offset, searchFilter}){
            const params = {
                user_id: store.getters['auth/getUserId'],
                offset: offset, 
                limit:limit,
                search_key: searchFilter
            };

            const data = await ApiService.onFetchBillingList(params);

            commit("updateBillingState", data.rows)

            return data
        },

        async onFetchDetailBilling({ state }, {month, year}){
            const params = {
                user_id: store.getters['auth/getUserId'],
                month: month,
                year: year,
            };

            const data = await ApiService.onFetchDetailBilling(params);

            // Keep this here or else, error. 
            // the web will throw an error
            // if we don't use it
            state.billingList
            
            return data
        },

        async onFetchTransferTrx({ state }, {offset, limit, month, year, transferType}){
            const params = {
                offset: offset,
                limit: limit,
                month: month,
                year: year,
                user_id: store.getters['auth/getUserId'],
                transfer_type: transferType
            };

            const data = await ApiService.getTransferTrx(params);
            state.billingList;
            return data;
        },

        async onFetchVolume({ state }, {offset, limit, month, year, searchFilter}){
            const params = {
                offset: offset,
                limit: limit,
                month: month,
                year: year,
                user_id: store.getters['auth/getUserId'],
                search_key: searchFilter
            };
            const data = await ApiService.getVolumeTotal(params);

            state.billingList;

            return data;
        },

        async onFetchVolumeWithDate({state}, {offset, limit, date}){
            const params = {
                offset: offset,
                limit: limit,
                date: date,
                user_id: store.getters['auth/getUserId'],
            }

            const data = await ApiService.getVolumeByDate(params);
            state.billingList;

            return data
        }
    }
}