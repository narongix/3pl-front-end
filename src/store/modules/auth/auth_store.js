import ApiService from '../../../service/ApiService.js';
import LocalStorageKeys from "../../../domains/LocalStorageKeys.js";

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
            return state.isLoggedIn;
        },

        getFullName(state) {
            return (state.user?.first_name ?? "") + " " + (state.user?.last_name ?? "")
        },

        getEmail(state) {
            return state.user?.email ?? ""
        },

        getToken(state){
            const token = state.oneTimeAccessToken ?? localStorage.getItem(LocalStorageKeys.accessTokenkey)
            return token
        }
    },
    mutations: {
        setUser(state, payload) {
            state.user = payload.user;
            state.isLoggedIn = payload.isLoggedIn;
        }
    },
    actions: {
        async logout(context) {
            await ApiService.logout()

            context.state.user = null
            context.state.oneTimeAccessToken = null
            context.state.isLoggedIn = false

            localStorage.removeItem(LocalStorageKeys.userKey)
            localStorage.removeItem(LocalStorageKeys.accessTokenkey)
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
    }
}
