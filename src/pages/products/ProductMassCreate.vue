<template>
    <MassCreateTemplate 
    @onPressImport="onPressImport" 
    :onValidate="onValidate"
    :getAllFields="getAllFields"
    :templateLink="templateLink"
    >
    <template #importButton>
        <a href="/files/product_template.xlsx" download="product_template.xlsx">
            <Button class="mr-2" label="Download Template" severity="help">Download Template</Button>
        </a> 
    </template>
    <template #dialogColumn>
        <Column field="row" header="Index"></Column>
        <Column field="product_name" header="Product Name"></Column>
        <Column field="category_name" header="Category"></Column>
        <Column field="sku" header="Product Reference"></Column>
    </template>
    </MassCreateTemplate>
    <RetryField :toLoad="toLoad" errorToast="errorToast"></RetryField>
</template>

<script>
    import { mapGetters } from 'vuex';
    import RouteName from '../../domains/Routename';
    import MassCreateTemplate from '../../components/MassCreateTemplate.vue';
    import RetryField from '../../components/prompt_field/RetryField.vue';
    import mixin from '../../domains/mixin';

    export default{
        mixins:[mixin.checkProductMassCreate],
        data(){
            return {
                toLoad: null
            };
        },
        components: { MassCreateTemplate, RetryField },
        computed:{
            ...mapGetters({
                getUserId: "auth/getUserId"
            }),

            errorToast() {
                return {
                    severity: "error",
                    summary: "Error!",
                    detail: "Failed Creating Products!"
                };
            }
        },
        methods:{
            async onPressImport(prepData){
                const newProuctListToCreate = prepData.filter((e)=>e.reason.length==0);
                const data = await this.$store.dispatch("products/addMassProduct",{
                    userId: this.getUserId,
                    products: newProuctListToCreate
                });
                this.onFinishImport(data.errorList, data.successList, prepData.length);
            },

            onFinishImport(failedProducts, successProducts, totalProducts){
                const myFailedProduct = JSON.stringify(failedProducts);
                const mySuccessProduct = JSON.stringify(successProducts);
                this.$router.replace({name: RouteName.productListPage, query:{
                    errorList: myFailedProduct,
                    successList: mySuccessProduct,
                    total: totalProducts
                }});
            }
        }
    }
</script>