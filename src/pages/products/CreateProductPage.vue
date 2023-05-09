<template>
    <CreateProductTemplate :onSubmit="onSubmit" :onInit="onInit" :productCategoryOption="prodCategories"
    :myUserId="userId">
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
                prodCategories: "products/prodCategories",
                userId: "auth/getUserId"
            }),
        },
        methods:{
            async onSubmit(newlyCreatedProduct){
                this.$toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
                await this.$router.push({ name: "productList", query: { id: newlyCreatedProduct.product_id, name: newlyCreatedProduct.product_name } });   
            }
        }
    }
</script>