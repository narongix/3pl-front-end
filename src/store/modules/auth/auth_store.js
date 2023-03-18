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
                state.user = Object.assign(state.user ?? {}, JSON.parse(localStorage.getItem(LocalStorageKeys.userKey)))
            }
            return state.user;  
        },

        isLoggedIn(state) {
            const myValue = JSON.parse(localStorage.getItem(LocalStorageKeys.loggedInIndicatorKey))
            state.isLoggedIn =  myValue ?? false
        
            return state.isLoggedIn;
        },

        getFullName(state) {
            return (state.user?.first_name ?? "") + " " + (state.user?.last_name ?? "")
        },

        getEmail(state) {
            return state.user?.email ?? ""
        },

        getToken(state, getters){
            const token = state.oneTimeAccessToken ?? getters.user.access_token;
            return token
        },

        getUserId(state, getters){
            return getters.user.id;  
        },

        getUserRole(state, getters){
            return getters.user?.role?.role_id ?? roleGroupId.User;
        }
    },
    mutations: {
        setUser(state, payload) {
            state.user = payload.user;
            state.isLoggedIn = payload.isLoggedIn;
        },

        setLoggedInState(state, myState){
            state.isLoggedIn = myState
            localStorage.setItem(LocalStorageKeys.loggedInIndicatorKey, JSON.stringify(myState))
        }
    },
    actions: {
        async logout(context) {
            await ApiService.logout()

            context.state.user = null
            context.state.oneTimeAccessToken = null
            context.state.isLoggedIn = false

            localStorage.removeItem(LocalStorageKeys.userKey)
            localStorage.removeItem(LocalStorageKeys.loggedInIndicatorKey)
        },

        async login(context, payload) {
            const loginData = await ApiService.login(payload)
            context.state.oneTimeAccessToken = loginData.access_token

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
