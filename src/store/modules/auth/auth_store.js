import router from '../../../router.js';
import ApiService from '../../../service/ApiService.js';

export default{
    state(){
        return{
            user:null,
            isLoggedIn:false
        }
    },
    getters:{
        user(state) {
            return state.user;
          },  
          isLoggedIn(state) {
            return state.isLoggedIn;
          }
    },
    mutations:{
        setUser(state, payload) {
            state.user = payload.user;
            console.log("state.user: "+JSON.stringify(state.user))
            state.isLoggedIn = payload.isLoggedIn;
          }
    },
    actions:{
        async login(context, payload) {
            try{
                const data = {
                    email: payload.email,
                    password: payload.password
                }
                const loginData = await ApiService.login(data)
                localStorage.setItem('accessToken', loginData.access_token);
                context.commit('setUser', {
                    user: loginData.user,
                    isLoggedIn: true
                });
                router.push('/transfers');
            }
            catch(e){
                const error = new Error(e || 'Failed to authenticate. Check your login data.');
                throw error;
            }
        }
    }
}