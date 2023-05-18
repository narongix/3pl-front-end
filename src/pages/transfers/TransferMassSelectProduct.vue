<template>
  <MassCreateTemplate
  @onPressImport="onPressImport" 
  :onValidate="onValidate"
  :getAllFields="getAllFields"
  :templateLink="templateLink"
  >
    <template #importButton>
      <a href="/files/transfer_product_template.xlsx" download="transfer_product_template.xlsx">
        <Button class="mr-2 vertical-align-top fixedWidthButton" label="Download Template" severity="help"></Button>
      </a> 
    </template>

    <template #dialogColumn>
      <Column field="row" header="Index"></Column>
      <Column field="product_name" header="Product Name"></Column>
      <Column field="category_name" header="Category"></Column>
      <Column field="sku" header="Product Reference"></Column>
      <Column field="demand" header="Demand"></Column>
    </template>
  </MassCreateTemplate>
  <RetryField :toLoad="toLoad" :errorToast="errorToast"></RetryField>
</template>

<style src="../../assets/styles/style.css"></style>

<style scoped>
  .myCustomUser{
    display: inline-flex;
    flex-direction: column;
  }
</style>

<script>
  import MassCreateTemplate from '../../components/MassCreateTemplate.vue';
  import RetryField from '../../components/prompt_field/RetryField.vue';
  import RouteName from '../../domains/Routename';
  import mixin from '../../domains/mixin';

  export default{
    mixins:[mixin.checkTransferProductMassSelect],
    components: { MassCreateTemplate, RetryField },
    data(){
      return {
        toLoad: null
      };
    },
    created(){

      if(this.getUserId==null){
        this.$router.replace({name: RouteName.transferCreatePage});
      }
    },
    computed:{
      errorToast() {
          return {
              severity: "error",
              summary: "Error!",
              detail: "Failed Creating Products!"
          };
      },
      getUserId(){
        return this.$store.getters["transferCreateState/getUserId"];
      }
    },
    methods:{
      onPressImport(prepData){
        this.toLoad = async ()=>{
          const res = await this.$store.dispatch("products/findProducts",{
              userId: this.getUserId,
              products: prepData
          });
          this.onFinishImport(res.successList, res.errorList);
        }
      },
      onFinishImport(successProduct, failedProducts){
        this.$store.dispatch("transferCreateState/onUpdateSuccessList", successProduct);
        this.$store.dispatch("transferCreateState/onUpdateErrorList", failedProducts);
        this.$router.replace({name: RouteName.transferCreatePage, query:{total: successProduct.length + failedProducts.length}});
      }
    }
  }
</script>