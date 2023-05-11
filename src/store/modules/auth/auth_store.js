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
            return getters.user?.id;  
        },

        getUserRole(state, getters){
            const role = getters.user?.role?.role_id ?? roleGroupId.User;
            return role;
        }
    },
    mutations: {
        setUser(state, payload) {
            state.user = payload?.user;
            state.isLoggedIn = payload?.isLoggedIn;
            state.oneTimeAccessToken = payload?.access_token;

            if(payload?.user){
                localStorage.setItem(LocalStorageKeys.userKey, JSON.stringify(payload?.user))
                localStorage.setItem(LocalStorageKeys.accessTokenkey, payload?.access_token)
            }else{
                localStorage.removeItem(LocalStorageKeys.userKey);
                localStorage.removeItem(LocalStorageKeys.accessTokenkey);
            }
        },

        setLoggedInState(state, myState){
            state.isLoggedIn = myState
        }
    },
    actions: {
        async logout({ commit }) {
            await ApiService.logout();
            commit("setUser");
            commit("setLoggedInState", false);
        },

        async login({ commit }, {payload, storeData}) {
            const loginData = await ApiService.login(payload)
            commit('setUser', {
                user: loginData.user,
                isLoggedIn: true,
                access_token: loginData.access_token,
                // Whether the user only one a one time access
                storeData: storeData
            });

            return loginData
        },

        // Incase there is token expire
        forcedLogOut({ commit }){
            commit("setUser");
            commit("setLoggedInState", false);
        }
    }
}
