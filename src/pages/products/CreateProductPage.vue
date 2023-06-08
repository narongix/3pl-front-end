<template>
    <CreateProductTemplate :onSubmit="onSubmit" :onInit="onInit" :productCategoryOption="getProductCategories"
    :myUserId="userId" :onCreateProductCategoryRequireUserId="getUserId">
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
                userId: "auth/getUserId"
            }),
            getProductCategories(){
                const productCategories = this.$store.getters["products/prodCategories"].filter((e)=>e.user_id == this.userId);
                return productCategories;
            }
        },
        methods:{
            getUserId(){
                return this.userId;
            },

            async onSubmit(newlyCreatedProduct){
                this.$toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
                await this.$router.push({ name: "productList", query: { id: newlyCreatedProduct.product_id, name: newlyCreatedProduct.product_name } });   
            }
        }
    }
</script>