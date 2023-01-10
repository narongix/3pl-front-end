export default{
    header(myHeaders){
        return {
            baseURL: process.env.VUE_APP_API_BASE_URL,
            headers:{
                ...myHeaders,
                "Authorization": "Bearer "+ localStorage.getItem("accessToken")
            } 
        }
    }
}