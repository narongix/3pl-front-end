<template>
    <CreateProductTemplate @onSubmit="onSubmit">
        
    </CreateProductTemplate>
</template>

<script>
    import CreateProductTemplate from "./components/CreateProductTemplate.vue"

    export default{
        components:{
            CreateProductTemplate
        },

        methods:{
            async onSubmit(newlyCreatedProduct){
                const userId = this.$store.getters["auth/getUserId"];
                const newProduct = await this.$store.dispatch('products/addProduct', {newlyCreatedProduct: newlyCreatedProduct, userId: userId});
                await this.$router.push({ name: "productList", query: { id: newProduct.product_id, name: newProduct.product_name } });
            }
        }
    }
</script>