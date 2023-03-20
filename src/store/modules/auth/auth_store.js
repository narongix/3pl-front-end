import ApiService from '../../../service/ApiService.js';
import LocalStorageKeys from "../../../domains/LocalStorageKeys.js";
import { roleGroupId } from '../../../domains/domain.js';

export default {
    namespaced: true,
    state() {
        return {
            user: null,
            isLoggedIn: false,
            oneTimeAccessToken: null,
        }
    },
    getters: {
        user(state) {
            if (!state.user) {
                state.user = JSON.parse(localStorage.getItem(LocalStorageKeys.userKey));
            }
            
            return state.user;  
        },

        isLoggedIn(state, getters) {
            // TODO: Refactor this, getters.user.id is just a temp solution
            state.isLoggedIn =  getters.user?.id != null;
            return state.isLoggedIn;    
        },

        getFullName(state, getters) {
            return (getters.user?.first_name ?? "") + " " + (getters.user?.last_name ?? "")
        },

        getEmail(state) {
            return state.user?.email ?? ""
        },

        getToken(state){
            const token = state.oneTimeAccessToken ?? localStorage.getItem(LocalStorageKeys.accessTokenkey);
            return token
        },

        getUserId(state, getters){
            return getters.user.id;  
        },

        getUserRole(state, getters){
            const role = getters.user?.role?.role_id ?? roleGroupId.User;
            return role;
        }
    },
    mutations: {
        setUser(state, payload) {
            state.user = payload.user;
            state.isLoggedIn = payload.isLoggedIn;
        },

        setLoggedInState(state, myState){
            state.isLoggedIn = myState
        }
    },
    actions: {
        async logout(context) {
            await ApiService.logout();

            context.state.user = null;
            context.state.oneTimeAccessToken = null;
            context.state.isLoggedIn = false;

            localStorage.removeItem(LocalStorageKeys.userKey);
            localStorage.removeItem(LocalStorageKeys.accessTokenkey);
        },

        async login(context, {payload, storeData}) {
            const loginData = await ApiService.login(payload)
            context.state.oneTimeAccessToken = loginData.access_token

            if (storeData) {
                localStorage.setItem(LocalStorageKeys.userKey, JSON.stringify(loginData.user))
                localStorage.setItem(LocalStorageKeys.accessTokenkey, loginData.access_token)
              }
              else{
                localStorage.removeItem(LocalStorageKeys.accessTokenkey)
                localStorage.removeItem(LocalStorageKeys.userKey)
              }
            context.commit('setUser', {
                user: loginData.user,
                isLoggedIn: true
            });

            return loginData
        },

        // Incase there is token expire
        setLoggedInMode({ commit }, state){
          commit("setLoggedInState", state)
        }
    }
}
