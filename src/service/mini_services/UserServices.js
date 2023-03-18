import ApiConfig from "../ApiConfig";

export default{
    async fetchUser(params){
        const resp = await ApiConfig.getMethods({
            api: "/user",
            params: params
        });

        return resp.data;
    }
}