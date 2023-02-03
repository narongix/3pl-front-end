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
        onReplacedStockedList(state, stockedList){
            state.stockedList = [...stockedList]
        },

        onClearState(state){
            state.stockedList.length=0
        }
    },
    actions:{
        async onfetchedStockedList({ commit }, {from_date, to_date}){
            const newFromDate = TimeConvert.formatDateToStockFormat(from_date)
            const newToDate = TimeConvert.formatDateToStockFormat(to_date)

            const data = await ApiService.getStockedDetailReport({
                params:{
                    user_id: store.getters["auth/user"]?.odoo_id,
                    from_date: newFromDate,
                    to_date: newToDate
                }
            })
            // Don't user update because of the fact that old data can be in different 
            // date
            commit("onReplacedStockedList", data)
        },
    }
}