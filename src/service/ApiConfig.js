import store from "../store/index";

export default {
    header({fields, myHeaders}) {
        const token = "Bearer " +  store.getters["auth/getToken"]
        return {
            baseURL: process.env.VUE_APP_API_BASE_URL,
            ...fields,
            headers: {
                ...myHeaders,
                "Authorization": token
            }
        }
    }
}