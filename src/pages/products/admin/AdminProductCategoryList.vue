<template>
  <ProductCategoryBaseFormField @navigateToCategoryDetail="navigateToCategoryDetail" :userId="userSelector" :onInit="initData" :gotoCreateProduct="gotoCreateProduct">
    <div class="grid formgrid">
      <div class="field col-6 md:col-2">
        <div class="flex flex-column">
          <label for="user" class="mb-1">User</label>
          <UserDropDownPagination id="user" v-model="userSelector"></UserDropDownPagination>
        </div>
      </div>
    </div>
  </ProductCategoryBaseFormField>
</template>

<script>
  import UserDropDownPagination from '../../../components/UserDropDownPagination.vue';
  import RouteName from '../../../domains/Routename';
  import ProductCategoryBaseFormField from '../components/ProductCategoryBaseFormField.vue';

  export default{
    components: { 
      UserDropDownPagination,
      ProductCategoryBaseFormField
    },
    data(){
      return {
        userSelector: null,
      };
    },
    methods:{
      async initData(){
        await this.$store.dispatch("user/fetchUser", {
            offset: 0,
            limit: 10,
        });
      },

      async navigateToCategoryDetail(id){
        await this.$router.push({name: RouteName.adminDetailProductCategoryPage, params:{id: id}})
      },

      gotoCreateProduct(){
        this.$router.push({name: RouteName.adminCreateProductCategoryPage});
      }
    }
}
</script>