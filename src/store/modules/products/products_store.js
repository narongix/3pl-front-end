import ApiService from "../../../service/ApiService.js";
import TimeConvert from "../../../components/utils/TimeConvert.js";
import { sortType } from "../../../domains/domain.js";
import JsonObject from "../../../components/utils/JsonObject.js";

export default {
    namespaced: true,
    state() {
        return {
            products: [],
            maxProductLength: 0,
            prodCategories: [],

            totalSkus: [],
        }
    },
    getters: {
        getProductLength(state){
            return state.maxProductLength
        },

        getAllSkus(state){
            return state.totalSkus;
        },

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
        addSku(state, sku){
            state.totalSkus.push(...sku);
        },
        setProductLength(state, productLength){
            state.maxProductLength = productLength
        },

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

        IntegrateProductMoveWithProduct(state, {data, id}){
            const index = state.products.findIndex((e)=>e.product_id==id);
            // I know, this is stupid but it does work, push accepts multiple argument
            // so with the spread operator, this is possible.
            state.products[index]["product_moves"].push(...data); 
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
            });
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
            // state.prodCategories[index].archived=1
            state.prodCategories.splice(index, 1)
        },

    },
    actions: {
        async getProductLength({ commit }, myParams){
            const myProductReference = myParams?.productReference?.map((e)=>e?.trim());
            const myProductId = myParams?.productId?.map((e)=>e?.trim());
            const params = {
                user_id: myParams?.userId,
                product_reference: myProductReference,
                search_key: myParams?.searchKey,
                product_id: myProductId,
                product_name: myParams?.productName
            };
            const maxProductLength = await ApiService.getProductLength(params);
            commit("setProductLength", maxProductLength.total_products);
        },

        async getDetailProductOnStockDetail({commit}, {productId, limit, offset, barcode, userId, fromDate, toDate}){
            const newFromDate = TimeConvert.formatDateToStockFormat(fromDate);
            const newToDate = TimeConvert.formatDateToStockFormat(toDate);

            const params = {
                product_id: productId ?? null,
                barcode: barcode ?? null,
                limit: limit, 
                offset: offset,
                user_id: userId,
                from_date: newFromDate,
                to_date: newToDate
            };

            const response = await ApiService.getDetailOnProduct(params);
            commit("updateProductState", [response]);
            return response;
        },

        async getDetailProduct({commit}, {productId}) {
            const data = {
                product_id: productId
            }
            const response = await ApiService.getDetailOnProduct(data);
            commit("updateProductState", [response])
            return response;
        },

        async getProductMoves({ commit }, {fromDate, toDate, productId, userId}){
            const newFromDate = TimeConvert.formatDateToStockFormat(fromDate);
            const newToDate = TimeConvert.formatDateToStockFormat(toDate);
            
            const params ={
                product_id: productId,
                from_date: newFromDate,
                to_date: newToDate,
                user_id: userId
            }
            const response = await ApiService.getProductMoves(params);
            
            commit("IntegrateProductMoveWithProduct", {id: productId, data: response.rows});
            return response;
        },

        async addProduct(context, {newlyCreatedProduct, userId}) {
            try {
                const data = {
                    'product_name': newlyCreatedProduct.name,
                    'sku': newlyCreatedProduct.sku,
                    product_category_id: newlyCreatedProduct.categoryId,
                    user_id: userId
                }
                const newProduct = await ApiService.addOnProduct(data)
                
                context.commit('onAddProduct', [newProduct]);
                context.commit("addSku", [newlyCreatedProduct.sku]);
                return newProduct
            } catch (e) {
                const error = await e;
                throw error;
            }
        },
        
        async addMassProduct({ commit }, {products, userId}){
            const data ={
                products,
                user_id: userId
            };
            const newlyCreatedProduct = await ApiService.addMassProducts(data);
            commit("updateProductState", newlyCreatedProduct.data.products);
            return newlyCreatedProduct.data;
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
        async onFetchProducts({ commit }, { offset, productName, limit, searchKey, userId, productId, productReference, sortName, mySortType}) {
            const mySort = mySortType!=null ? sortType[mySortType] : null;
            const myProductReference = productReference?.map((e)=>e?.trim());
            const myProductId = productId?.map((e)=>e?.trim());

            const params = {
                offset: offset,
                limit: limit,
                product_name: productName,
                search_key: searchKey,
                user_id: userId,
                product_id: myProductId,
                product_reference: myProductReference,
                sort_name: sortName ?? null,
                sort_type: mySort
            }

            JsonObject.removeNullValue(params);
            const products = await ApiService.getProducts(params)
            commit("updateProductState", products)

            return products
        },
        async getProdCategories({ commit }, {userId, offset, limit}) {
            try {
                const params = {
                    user_id: userId,
                    offset: offset,
                    limit: limit
                }

                const categories = await ApiService.getProdCategories(params);
                commit('updateProductCategoryState', categories);
            }
            catch (e) {
                const error = new Error(e || 'Cannot retrieve categories!');
                throw error;
            }
        },
        async addProductCategory(context, payload) {
            try {
                const param = {
                    category_name: payload.category_name,
                    user_id: payload.user_id
                }
                const categories = await ApiService.addOnProductCategory(param)
                const newProdCat = {
                    category_name: payload.category_name,
                    id: categories.id,
                    user_id: payload.user_id
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

        async getTotalSku({ commit }){
            const data = await ApiService.getTotalSku();
            commit("addSku", data);
            return data;
        }
    },
}
