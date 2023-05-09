<template>
    <ProductCategoryCreateBase :onSubmit="onSubmit"></ProductCategoryCreateBase>
</template>

<script>
    import { mapGetters } from 'vuex';
    import ProductCategoryCreateBase from './components/ProductCategoryCreateBase.vue';
    import RouteName from '../../domains/Routename';
    export default{
        components:{
            ProductCategoryCreateBase
        },
        computed:{
            ...mapGetters({
                getUserId: "auth/getUserId"
            }),
        },
        methods:{
            async onSubmit(categoryName){
                const newProductCat = await this.$store.dispatch('products/addProductCategory', {
                    user_id: this.getUserId, category_name: categoryName
                });
                await this.$router.push({ name: RouteName.productCategoriesListPage, query: { id: newProductCat.id, name: categoryName } });
            },
        }
    }
</script>