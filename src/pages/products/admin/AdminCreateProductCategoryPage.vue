<template>
  <ProductCategoryCreateBase
  :additionalValidation="onValidate"
  :onInit="onInit"
  :onSubmit="onSubmit"
  >
  <div class="field col-12 md:col-6">
    <label :class="{'p-error': validation.userSelector.value}">User</label>
    <UserDropDownPagination v-model="userSelector" :validation="validation.userSelector.value!=null"></UserDropDownPagination>
    <small class="p-error" v-if="validation.userSelector.value">{{ validation.userSelector.value }}</small>
  </div>
    
  </ProductCategoryCreateBase>
</template>

<script>
  import UserDropDownPagination from '../../../components/UserDropDownPagination.vue';
  import RouteName from '../../../domains/Routename';
  import ProductCategoryCreateBase from '../components/ProductCategoryCreateBase.vue';

  export default{
      components: { ProductCategoryCreateBase, UserDropDownPagination },
      data(){
        return {
          userSelector: null,
          validation: {
            userSelector:{
              value: null,
              validate: ()=>{
                if(this.userSelector){
                  return this.validation.userSelector.value=null;
                }

                return this.validation.userSelector.value="User is required!";
              }
            }
          }
        };
      },
      methods:{
        async onInit(){
          await this.$store.dispatch("user/fetchUser", {
            offset: 0,
            limit: 10,
          });
        },

        async onSubmit(categoryName){
          const newProductCat = await this.$store.dispatch('products/addProductCategory', {
            user_id: this.userSelector, category_name: categoryName
          });
          await this.$router.push({ name: RouteName.adminProductCategoryListPage, query: { id: newProductCat.id, name: categoryName } });
        },

        onValidate(){
          const errorList = [];
          for(let i in this.validation){
            errorList.push(this.validation[i].validate());
          }
          const index = errorList.findIndex((e)=>e!=null);
          return index<0;
        }
      }
  }
</script>