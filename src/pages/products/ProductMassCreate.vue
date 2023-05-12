<template>
    <MassCreateTemplate
    @onPressImport="onPressImport" 
    @onFinishImport="onFinishImport" 
    :onValidate="onValidate"
    :getAllFields="getAllFields"
    :templateLink="templateLink"
    >

    </MassCreateTemplate>
    <RetryField :toLoad="toLoad" :errorToast="errorToast"></RetryField>
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
                this.onFinishImport(data.products, prepData.length);
            },

            onFinishImport(failedProducts, totalProducts){
                const myParam = JSON.stringify(failedProducts);
                this.$router.replace({name: RouteName.productListPage, query:{
                    errorList: myParam,
                    total: totalProducts
                }});
            }
        }
    }
</script>