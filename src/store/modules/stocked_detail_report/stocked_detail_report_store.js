import ApiService from "../../../service/ApiService";
import TimeConvert from "../../../components/utils/TimeConvert";
import { convertListToObject } from "../../../components/utils/MyList";

export default{
    namespaced: true,
    state(){
        return {
            stockedList: [],
        }
    },
    getters:{
        getStockedList(state){
            return state.stockedList
        }
    },

    mutations:{
        onUpdateStockedList(state, stockedList){
            stockedList.forEach((element)=>{
                const index = state.stockedList.findIndex((e)=>e.product_id == element.product_id)
                if(index<0){
                    state.stockedList.push(element)
                }else{
                    state.stockedList[index]= element
                }
            })
        },

        onReplacedStockedList(state, stockedList){
            state.stockedList = [...stockedList]
        },

        onClearState(state){
            state.stockedList.length=0
        }
    },
    actions:{
        async onFetchStockReportTotal({ state }, {from_date, to_date, barcodes, sku, activeProduct, userId}){
            const newFromDate = TimeConvert.formatDateToStockFormat(from_date);
            const newToDate = TimeConvert.formatDateToStockFormat(to_date);

            const newProductIds = convertListToObject({myList: sku, name: "skus"}) ?? null;
            const newBarCodes = convertListToObject({myList: barcodes, name: "barcodes"}) ?? null;
 
            const params ={
                from_date: newFromDate,
                to_date: newToDate,
                active_product: activeProduct,
                user_id: userId,
                ...newProductIds,
                ...newBarCodes
            }

            const data = await ApiService.onFetchStockReportTotal({params});

            state.stockedList;

            return data.count;
        },

        async onfetchAndUpdateStockedList({ commit }, {from_date, to_date, limit, offset, sku, activeProduct, userId}){
            const newFromDate = TimeConvert.formatDateToStockFormat(from_date);
            const newToDate = TimeConvert.formatDateToStockFormat(to_date);

            const newProductSkus = convertListToObject({myList: sku, name: "skus"}) ?? null;
            // const newBarCodes = convertListToObject({myList: barcodes, name: "barcodes"}) ?? null;

            const params= {
                from_date: newFromDate,
                to_date: newToDate,
                limit: limit ?? 10,
                offset: offset ?? 0,
                active_product: activeProduct,
                user_id: userId,
                ...newProductSkus,
                // ...newBarCodes
            };

            const data = await ApiService.getStockedDetailReport({
                params: params
            });

            commit("onUpdateStockedList", data);
            return data;
        },

        async onfetchedAndReplaceStockedList({ commit }, {from_date, to_date, limit, offset, sku, activeProduct, userId}){
            const newFromDate = TimeConvert.formatDateToStockFormat(from_date)
            const newToDate = TimeConvert.formatDateToStockFormat(to_date)

            const newProductIds = convertListToObject({myList: sku, name: "skus"}) ?? null;
            // const newBarCodes = convertListToObject({myList: barcodes, name: "barcodes"}) ?? null;
            
            const param = {
                from_date: newFromDate,
                to_date: newToDate,
                limit: limit ?? 10,
                offset: Number(offset ?? 0),
                active_product: activeProduct,
                user_id: userId,
                // ...newBarCodes,
                ...newProductIds
            };
            const data = await ApiService.getStockedDetailReport({
                params: param
            });
            // Don't user update because of the fact that old data can be in different 
            // date
            commit("onReplacedStockedList", data);
            return data;
        },

        clearSockDetailReport({ commit }){
            commit("onClearState")
        },
    },
}