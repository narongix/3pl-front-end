import router from "../../router"
import store from "../../store/index";

async function authException(exception){
    delete exception["stack"];
    if(exception?.response?.data){    
        const data = {
            status: exception?.response?.status ?? 400,
            message: exception?.response?.data?.errorMessage ?? exception?.response?.data?.message
        };

        // If Unauthenticated
        if(data.status == 401){
            store.dispatch('auth/forcedLogOut');
            await router.replace({name: "login"});
            return;
        }
        return data;
    }
    return exception;
}
export default { authException }