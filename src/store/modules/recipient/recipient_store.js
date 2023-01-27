import ApiService from "../../../service/ApiService";

export default{
    namespaced:true,    
    state(){
        return {
            recipients:[],
        }
    },

    getters:{
        getRecipientsState(state){
            return state.recipients
        },

        getRecipientFullDetail: (state)=>(id)=>{
            try{
                const index = state.recipients.findIndex((e)=> e.contact_id == id)
                const recipient = state.recipients[index]
                const fullDetail = `${recipient.full_name ?? "" } - ${recipient.phone_number ?? ""}` 
                return fullDetail
            }
            catch(e){
                const fullDetail = null 
                return fullDetail
            }
        },

        findRecipientId: (state)=>(contact)=>{
            const index = state.recipients.findIndex((e)=>{
                const detail = `${e.full_name} - ${e.phone_number}`
                return detail == contact
            })
            if(index>=0){
                return state.recipients[index].contact_id   
            }
            return state.recipients[0].contact_id
        },
        getLimit(){
            return 10
        }
    },

    mutations:{
        updateRecipientState(state, data){
            data.forEach(element => {
                const index = state.recipients.findIndex((e)=>e.contact_id == element.contact_id)
                if(index<0){
                    state.recipients.push(element)
                }
                else{
                    state.recipients[index] = element
                }
            });
        },

        onClearState(state){
            state.recipients.length=0
        }
    },

    actions:{
        async getRecipients({ commit, getters }, {offset, searchString}){
            const filterValue = searchString? searchString : "" 

            const data = await ApiService.getRecipients(offset, getters["getLimit"], filterValue)
            commit("updateRecipientState", data)
            return data
        },
    }
}