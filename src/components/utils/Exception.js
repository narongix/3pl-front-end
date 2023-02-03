import router from "../../router"

async function authException(exception){
    delete exception["stack"]
    if(exception.response.data){    
        const data = {
            status: exception.response.status,
            errorMessage: exception.response.data.errorMessage
        }

        // If Unauthenticated
        if(data.status == 401){
            await router.replace({name: "login"})
            return
        }
        return data
    }
    return exception
}
export default { authException }