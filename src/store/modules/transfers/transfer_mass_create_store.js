export default{
  namespaced: true,
  state(){
    return {
      myTransferCreateState: {
        scheduledDate: null,
        transfer_type_id:null,
        recipient: null,
        transferProducts: [],
        reference: null,
      },
      myUserId: null,
      successList: [],
      errorList: []
    }
  },
  getters:{
    getSuccessList(state){
      return state.successList;
    },

    getUserId(state){
      return state.myUserId;
    },
    
    getErrorList(state){
      return state.errorList;
    },

    getTransferCreateState(state){
      // TODO: Find the bug. Apparently the transfer Product will list 
      // will be empty once it reaches the ui layer have to hard copy it.
      const myTransferProductList = [...state.myTransferCreateState.transferProducts];
      return {data:state.myTransferCreateState, userId: state.myUserId, transferProducts: myTransferProductList};
    }
  },
  mutations:{
    updateSuccessList(state, list){
      list?.forEach(element => {
        const index = state.successList.findIndex((e)=>e.sku == element.sku);
        if(index<0){
          state.successList.push(element);
        }
        else{
          state.successList[index] = element;
        }
      });
    },
    
    updateErrorList(state, list){
      list?.forEach(element => {
        const index = state.errorList.findIndex((e)=>e.sku == element.sku);
        if(index<0){
          state.errorList.push(element);
        }
        else{
          state.errorList[index] = element;
        }
      });
    },

    setTransferCreateState(state, {data, userId}){
      state.myTransferCreateState = JSON.parse(JSON.stringify(data));
      state.myUserId = userId;
    },

    clearSuccessList(state){
      state.successList.length = 0;
    },

    clearErrorList(state){
      state.errorList.length = 0;
    },

    clearTransferCreateState(state){
      state.myTransferCreateState={
        scheduledDate: null,
        transfer_type_id:null,
        recipient: null,
        transferProducts: [],
        reference: null,
      };

      state.myUserId = null;
    },

    onAddProductsToTransfer(state, products){
      if(!state.myTransferCreateState.transferProducts?.length){
        state.myTransferCreateState.transferProducts = [];
      }

      products.forEach((element)=>{
        const index = state.myTransferCreateState.transferProducts.findIndex((e)=>e.sku == element.sku);
        if(index<0){
          state.myTransferCreateState.transferProducts.push(element);
        }
        else{
          state.myTransferCreateState.transferProducts[index] = element;
        }
      })
    }
  },
  actions:{
    onUpdateSuccessList({ commit }, successList){
      commit("onAddProductsToTransfer", successList);
      commit("updateSuccessList", successList);
    },

    onUpdateErrorList({ commit }, errorList){
      commit("updateErrorList", errorList);
    },

    onSetTransferCreateState({ commit }, {data, userId}){
      commit("setTransferCreateState", {data, userId});
    },

    onClearSuccessList({ commit }){
      commit("clearSuccessList")
    },
    
    onClearErrorList({ commit }){
      commit("clearErrorList")
    },

    onClearTransferCreateState({ commit }){
      commit("clearTransferCreateState")
    },

    onClearAll({ commit }){
      commit("clearSuccessList");
      commit("clearErrorList");
      commit("clearTransferCreateState");
    }
  }
}