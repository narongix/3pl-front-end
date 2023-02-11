import ApiService from "../../../service/ApiService.js";
export default {
    namespaced: true,
    state() {
        return {
            products: [],
            prodCategories: [],
        }
    },
    getters: {
        getProductState(state) {
            return state.products;
        },
        hasProducts(state) {
            return state.products && state.products.length > 0;
        },
        prodCategories(state) {
            return state.prodCategories;
        },
        limit() {
            return 10
        }
    },
    mutations: {
        setProducts(state, productState) {
            state.products = productState.products;
        },
        setProdCategories(state, productState) {
            state.prodCategories = productState.prodCategories;
        },
        onAddProduct(state, productState) {
            productState.forEach(element => {
                const index = state.products.findIndex((e) => e.product_id == element.product_id)
                if (index >= 0) {
                    state.products[index] = element
                } else {
                    state.products.unshift(element)
                }
            });  
        },
        updateProductState(state, productState) {
            productState.forEach(element => {
                const index = state.products.findIndex((e) => e.product_id == element.product_id)
                if (index >= 0) {
                    state.products[index] = element
                } else {
                    state.products.push(element)
                }
            });
        },
        deleteProductState(state, productState) {
            const index = state.products.findIndex(product => product.product_id == productState.id)
            state.products.splice(index, 1)
        },
        onClearState(state) {
            state.products.length = 0
            state.prodCategories.length = 0
        },
        onAddProductCategory(state, payload) {
            payload.forEach((element) => {
                const index = state.prodCategories.findIndex(category => category.id == element.id);
                if (index < 0) {
                    state.prodCategories.unshift(element)
                } else {
                    state.prodCategories[index] = element;
                }
            })
        },
        updateProductCategoryState(state, productState) {
            productState.forEach((element) => {
                const index = state.prodCategories.findIndex(category => category.id == element.id);
                if (index < 0) {
                    state.prodCategories.push(element)
                } else {
                    state.prodCategories[index] = element;
                }
            })
        },
        deleteProductCategoryState(state, productState) {
            const index = state.prodCategories.findIndex(e => e.id == productState.id)
            state.prodCategories.splice(index, 1)
        },
    },
    actions: {
        async getDetailProductOnStockDetail({commit}, {productId, limit, offset}){
            const params = {
                product_id: productId,
                limit: limit, 
                offset: offset,
            }
            const response = await ApiService.getDetailOnProduct(params);
            commit("updateProductState", [response])
            return response
        },

        async getDetailProduct({commit}, productId) {
            const data = {
                product_id: productId
            }
            const response = await ApiService.getDetailOnProduct(data);
            commit("updateProductState", [response])
        },
        async addProduct(context, payload) {
            try {
                const data = {
                    'product_name': payload.name,
                    'sku': payload.sku,
                    product_category_id: payload.categoryId
                }
                const newProduct = await ApiService.addOnProduct(data)
                context.commit('onAddProduct', [newProduct]);
                return newProduct
            } catch (e) {
                const error = new Error(e || 'Cannot add product!');
                throw error;
            }
        },
        async updateProduct(context, payload) {
            const data = {
                'product_name': payload.name,
                'sku': payload.sku,
                'product_category_id': payload.prodCategory.id
            }
            try {
                const newProduct = await ApiService.updateOnProduct(data, payload.id)
                context.commit('updateProductState', [newProduct]);
                return newProduct
            }
            catch (e) {
                const error = new Error(e || 'Cannot update product!');
                throw error;
            }
        },
        async deleteProduct(context, payload) {
            try {
                const data = {
                    productIds: []
                }
                data.productIds.push(payload.id)
                await ApiService.deleteOnProduct(data)
                context.commit('deleteProductState', payload)
            }
            catch (e) {
                const error = new Error(e || 'Cannot delete product!');
                throw error;
            }
        },
        async onFetchProducts({ commit }, { offset, productName, limit }) {
            const myProductName = productName ? productName : ""
            const products = await ApiService.getProducts(offset, limit, myProductName)
            commit("updateProductState", products)
            return products
        },
        async getProdCategories(context) {
            try {
                const categories = await ApiService.getProdCategories()
                context.commit('updateProductCategoryState', categories);
            }
            catch (e) {
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
                context.commit('onAddProductCategory', [newProdCat]);
                return newProdCat
            } catch (e) {
                const error = new Error(e || 'Cannot add product category!');
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
                const error = new Error(e || 'Cannot update product category!');
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
                const error = new Error(e || 'Cannot delete product category!');
                throw error;
            }
        },
    },
}
