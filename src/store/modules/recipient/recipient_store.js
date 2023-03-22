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
            const myTempList = []
            for(let i=0; i<state.recipients.length; i++){
                myTempList.push({...state.recipients[i]})
                // If phone number empty don't show anything
                myTempList[i].full_name = `${state.recipients?.[i]?.full_name ?? "Recipient" }${state.recipients?.[i]?.phone_number? (' - '+state.recipients?.[i]?.phone_number) : ''}`
            }
            return myTempList
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

        // findRecipientId: (state)=>(contact)=>{
        //     const index = state.recipients.findIndex((e)=>{
        //         const detail = `${e?.full_name} - ${e?.phone_number}`
        //         return detail == contact
        //     })
        //     if(index>=0){
        //         return state.recipients[index].contact_id   
        //     }
        //     return state.recipients?.[0]?.contact_id
        // },
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
        async getRecipients({ commit, getters }, {offset, searchString, userId}){
            const filterValue = searchString ?? ""; 

            const params = {
                offset: offset,
                limit: getters["getLimit"], 
                search_string: filterValue,
                user_id: userId
            }

            const data = await ApiService.getRecipients(params)
            commit("updateRecipientState", data)
            return data
        },

        async createRecipient({commit}, {recipient}){
            const newRecipient = await ApiService.createRecipient(recipient)
            commit("updateRecipientState", [newRecipient])
        }
    }
}