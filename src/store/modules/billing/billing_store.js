import ApiService from "../../../service/ApiService";
import store from "../..";
import LocalStorageKeys from "../../../domains/LocalStorageKeys";

export default{
    namespaced: true,
    state(){
        return{
            billingList: [],
            userIdDetailBilling: null,
        }
    },
    getters:{
        getBilling(state){
            return state.billingList
        },

        getSelectedUser(state){
            return state.selectedUser;
        },

        getBillingDetailUserId(state){
            const userId = state.userIdDetailBilling ?? JSON.parse(localStorage.getItem(LocalStorageKeys.userIdForAdmin)) ?? store.getters['auth/getUserId'];
            return userId;
        }
    },
    mutations:{
        updateBillingState(state, data){
            data?.forEach(element => {
                const index = state.billingList.findIndex((e)=>e.id == element.id)
                if(index<0){
                    state.billingList.push(element)
                }
                else{
                    state.billingList[index] = element
                }
            });
        },

        setBillingDetailUserId(state, userId){
            state.userIdDetailBilling = userId
        },

        onClearState(state){
            state.billingList.length=0;
            state.userIdDetailBilling=null;
            localStorage.removeItem(LocalStorageKeys.userIdForAdmin);
        }
    },
    actions:{
        updateBillingDetailUserId({ commit }, { userId }){
            // TODO: Make sure to encrypt this data in the future or use other alternative
            // This is used in case the user is in volume page and decided to refresh
            // for admin
            localStorage.setItem(LocalStorageKeys.userIdForAdmin, JSON.stringify(userId));
            commit("setBillingDetailUserId", userId);
        },
        async onFetchBilling({ commit }, { limit, offset, searchFilter, userId}){
            const params = {
                user_id: userId,
                offset: offset, 
                limit:limit,
                search_key: searchFilter
            };

            const data = await ApiService.onFetchBillingList(params);

            commit("updateBillingState", data.rows)

            return data
        },

        async onFetchDetailBilling({ getters }, {month, year}){
            const userId = getters.getBillingDetailUserId;
            const params = {
                user_id: userId,
                month: month,
                year: year,
            };

            const data = await ApiService.onFetchDetailBilling(params);

            return data
        },

        async onFetchTransferTrx({ getters }, {offset, limit, month, year, transferType}){
            const userId = getters.getBillingDetailUserId;
            const params = {
                offset: offset,
                limit: limit,
                month: month,
                year: year,
                user_id: userId,
                transfer_type: transferType
            };

            const data = await ApiService.getTransferTrx(params);
            return data;
        },

        async onFetchVolume({ getters }, {offset, limit, month, year, searchFilter}){
            const userId = getters.getBillingDetailUserId;
            const params = {
                offset: offset,
                limit: limit,
                month: month,
                year: year,
                user_id: userId,
                search_key: searchFilter
            };
            const data = await ApiService.getVolumeTotal(params);

            return data;
        },

        async onFetchVolumeWithDate({ getters }, {offset, limit, date}){
            const userId = getters.getBillingDetailUserId;

            const params = {
                offset: offset,
                limit: limit,
                date: date,
                user_id: userId,
            }
            const data = await ApiService.getVolumeByDate(params);

            return data
        }
    }
}