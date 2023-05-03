<template>
    <ProductMassCreateTemplate
    :getUserId="getUserId" 
    @onPressImport="onPressImport" 
    @onFinishImport="onFinishImport" 
    >

    </ProductMassCreateTemplate>
</template>

<script>
import { mapGetters } from 'vuex';
import RouteName from '../../domains/Routename';
import ProductMassCreateTemplate from './components/ProductMassCreateTemplate.vue';

    export default{
    components: { ProductMassCreateTemplate },
    computed:{
        ...mapGetters({
            getUserId: "auth/getUserId"
        })
    },
    methods:{
        onPressImport(onImport){
            onImport();
        },

        onFinishImport(failedProducts, totalProducts){
            const myParam = JSON.stringify(failedProducts);
            this.$router.replace({name: RouteName.productListPage, query:{
                errorList: myParam,
                total: totalProducts
            }})
        }
    }
}
</script>