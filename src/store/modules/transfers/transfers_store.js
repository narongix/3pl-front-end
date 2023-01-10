import ApiService from "../../../service/api_service";

export default{
    namespaced:true,
    state(){
        return{
            transfers:[],
            offset: 0,
            loading:false,
        }
    },
    getters:{
        getTransfers(state){
            return state.transfers;
        },
        
        hasTransfers(state){
            return state.transfers && state.transfers.length>0
        },
        
        findTransferDetail: (state) => (id) => {
            const rise = state.transfers.find(element=>element.id==id)
            return rise
        }   
    },
    mutations:{
        updateTransferState(state, newTransfer){
            newTransfer.forEach(element => {
                const index = state.transfers.findIndex(p => p.id == element.id)
                if(index<0){
                    state.transfers.push(element)
                }
                else{
                    state.transfers[index] = element
                }
            });
        },

        deleteTransferState(state, transfers){
            transfers.forEach((e)=>{
                const index = state.transfers.findIndex(element=>element.id == e.id)
                if(index>=0){
                    state.transfers.splice(index, 1)
                }
            })
        }
    },
    actions:{
        async getTransfers({ commit, state }, { currentOffset, limit }){
            state.offset = state.offset + currentOffset
            const data = await ApiService.getTransfers(state.offset, limit)
            commit("updateTransferState", data)
        },
        
        async getTransferDetail({ commit }, { transferId }){
            const newTransfer = await ApiService.getTransferDetails(transferId)

            commit("updateTransferState", [newTransfer])
            return newTransfer
        },

        async createTransfers({commit}, { tempTransfer }){
            const newTransfer = await ApiService.createTransfer(tempTransfer)
            commit("updateTransferState", [newTransfer])
        },

        async updateTransfer({ commit }, { recipient, id, created, updated, deleted }){
            const newTransfer = {
                recipient: recipient,
                addedTransferProducts: created,
                deletedTransferProducts: deleted,
                updatedTransferProducts: updated,
            }
            const newTransferV2 = await ApiService.updateTransfer(newTransfer, id)
            
            commit("updateTransferState", [newTransferV2])
        },

        async deleteSingleTransfer({commit}, { transfer }){
            await ApiService.deleteTransfer({
                "transferId": transfer.id
            })
            commit("deleteTransferState", [transfer])
        },

        async deleteMultipleTransfers({ commit }, { transfers }){
            await ApiService.deleteTransfer({
                "transferId": transfers[0]["id"]
            })
            commit("deleteTransferState", transfers)
        },

        resetOffset({ state }){
            state.offset = 0
        }
    },
}