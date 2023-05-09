<template>
  <ProductCategoryDetailBasePage :navigateToPage="navigateToPage"></ProductCategoryDetailBasePage>
</template>

<script>
  import RouteName from '../../domains/Routename';
  import ProductCategoryDetailBasePage from './components/ProductCategoryDetailBasePage.vue';

  export default{
    components: { ProductCategoryDetailBasePage },
    methods:{
      async navigateToPage(newProductCat){
        await this.$router.push({name: RouteName.productCategoriesListPage, query: { id: newProductCat.id, name: newProductCat.category_name }});
      },
    }

}
</script>