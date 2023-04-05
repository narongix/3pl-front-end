import ApiService from "../../../service/ApiService";


export default {
    namespaced: true,
    state(){
        return {
            userList: [],

            countries: [],
            cities: [],
            districts: []
        };
    },
    
    getters:{
        getUser(state){
            return state.userList;
        },

        getUserLength(state){
            return state.userList?.length ?? 0;
        },

        getUserLimit(){
            return 10
        },

        getCountry(state){
            return state.countries;
        },
        
        getCity(state){
            return state.cities;
        },
        
        getDistrict(state){
            return state.districts;
        },
    },
    
    mutations:{
        updateCountry(state, countries){
            countries.forEach((element)=>{
                const index = state.countries.findIndex((e)=>e.id==element.id);
                if(index<0){
                    state.countries.push(element);
                }else{
                    state.countries[index] = element;
                }
            });
        },
        updateCity(state, cities){
            cities.forEach((element)=>{
                const index = state.cities.findIndex((e)=>e.id==element.id);
                if(index<0){
                    state.cities.push(element);
                }else{
                    state.cities[index] = element;
                }
            });
        },
        updateDistrict(state, districts){
            districts.forEach((element)=>{
                const index = state.districts.findIndex((e)=>e.id==element.id);
                if(index<0){
                    state.districts.push(element);
                }else{
                    state.districts[index] = element;
                }
            });
        },

        updateUserState(state, newUsers){
            newUsers.forEach(element => {
                // Using odoo_id might me more efficient
                const index = state.userList.findIndex((e)=>e.id == element.id);
                if(index<0){
                    state.userList.push(element);
                }
                else{
                    state.userList[index] = element;
                }
            });
        },
    },

    actions:{
        async fetchUser({ commit }, {offset, limit, searchString}){
            const params ={
                offset: offset,
                limit: limit,
                search_string: searchString
            };
            const data = await ApiService.fetchUser(params);

            commit("updateUserState", data);
            
            return data;
        },

        async fetchCountries({ commit }){
            const data = await ApiService.fetchCountries();
            commit("updateCountry", data);
        },

        async fetchCities({ commit }){
            const data = await ApiService.fetchCities();
            commit("updateCity", data);
        },

        async fetchDistricts({ commit }){
            const data = await ApiService.fetchDistrict();
            commit("updateDistrict", data);
        }
    }
}