import ApiService from "../../../service/ApiService";

export default{
    namespaced:true,
    state(){
        return{
            transfers:[],
            offset: 0,
            loading:false,
            totalRecords: null,
        }
    },
    getters:{
        getTransfers(state){
            return state.transfers;
        },

        getTotalRecords(state){
            return state.totalRecords;
        },
        
        hasTransfers(state){
            return state.transfers && state.transfers.length>0
        },
        
        findTransferDetail: (state) => (id) => {
            const transfer = state.transfers.find(element=>element.id==id)
            return transfer
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
        },

        onClearState(state){
            state.transfers.length=0
            state.offset=0
        },
        
        updateTotalTransfer(state, quantity){
            const myQuantity = parseInt(quantity) ?? state.transfer.length
            state.totalRecords = myQuantity
        }
    },

    actions:{
        async initializeTransfers({ commit, state }, {limit, params }){
            const data = await ApiService.getTransfers({
                offset: state.offset,
                limit: limit, 
                ...params
            })
            
            state.offset = limit*2

            commit("updateTransferState", data)
            return data
        },

        async getTransfers({commit, state}, {currentOffset, limit, params}){
            state.offset = state.offset + currentOffset

            const data = await ApiService.getTransfers({
                offset: state.offset,
                limit: limit, 
                ...params
            })
                
            commit("updateTransferState", data)
            return data
        },
        
        async getTransferDetail({ commit }, { transferId }){
            const newTransfer = await ApiService.getTransferDetails(transferId)

            commit("updateTransferState", [newTransfer])
            return newTransfer
        },

        async createTransfers({commit}, { tempTransfer }){
            const newTransfer = await ApiService.createTransfer(tempTransfer)
            commit("updateTransferState", [newTransfer])

            return newTransfer
        },

        async updateTransfer({ commit }, { recipient, reference, id, transfer_status_id, created, updated, deleted }){
            const newTransfer = {
                recipient: recipient,
                reference: reference,
                transfer_status_id: transfer_status_id,
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
        },

        async getTotalRecords({commit}){
            const data = await ApiService.getTransferTotalRecords();
            commit("updateTotalTransfer", data.total_transfers)
        }
    },
}