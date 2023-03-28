import ApiService from "../../../service/ApiService"
import { transferType } from "../../../domains/domain";

export default {
    namespaced: true,
    state(){
        return {
            completedTransferDelivery: [],
            completedTransferReceipt: [],
        }
    },
    getters:{
        getCompletedTransferDelivery(state){
            return state.completedTransferDelivery;
        },
        getCompletedTransferReceipt(state){
            return state.completedTransferReceipt;
        },
    },
    mutations:{
        onUpdateCompleteTransfserDelivery(state, data){
            data?.forEach((element)=>{
                const index = state.completedTransferDelivery.findIndex((e)=>element.id == e.id);
                if(index<0){
                    state.completedTransferDelivery.push(element);
                }
                else{
                    state.completedTransferDelivery[index] = element;
                }
            });
        },

        onUpdateCompleteTransfserReceipt(state, data){
            data?.forEach((element)=>{
                const index = state.completedTransferReceipt.findIndex((e)=>element.id == e.id);
                if(index<0){
                    state.completedTransferReceipt.push(element);
                }
                else{
                    state.completedTransferReceipt[index] = element;
                }
            });
        }
    },
    actions:{
        async onFetchMonthlyMetric(context, { userId, month }){
            const params={
                user_id: userId,
                month: month
            };

            const data = await ApiService.fetchMontlyMetric(params);
            return data;
        },

        async onFetchMonthlyMetricPeriodDelivery(context, { limit, offset }){
            const params ={
                transfer_type: transferType.Delivery,
                limit: limit,
                offset: offset,
            };
            const data = await ApiService.fetchMontlyMetricPeriod(params);
            return data;
        },

        async onFetchMonthlyMetricPeriodReceipt(context, { limit, offset }){
            const params ={
                transfer_type: transferType.Receipt,
                limit: limit,
                offset: offset,
            };
            const data = await ApiService.fetchMontlyMetricPeriod(params);
            return data;        
        },

        async onFetchDailyMetric(context, param){
            const params =  {
                user_id: param?.userId
            };
            const data = await ApiService.fetchDailyMetric(params);
            return data;
        },

        

        async onFetchCompleteTransferDelivery({ commit }, {userId, limit, offset}){
            const params = {
                transfer_type: transferType.Delivery,
                user_id: userId,
                offset,
                limit
            };
            const data = ApiService.fetchCompleteTransfer(params);
            
            commit("onUpdateCompleteTransfserDelivery", data?.rows)
            return data;
        },

        async onFetchCompleteTransferReceipt({ commit }, { userId, offset, limit }){
            const params = {
                transfer_type: transferType.Receipt,
                user_id: userId,
                offset, 
                limit
            };
            const data = ApiService.fetchCompleteTransfer(params);
            commit("onUpdateCompleteTransfserReceipt", data?.rows)
            
            return data;
        },

        async onFetchUnmeasuredProduct(context, {offset, limit}){
            const params = {
                offset,
                limit
            };
            const data = ApiService.fetchUnmeasureProduct(params);
            
            return data;
        }  
    }
}