import ApiService from "../../../service/ApiService.js";

export default {
    namespaced: true,
    state() {
        return {
            products: [],
            prodCategories: []
        }
    },
    getters: {

        getProductState(state){
            return state.products;
        },
        hasProducts(state){
            return state.products && state.products.length>0;
        },
        prodCategories(state){
            return state.prodCategories;
        },
        limit(){
            return 10
        }
    },
    mutations: {
        setProducts(state, payload) {
            state.products = payload.products;
        },

        setProdCategories(state, payload) {
            state.prodCategories = payload.prodCategories;
        },

        updateProduct(state, payload) {
            const data = {
                id: payload.id,
                name: payload.name ?? "",
                sku: payload.sku ?? "",
                upc: payload.upc ?? ""
            }

            const index = state.products.findIndex(product => product.product_id == data.id);

            if (state.products[index]) {
                state.products[index] = Object.assign(state.products[index], data);
            }
        },

        deleteProductState(state, payload) {
            const index = state.products.findIndex(product => product.product_id == payload.id)
            state.products.splice(index, 1)
        },

      deleteProduct(state, payload) {
        state.products = state.products.filter(val => val.id !== payload.id);
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
        },
        
        onClearState(state){
            state.products.length=0
            state.prodCategories.length=0
        }
    },

        updateProductCategoryState(state, payload) {
            payload.forEach((element) => {
                const index = state.prodCategories.findIndex(category => category.id == element.id);
                if (index < 0) {
                    state.prodCategories.unshift(element)
                } else {
                    state.prodCategories[index] = element;
                }
            })
        },

        deleteProductCategoryState(state, payload) {
            const index = state.prodCategories.findIndex(e => e.id == payload.id)
            state.prodCategories.splice(index, 1)
        },

        updateProductState(state, products) {

            products.forEach(element => {
                const index = state.products.findIndex((e) => e.product_id == element.product_id)
                if (index >= 0) {
                    state.products[index] = element
                } else {
                    state.products.unshift(element)
                }
            });
        },
    actions: {  
        async addProduct(context, payload) {
            try {
                const data = {
                    'product_name': payload.name,
                    'sku': payload.sku,
                }
                const products = await ApiService.addOnProduct(data)
                context.commit('updateProductState', [products]);
                return products
            } catch (e) {
                const error = new Error(e || 'Cannot add products!');
                throw error;
            }
        },

        async getProducts(context, params) {
            //TODO: Refactor this to API layer
            const config = {
                headers: { Authorization: `Bearer ${localStorage.accessToken}` }
            };

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
            const data = {
                'product_name': payload.name,
                'sku': payload.sku,
            }
            try{
                const products = await ApiService.updateOnProduct(data, payload.id)
                context.commit('updateProduct', products);  
                return products
            }   
            catch(e) {
                const error = new Error(e || 'Cannot update products!');
                throw error;
            }         
        },
        async deleteProduct(context, payload) {
            try{
                const data = {
                    productIds: []
                }
                data.productIds.push(payload.id)

                await ApiService.deleteOnProduct(data)
                context.commit('deleteProductState', payload)
            }
            catch (e) {
                const error = new Error(e || 'Cannot delete products!');
                throw error;
            }
        },

        async onFetchProducts({ getters, commit }, {offset, productName}){
            const myProductName = productName? productName : ""

            const products = await ApiService.getProducts(offset, getters["limit"], myProductName)

            commit("updateProductState", products)
            
            return products
        },
    },
    getters:{
        getProductState(state){
            return state.products;
        },
            
        // List for Product Categories
        async getProdCategories(context, params) {
            try{
                const categories = await ApiService.getProdCategories()
                context.commit('updateProductCategoryState', categories);
            }
            catch(e) {
                const error = new Error(e || 'Cannot retrieve categories!');
                throw error;
            }
        },

        async addProductCategory(context, payload) {
            try {
                const categories = await ApiService.addOnProductCategory(payload)
                const newProdCat = {
                    category_name: payload.category_name,
                    id: categories.id.id
                }
                context.commit('updateProductCategoryState', [newProdCat]);
                return newProdCat
            } catch (e) {
                const error = new Error(e || 'Cannot add category!');
                throw error;
            }
        },

        async updateProductCategory({ commit }, { payload }) {
            const data = {
                "category_name": payload.category_name
            }
            try {
                const categories = await ApiService.updateOnProductCategory(payload.id, data)
                commit('updateProductCategoryState', [categories]);

                return categories;
            } catch (e) {
                const error = new Error(e || 'Cannot update category!');
                throw error;
            }
        },

        async deleteProductCategory(context, { payload }) {
            try {
                const data = {
                    productCategoryIds: []
                }
                data.productCategoryIds.push(payload.id)

                await ApiService.deleteOnProductCategory(data)
                context.commit('deleteProductCategoryState', payload)

            } catch (e) {
                const error = new Error(e || 'Cannot delete products!');
                throw error;
            }
        },
    },
}