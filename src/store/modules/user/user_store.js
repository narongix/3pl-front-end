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
        }
    },
    
    mutations:{
        updateUserState(state, newUsers){
            newUsers.forEach(element => {
                // Using odoo_id might me more efficient
                const index = state.userList.findIndex((e)=>e.id == element.id);
                if(index<0){
                    this.userList.push(element);
                }
                else{
                    this.userList[index] = element;
                }
            });
        },
    },

    actions:{
        fetchUser({ commit }, {offset, limit, userName}){
            const params ={
                offset: offset,
                limit: limit,
                user_name: userName
            };
            const data = ApiService.fetchUser(params);

            commit("updateUserState", data);
        }
    }
}