import ApiService from "../../../service/ApiService";

export default{
    namespaced:true,
    state(){
        return{
            transfers:[],
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

        addTransferState(state, newTransfers){
            newTransfers.forEach(function (element){
                const index = state.transfers.findIndex(e=>e.id == element)
                if(index<0){
                    state.transfers.unshift(element)
                }else{
                    state.transfer[index]=element
                }
            })
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
        },
        
        updateTotalTransfer(state, quantity){
            const myQuantity = parseInt(quantity) ?? state.transfer.length
            state.totalRecords = myQuantity
        }
    },

    actions:{
        async getTransfers({ commit }, {currentOffset, limit, userId, transferReference, transferId}){
            const myTransferReference = transferReference?.map((e)=>e?.trim());
            const myTransferId = transferId?.map((e)=>e.trim());
            const params = {
                offset: currentOffset,
                limit: limit, 
                user_id: userId,
                transfer_id: myTransferId,
                transfer_reference: myTransferReference
            };
            const data = await ApiService.getTransfers(params)

            commit("updateTransferState", data)
            return data
        },
        
        async getTransferDetail({ commit }, { transferId }){
            const newTransfer = await ApiService.getTransferDetails(transferId)

            commit("updateTransferState", [newTransfer])
            return newTransfer
        },

        async createTransfers({commit}, { tempTransfer, userId }){
            const reformatTransfer = {
                scheduled_time: tempTransfer.scheduledDate,
                transfer_type_id: tempTransfer.transfer_type_id,
                transferProducts: tempTransfer.transferProducts,
                recipient: tempTransfer.recipient,
                reference: tempTransfer.reference,
                user_id: userId
            }

            const newTransfer = await ApiService.createTransfer(reformatTransfer)
            commit("addTransferState", [newTransfer])

            return newTransfer
        },

        async updateTransfer({ commit }, { recipient, reference, id, transfer_status_id, created, updated, deleted, userId }){
            const newTransfer = {
                recipient: recipient,
                reference: reference,
                transfer_status_id: transfer_status_id,
                addedTransferProducts: created,
                deletedTransferProducts: deleted,
                updatedTransferProducts: updated,
            };

            const params = {
                user_id: userId
            };

            const newTransferV2 = await ApiService.updateTransfer(newTransfer, id, params)
            
            commit("updateTransferState", [newTransferV2])
            return newTransferV2
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

        async getTotalRecords({commit}, { userId, transferReference, transferId }){
            const myTransferReference = transferReference?.map((e)=>e?.trim());
            const myTransferId = transferId?.map((e)=>e?.trim());
            const params = {
                user_id: userId,
                transfer_reference: myTransferReference,
                transfer_id: myTransferId
            };
            const data = await ApiService.getTransferTotalRecords(params);
            commit("updateTotalTransfer", data.total_transfers)
        }
    },
}