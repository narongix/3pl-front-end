import ApiConfig from "../ApiConfig";

export default{
    async fetchUser(params){
        const resp = await ApiConfig.getMethods({
            api: "/user",
            params: params
        });

        return resp.data;
    },

    async fetchCountries(){
        const resp = await ApiConfig.getMethods({
            api: "/user/country"
        });

        return resp.data;
    },

    async fetchCities(){
        const resp = await ApiConfig.getMethods({
            api: "/user/city"
        });

        return resp.data;
    },

    async fetchDistrict(){
        const resp = await ApiConfig.getMethods({
            api: "/user/district"
        });
        
        return resp.data;
    }
}