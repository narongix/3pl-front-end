<template>
    <CreateProductTemplate @onSubmit="onSubmit" :onInit="onInit" :productCategoryOption="prodCategories">
        <template #body>
            <slot name="body">
            </slot>
        </template>
    </CreateProductTemplate>
</template>

<script>
    import { mapGetters } from "vuex";
    import CreateProductTemplate from "./components/CreateProductTemplate.vue"

    export default{
        props: ["onInit"],

        components:{
            CreateProductTemplate
        },

        computed:{
            ...mapGetters({
                prodCategories: "products/prodCategories"
            }),
        },
        methods:{
            async onSubmit(newlyCreatedProduct){
                // const userId = this.$store.getters["auth/getUserId"];
                const newProduct = await this.$store.dispatch('products/addProduct', {newlyCreatedProduct: newlyCreatedProduct, userId: 1});
                this.$toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
                await this.$router.push({ name: "productList", query: { id: newProduct.product_id, name: newProduct.product_name } });
            }
            
        }
    }
</script>