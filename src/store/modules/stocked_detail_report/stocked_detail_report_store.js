import ApiService from "../../../service/ApiService";

export default{
    namespaced: true,
    state(){
        return {
            stockedList: []
        }
    },
    getters:{
        getStockedList(){
            return stockedList
        }
    },
    methods:{
        onUpdateStockedList(state, stockedList){
            stockedList.forEach(element => {
                const index = state.stockedList.findIndex((e)=> e.product_id == element.product_id)
                if(index<0){
                    state.stockedList.push(element)
                }else{
                    state.stockedList[index] = element
                }
            });
        }
    },
    actions:{
        async onfetchedStockedList({ commit }){
            const data = await ApiService.getStockedDetailReport()
            commit("onUpdateStockedList", data)
        }
    }
}