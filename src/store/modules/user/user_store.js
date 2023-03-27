import ApiService from "../../../service/ApiService";


export default {
    namespaced: true,
    state(){
        return {
            userList: []
        };
    },
    
    getters:{
        getUser(state){
            return state.userList;
        },

        getUserLength(state){
            return state.userList?.length ?? 0;
        },

        getUserLimit(){
            return 10
        }
    },
    
    mutations:{
        updateUserState(state, newUsers){
            newUsers.forEach(element => {
                // Using odoo_id might me more efficient
                const index = state.userList.findIndex((e)=>e.id == element.id);
                if(index<0){
                    state.userList.push(element);
                }
                else{
                    state.userList[index] = element;
                }
            });
        },
    },

    actions:{
        async fetchUser({ commit }, {offset, limit, searchString}){
            const params ={
                offset: offset,
                limit: limit,
                search_string: searchString
            };
            const data = await ApiService.fetchUser(params);

            commit("updateUserState", data);
            
            return data;
        }
    }
}