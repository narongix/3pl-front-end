import ApiService from "../../../service/ApiService";
import store from "../../index";
import TimeConvert from "../../../components/utils/TimeConvert";

export default{
    namespaced: true,
    state(){
        return {
            stockedList: []
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
        async onfetchAndUpdateStockedList({commit}, {from_date, to_date, limit, offset}){
            const newFromDate = TimeConvert.formatDateToStockFormat(from_date)
            const newToDate = TimeConvert.formatDateToStockFormat(to_date)

            const data = await ApiService.getStockedDetailReport({
                params:{
                    owner_id: store.getters["auth/user"]?.odoo_id,
                    from_date: newFromDate,
                    to_date: newToDate,
                    limit: limit ?? 10,
                    offset: offset ?? 0
                }
            })

            commit("onUpdateStockedList", data)
            return data.length
        },

        async onfetchedAndReplaceStockedList({ commit }, {from_date, to_date, limit, offset}){
            const newFromDate = TimeConvert.formatDateToStockFormat(from_date)
            const newToDate = TimeConvert.formatDateToStockFormat(to_date)

            const data = await ApiService.getStockedDetailReport({
                params:{
                    owner_id: store.getters["auth/user"]?.odoo_id,
                    from_date: newFromDate,
                    to_date: newToDate,
                    limit: limit ?? 10,
                    offset: offset ?? 0
                }
            })
            // Don't user update because of the fact that old data can be in different 
            // date
            commit("onReplacedStockedList", data)
        },
    }
}