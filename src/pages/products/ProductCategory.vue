<template>
    <ProductCategoryBaseFormField :userId="getUserId" :gotoCreateProduct="gotoCreateProduct" @navigateToCategoryDetail="navigateToCategoryDetail"></ProductCategoryBaseFormField>
</template>

<script>
    import { mapGetters } from "vuex";
    import ProductCategoryBaseFormField from "../products/components/ProductCategoryBaseFormField.vue";
    import RouteName from "../../domains/Routename";

    export default{
        components: {
            ProductCategoryBaseFormField
        },
        computed:{
            ...mapGetters({
                getUserId: "auth/getUserId"
            }),
        },
        methods:{
            gotoCreateProduct(){
                this.$router.push({name: RouteName.productCategoriesListPage});
            },

            async navigateToCategoryDetail(id){
                await this.$router.push({name: RouteName.productCategoriesDetailPage, params:{id: id}})
            },
        }
    }
</script>