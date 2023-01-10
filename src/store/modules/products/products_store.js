import axios from "axios";
import router from '../../../router.js';
import ApiService from "../../../service/ApiService.js";

var hosturl = process.env.VUE_APP_API_BASE_URL;

export default{
    namespaced:true,
    state(){
        return{
            products:[],
            prodCategories:[]
        }
    },
    mutations:{
        setProducts(state, payload) {
            state.products = payload.products;
          },
          setProdCategories(state, payload) {
            state.prodCategories = payload.prodCategories;
          },
        
          deleteProduct(state, payload) {
        
            state.products = state.products.filter(val => val.id !== payload.id);
        
            // console.log(`after mod: ${state.products===modifiedProducts}`)
            // console.log(JSON.stringify(modifiedProducts));
          },
        
          updateProduct(state, payload) {
            let product_name = payload.name;
            let sku = payload.sku;
            let upc = payload.upc;
            const data = {
              id: payload.id,
            }
            if (product_name) { data.product_name = product_name; }
            if (sku) { data.sku = sku; }
            if (upc) { data.upc = upc; }
        
            /* /////////////////////////////////////////////////////////
            // the field v-model binds to for the vendor's code/sku
            // is sku, but the field used to send or field retrieved
            // from the backend is default_code (straight from Odoo)
            // this is why it's necessary to transform the names 
            /////////////////////////////////////////////////////////*/
        
            const index = state.products.findIndex(product => product.id == data.id);
            
            if (state.products[index]) {
              state.products[index] = Object.assign(state.products[index], data);
            }
            
            // console.log("AFTER MUTATION"+JSON.stringify(state.products[index]));
        
        
          },
        
        
          updateProductCategory(state, payload) {
            let category_name = payload.name;
            const data = {
              id: payload.id,
            }
            if (category_name) { data.category_name = category_name; }
        
            const index = state.prodCategories.findIndex(category => category.id == data.id);
        
            if (state.prodCategories[index]) {
              state.prodCategories[index] = Object.assign(state.prodCategories[index], data);
            }
          },
        
        
          deleteProductCategory(state, payload) {
            // console.log("REEEEEEEEEEEEEE: "+JSON.stringify(state.prodCategories))
            // console.log("payload id: "+ JSON.stringify(payload))
            const index = state.prodCategories.findIndex( e => e.id == payload.id)
            state.prodCategories.splice(index, 1)
        
          },

          updateProductState(state, products){
            products.forEach(element => {
               const index = state.products.findIndex((e)=>e.product_id == element.product_id)
                if(index>=0){
                    state.products[index]=element
                }else{
                    state.products.push(element)
                }
            });
          }
    },
    actions:{
        async getProducts(context, params) {

            console.log(params);
            //get local products instead of directly from odoo because of speed
            await axios.get(hosturl+'/product/list?product_name=',
                {
                    headers: {
                        'Authorization': localStorage.accessToken
                    }
                }
            ).then(response => {

                console.log("respones: "+JSON.stringify(response.data))
    
                context.commit('setProducts', {
                    products: response.data
                });
                // router.push('/products');
            })
                .catch(e => {
                    const error = new Error(e || 'Cannot retrieve products!');
                    throw error;
                })
        },
        async getProdCategories(context, params) {
    
            console.log(`getProd ${params}`);
        
            await axios.get(hosturl+'/category',
                {
                    headers: {
                        'Authorization': localStorage.accessToken
                    }
                }
            ).then(response => {
                console.log(`getProd response ${JSON.stringify(response.data)}`);
                context.commit('setProdCategories', {
                    prodCategories: response.data
                });
        
            })
                .catch(e => {
                    const error = new Error(e || 'Cannot retrieve categories!');
                    throw error;
                })
        },
    
        async addProduct(context, payload) {
    
            const data = {
                'product_name': payload.name,
                'sku': payload.sku
            }
            const config = {
                headers: { Authorization: `Bearer ${localStorage.accessToken}` }
            };
    
            console.log(data)
            console.log(config)
            await axios
                .post(hosturl+'/product/add', data, config)
                .then(response => {
                    console.log(response);
                    router.replace('/products')
                })
                .catch(e => {
                    const error = new Error(e || 'Cannot add products!');
                    throw error;
                })
    
        },
        async updateProduct(context, payload) {
            console.log(`Payload11111111 ${JSON.stringify(payload)}`)
            const url = hosturl+'/product/' + payload.id
            //transform the fields to match the api fields
    
            const data = {
            }
    
            if (payload.name) { data['product_name'] = payload.name; }
            if (payload.sku) { data['sku'] = payload.sku; }
    
    
            const config = {
                headers: { Authorization: `Bearer ${localStorage.accessToken}` }
            };
    
            console.log('url '+url)
            console.log("data: " + JSON.stringify(data))
    
            // if (Object.keys(payload).length > 0) {
            //     console.log("There is update: " + JSON.stringify(data));
            // }
            //payload only stores the fields that are being updated
            //data storoes the id which is used to find a Product Object
    
            await axios
                .patch(url, data, config)
                .then(response => {
                    console.log(response);
                    context.commit('updateProduct', payload);//
                })
                .catch(e => {
                    const error = new Error(e || 'Cannot update products!');
                    throw error;
                })
    
        },
        async deleteProduct(context, payload) {
            const url = hosturl+'/product'
            const data = {
                productIds: []
            }
    
            const headers = {
                Authorization: `Bearer ${localStorage.accessToken}`
            }
            for (var key in payload) {
                var id = payload[key];
                data.productIds.push(id);
                // ...
            }
            console.log(`DELETE BODY: ${JSON.stringify(data)}`);
            await axios
                .delete(url,{data:data,headers})
                .then(response => {
                    console.log(response);
    
                })
                .catch(e => {
                    const error = new Error(e || 'Cannot delete products!');
                    throw error;
                })
    
            context.commit('deleteProduct', payload);
        },

        async onFetchProducts({ getters, commit }, {offset}){
            const products = await ApiService.getProducts(offset, getters["limit"])
            
            commit("updateProductState", products)
        },
    },
    getters:{
        products(state){
            return state.products;
        },
        hasProducts(state){
            return state.products && state.products.length>0;
        },
        prodCategories(state){
            return state.prodCategories;
        },
        limit(){
            return 5
        }
    }
}