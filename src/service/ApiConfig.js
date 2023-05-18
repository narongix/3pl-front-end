import axios from "axios";
import Exception from "../components/utils/Exception";
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
    },

    getMethods({api, data, params, contentType}){
        const res = axios.get(api, this.header({
            fields:{
                params:params,
                data:data
            },  
            myHeaders:{
                "Content-type": contentType
            }
        })).catch((e)=>{
            const error = Exception.authException(e)
            console.log(e);
            throw error
        })
        return res
    },

    postMethods({api, data, contentType}){
        const res = axios.post(api, data, this.header({
            fields: {
            },
            myHeaders: {
                "Content-Type": contentType
            }
        })).catch(async (e) => {
            const error = await Exception.authException(e)
            throw error
        })
        return res
    },

    patchMethods({api, data, contentType}){
        const res = axios.patch(api, data, this.header({
                fields:{},
                myHeaders:{
                    "Content-Type": contentType
                }
            }   
        )).catch((e)=>{
            const error = Exception.authException(e)
            throw error
        })
        return res
    },

    deleteMethods({api, data}){
        const res = axios.delete(api, this.header({
            fields:{
                data: data
            }
        })).catch((e)=>{
            const error = Exception.authException(e)
            throw error
        })
        return res
    }
}