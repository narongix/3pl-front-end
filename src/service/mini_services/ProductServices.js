import ApiConfig from "../ApiConfig"

export default {
    async getProductLength(params){
        const res = await ApiConfig.getMethods({
            api:"/product/total",
            params: params
        });
        return res.data;
    },
    
    async getProducts(params) {
        const res = await ApiConfig.getMethods({
            api: "/product/list",
            params: params
        })
        return res.data
    },
    // get detail history product 
    async getDetailOnProduct(params) {
        const res = await ApiConfig.getMethods({
            api: `/product/list_detail`,
            params: params
        })
        return res.data
    },

    async getAllProductMovement(params){
        const res = await ApiConfig.getMethods({
            api: "/product/all_product_movement",
            params: params
        });
        return res.data;
    },

    async getProductMoves(params){
        const res = await ApiConfig.getMethods({
            api: "/product/product_move",
            params: params
        });
        
        return res.data;
    },

    async addOnProduct(product) {
        const res = await ApiConfig.postMethods({
            api: "/product/add",
            data: product,
            contentType: "application/json"
        })
        return res.data
    },

    async addMassProducts(products){
        const res = await ApiConfig.postMethods({
            api: "/product/add_batch",
            data: products
        });
        return res.data;
    },

    async updateOnProduct(product, id) {
        const res = await ApiConfig.patchMethods({
            api: `/product/${id}`,
            data: product,
            contentType: "application/json"
        })
        return res.data
    },

    async deleteOnProduct(product) {
        const res = await ApiConfig.deleteMethods({
            api: `/product`,
            data: product
        })
        return res.data
    },

    async getProdCategories(params) {
        const res = await ApiConfig.getMethods({
            api: '/category',
            params: params
        })

        return res.data
    },

    async addOnProductCategory(category) {
        const res = await ApiConfig.postMethods({
            api: "/category/add",
            data: category,
            contentType: "application/json"
        })
        return res.data
    },

    async updateOnProductCategory(category) {
        const res = await ApiConfig.patchMethods({
            api: `/category/${category.id}`,
            data: category,
            contentType: "application/json"
        })
        return res.data
    },

    async deleteOnProductCategory(category) {
        const res = await ApiConfig.deleteMethods({
            api: "/category",
            data: category
        })
        return res.data
    },

    async findProducts(data){
        const res = await ApiConfig.postMethods({
            api: "/product/find",
            data: data
        });
        return res.data;
    }
}