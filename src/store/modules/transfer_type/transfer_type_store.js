import ApiService from "../../../service/api_service";

export default{
    namespaced: true,
    state(){
        return{
            transfer_type: []
        }
    },
    getters:{
        getTansferType(state){
            return state.transfer_type
        }
    },
    mutations:{
        updateTransferTypes(state, data){
            data.forEach(element => {
                const index = state.transfer_type.findIndex((e)=>e.transfer_type_id == element.transfer_type_id)
                if(index<0){
                    state.transfer_type.push(element)
                }else{
                    state.transfer_type[index] = element
                }
                console.log(state.transfer_type)
            });
        }
    },
    actions:{
        async getTransferType({commit}){
            const data = await ApiService.getTransferTypes()
            
            commit("updateTransferTypes", data)
        }
    }
}